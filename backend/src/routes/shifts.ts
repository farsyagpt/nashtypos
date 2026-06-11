import { Router, Request, Response } from 'express';
import db from '../db/sqlite.js';

const router = Router();

// GET /api/shifts/active/:outletId — Cek shift aktif
router.get('/active/:outletId', (req: Request, res: Response) => {
  try {
    const { outletId } = req.params;
    const shift = db.prepare(`
      SELECT s.*, u.name as user_name
      FROM shifts s
      JOIN users u ON u.id = s.user_id
      WHERE s.outlet_id = ? AND s.status = 'open'
      ORDER BY s.started_at DESC
      LIMIT 1
    `).get(outletId);

    res.json({ success: true, data: shift || null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Gagal memuat shift' });
  }
});

// POST /api/shifts — Buka shift baru
router.post('/', (req: Request, res: Response) => {
  try {
    const { outletId, userId, openingCash = 0 } = req.body;
    if (!outletId || !userId) {
      return res.status(400).json({ success: false, error: 'outletId dan userId wajib' });
    }

    // Pastikan tidak ada shift yang sedang aktif
    const existing = db.prepare(`
      SELECT id FROM shifts WHERE outlet_id = ? AND status = 'open' LIMIT 1
    `).get(outletId);

    if (existing) {
      return res.status(400).json({ success: false, error: 'Sudah ada shift yang sedang aktif' });
    }

    const id = generateId();
    db.prepare(`
      INSERT INTO shifts (id, outlet_id, user_id, opening_cash, status)
      VALUES (?, ?, ?, ?, 'open')
    `).run(id, outletId, userId, openingCash);

    const shift = db.prepare('SELECT * FROM shifts WHERE id = ?').get(id);
    res.json({ success: true, data: shift });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Gagal membuka shift' });
  }
});

// PUT /api/shifts/:id/close — Tutup shift
router.put('/:id/close', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { closingCash } = req.body;

    const shift = db.prepare('SELECT * FROM shifts WHERE id = ? AND status = "open"').get(id);
    if (!shift) {
      return res.status(404).json({ success: false, error: 'Shift tidak ditemukan atau sudah ditutup' });
    }

    db.prepare(`
      UPDATE shifts SET status = 'closed', ended_at = datetime('now'), closing_cash = ? WHERE id = ?
    `).run(closingCash ?? null, id);

    // Hitung summary
    const summary = db.prepare(`
      SELECT 
        COUNT(CASE WHEN status != 'voided' THEN 1 END) as total_orders,
        SUM(CASE WHEN status != 'voided' THEN total ELSE 0 END) as gross_sales,
        SUM(CASE WHEN status != 'voided' THEN discount_amount ELSE 0 END) as total_discount,
        SUM(CASE WHEN status != 'voided' THEN service_charge_amount ELSE 0 END) as total_service_charge,
        COUNT(CASE WHEN status = 'voided' THEN 1 END) as void_count
      FROM orders WHERE shift_id = ?
    `).get(id) as any;

    res.json({ success: true, data: { ...shift, ...summary } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Gagal menutup shift' });
  }
});

// GET /api/shifts/:id/summary — Rekap shift
router.get('/:id/summary', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const orders = db.prepare(`
      SELECT o.*, 
        GROUP_CONCAT(p.method || ':' || p.amount, '|') as payment_breakdown
      FROM orders o
      LEFT JOIN payments p ON p.order_id = o.id
      WHERE o.shift_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all(id) as any[];

    const summary = db.prepare(`
      SELECT 
        COUNT(CASE WHEN o.status != 'voided' THEN 1 END) as total_orders,
        COALESCE(SUM(CASE WHEN o.status != 'voided' THEN o.subtotal ELSE 0 END), 0) as gross_sales,
        COALESCE(SUM(CASE WHEN o.status != 'voided' THEN o.discount_amount ELSE 0 END), 0) as total_discount,
        COALESCE(SUM(CASE WHEN o.status != 'voided' THEN o.service_charge_amount ELSE 0 END), 0) as total_sc,
        COALESCE(SUM(CASE WHEN o.status != 'voided' THEN o.total ELSE 0 END), 0) as net_sales,
        COUNT(CASE WHEN o.status = 'voided' THEN 1 END) as void_count
      FROM orders o WHERE o.shift_id = ?
    `).get(id) as any;

    // Payment breakdown by method
    const paymentByMethod = db.prepare(`
      SELECT p.method, SUM(p.amount) as total
      FROM payments p
      JOIN orders o ON o.id = p.order_id
      WHERE o.shift_id = ? AND o.status != 'voided'
      GROUP BY p.method
    `).all(id);

    res.json({
      success: true,
      data: { summary, orders, payment_by_method: paymentByMethod }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Gagal memuat rekap shift' });
  }
});

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default router;
