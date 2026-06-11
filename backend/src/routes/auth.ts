import { Router, Request, Response } from 'express';
import db from '../db/sqlite.js';
import bcrypt from 'bcryptjs';

const router = Router();

// GET /api/auth/staff/:outletId — List kasir aktif untuk login screen
router.get('/staff/:outletId', (req: Request, res: Response) => {
  try {
    const { outletId } = req.params;
    const staff = db.prepare(`
      SELECT id, name, role
      FROM users
      WHERE outlet_id = ? AND is_active = 1 AND role IN ('kasir', 'manager', 'owner')
      ORDER BY role DESC, name ASC
    `).all(outletId) as Array<{ id: string; name: string; role: string }>;

    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Gagal memuat daftar staf' });
  }
});

// POST /api/auth/login — Verifikasi PIN
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { userId, pin } = req.body;
    if (!userId || !pin) {
      return res.status(400).json({ success: false, error: 'userId dan PIN wajib diisi' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ? AND is_active = 1').get(userId) as any;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Pengguna tidak ditemukan' });
    }

    const valid = bcrypt.compareSync(pin, user.pin_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'PIN salah' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        outlet_id: user.outlet_id,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Login gagal' });
  }
});

// POST /api/auth/verify-manager-pin — Verifikasi PIN Manager/Owner untuk operasi khusus
router.post('/verify-manager-pin', async (req: Request, res: Response) => {
  try {
    const { pin, outletId } = req.body;
    if (!pin || !outletId) {
      return res.status(400).json({ success: false, error: 'PIN dan outletId wajib' });
    }

    const managers = db.prepare(`
      SELECT * FROM users WHERE outlet_id = ? AND role IN ('manager','owner') AND is_active = 1
    `).all(outletId) as any[];

    for (const mgr of managers) {
      if (bcrypt.compareSync(pin, mgr.pin_hash)) {
        return res.json({ success: true, data: { id: mgr.id, name: mgr.name, role: mgr.role } });
      }
    }

    res.status(401).json({ success: false, error: 'PIN Manager tidak valid' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Verifikasi gagal' });
  }
});

// GET /api/auth/outlets — List semua outlet aktif
router.get('/outlets', (_req: Request, res: Response) => {
  try {
    const outlets = db.prepare('SELECT id, name FROM outlets WHERE is_active = 1 ORDER BY name ASC').all();
    res.json({ success: true, data: outlets });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Gagal memuat outlet' });
  }
});

export default router;

