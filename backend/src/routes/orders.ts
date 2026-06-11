import { Router, Request, Response } from 'express';
import db from '../db/sqlite.js';

const router = Router();

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateOrderNumber(outletId: string) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = db.prepare(`
    SELECT COUNT(*) as cnt FROM orders 
    WHERE outlet_id = ? AND date(created_at) = date('now')
  `).get(outletId) as { cnt: number };
  const seq = String((count?.cnt || 0) + 1).padStart(3, '0');
  return `SNY-${today.slice(4)}-${seq}`;
}

// POST /api/orders — Buat order baru
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      outletId, userId, shiftId,
      orderType, tableNumber, platformOrderId,
      items, payments: paymentMethods,
      discountType, discountValue, discountAmount,
      notes
    } = req.body;

    if (!outletId || !userId || !shiftId || !items?.length || !paymentMethods?.length) {
      return res.status(400).json({ success: false, error: 'Data order tidak lengkap' });
    }

    // Hitung subtotal
    let subtotal = 0;
    for (const item of items) {
      const basePrice = item.price * item.quantity;
      const modTotal = (item.modifiers || []).reduce((s: number, m: any) => s + (m.price_adjustment * item.quantity), 0);
      subtotal += basePrice + modTotal;
    }

    // Service charge
    const scConfig = db.prepare('SELECT * FROM service_charge_config WHERE outlet_id = ?').get(outletId) as any;
    const scRate = (scConfig?.is_enabled && scConfig?.rate) || 0;
    const afterDiscount = subtotal - (discountAmount || 0);
    const serviceChargeAmount = Math.round(afterDiscount * scRate);
    const total = afterDiscount + serviceChargeAmount;

    const orderId = generateId();
    const orderNumber = generateOrderNumber(outletId);

    // Insert order
    db.prepare(`
      INSERT INTO orders (
        id, outlet_id, order_number, type, table_number,
        user_id, shift_id, subtotal,
        discount_type, discount_value, discount_amount,
        service_charge_amount, total, notes, status, platform_order_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `).run(
      orderId, outletId, orderNumber, orderType, tableNumber || null,
      userId, shiftId, subtotal,
      discountType || null, discountValue || 0, discountAmount || 0,
      serviceChargeAmount, total, notes || null, platformOrderId || null
    );

    // Insert order items
    const insertItem = db.prepare(`
      INSERT INTO order_items (id, order_id, menu_item_id, name, price, quantity, item_status, station_id, notes)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `);
    const insertModifier = db.prepare(`
      INSERT INTO order_item_modifiers (id, order_item_id, modifier_option_id, name, price_adjustment)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      const itemId = generateId();
      insertItem.run(itemId, orderId, item.menuItemId, item.name, item.price, item.quantity, item.stationId || null, item.notes || null);

      for (const mod of (item.modifiers || [])) {
        insertModifier.run(generateId(), itemId, mod.optionId, mod.name, mod.price_adjustment || 0);
      }
    }

    // Insert payments
    const insertPayment = db.prepare(`
      INSERT INTO payments (id, order_id, method, amount, change_amount, platform_ref)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const p of paymentMethods) {
      insertPayment.run(generateId(), orderId, p.method, p.amount, p.change || 0, p.platformRef || null);
    }

    // Fetch full order
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    const orderItems = db.prepare(`
      SELECT oi.*, 
        GROUP_CONCAT(oim.name || ':' || oim.price_adjustment, '|') as modifiers_raw
      FROM order_items oi
      LEFT JOIN order_item_modifiers oim ON oim.order_item_id = oi.id
      WHERE oi.order_id = ?
      GROUP BY oi.id
    `).all(orderId);

    res.json({
      success: true,
      data: { ...order, order_number: orderNumber, items: orderItems }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Gagal membuat order' });
  }
});

// GET /api/orders/shift/:shiftId — Riwayat order per shift
router.get('/shift/:shiftId', (req: Request, res: Response) => {
  try {
    const { shiftId } = req.params;
    const orders = db.prepare(`
      SELECT o.*, u.name as cashier_name,
        (SELECT GROUP_CONCAT(p.method || ':' || p.amount, '|') FROM payments p WHERE p.order_id = o.id) as payments_raw
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      WHERE o.shift_id = ?
      ORDER BY o.created_at DESC
    `).all(shiftId) as any[];

    // Attach items to each order
    const result = orders.map((order: any) => {
      const items = db.prepare(`
        SELECT oi.*, 
          GROUP_CONCAT(oim.name, ', ') as modifier_names
        FROM order_items oi
        LEFT JOIN order_item_modifiers oim ON oim.order_item_id = oi.id
        WHERE oi.order_id = ?
        GROUP BY oi.id
      `).all(order.id);
      return { ...order, items };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Gagal memuat riwayat' });
  }
});

// PUT /api/orders/:id/void — Void order
router.put('/:id/void', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, voidBy } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, error: 'Alasan void wajib diisi' });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order tidak ditemukan' });
    }
    if (order.status === 'voided') {
      return res.status(400).json({ success: false, error: 'Order sudah di-void' });
    }

    db.prepare(`
      UPDATE orders SET status = 'voided', void_reason = ?, void_by = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(reason, voidBy || null, id);

    res.json({ success: true, message: 'Order berhasil di-void' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Gagal melakukan void' });
  }
});

// GET /api/orders/config/:outletId — Config untuk POS (service charge, settings)
router.get('/config/:outletId', (req: Request, res: Response) => {
  try {
    const { outletId } = req.params;
    const sc = db.prepare('SELECT * FROM service_charge_config WHERE outlet_id = ?').get(outletId);
    const settings = db.prepare('SELECT * FROM outlet_settings WHERE outlet_id = ?').get(outletId) as any;

    res.json({
      success: true,
      data: {
        service_charge: sc,
        settings: {
          ...settings,
          payment_methods_enabled: settings?.payment_methods_enabled
            ? JSON.parse(settings.payment_methods_enabled)
            : {}
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Gagal memuat konfigurasi' });
  }
});

export default router;
