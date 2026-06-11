import { Router, Request, Response } from 'express';
import db from '../db/sqlite.js';

const router = Router();

// GET /api/menu/outlet/:outletId — Semua data menu (categories + items + modifiers)
router.get('/outlet/:outletId', (req: Request, res: Response) => {
  try {
    const { outletId } = req.params;

    const categories = db.prepare(`
      SELECT id, name, emoji, order_index, station_id
      FROM menu_categories
      WHERE outlet_id = ? AND is_active = 1
      ORDER BY order_index ASC
    `).all(outletId);

    const items = db.prepare(`
      SELECT mi.id, mi.name, mi.price, mi.emoji, mi.photo_url, mi.category_id, mi.station_id
      FROM menu_items mi
      WHERE mi.outlet_id = ? AND mi.is_active = 1
      ORDER BY mi.name ASC
    `).all(outletId) as any[];

    // Fetch modifier groups for all items
    const modifierGroups = db.prepare(`
      SELECT 
        mim.menu_item_id,
        mg.id as group_id, mg.name as group_name, mg.is_required, mg.min_select, mg.max_select
      FROM menu_item_modifiers mim
      JOIN modifier_groups mg ON mg.id = mim.modifier_group_id
      WHERE mg.outlet_id = ?
    `).all(outletId) as any[];

    const modifierOptions = db.prepare(`
      SELECT mo.id, mo.group_id, mo.name, mo.price_adjustment
      FROM modifier_options mo
      JOIN modifier_groups mg ON mg.id = mo.group_id
      WHERE mg.outlet_id = ?
      ORDER BY mo.rowid ASC
    `).all(outletId) as any[];

    // Build map: itemId -> groups with options
    const itemModifiers: Record<string, any[]> = {};
    for (const group of modifierGroups) {
      if (!itemModifiers[group.menu_item_id]) {
        itemModifiers[group.menu_item_id] = [];
      }
      const options = modifierOptions.filter((o: any) => o.group_id === group.group_id);
      const existingGroup = itemModifiers[group.menu_item_id].find((g: any) => g.id === group.group_id);
      if (!existingGroup) {
        itemModifiers[group.menu_item_id].push({
          id: group.group_id,
          name: group.group_name,
          is_required: Boolean(group.is_required),
          min_select: group.min_select,
          max_select: group.max_select,
          options: options.map((o: any) => ({
            id: o.id,
            name: o.name,
            price_adjustment: o.price_adjustment,
          })),
        });
      }
    }

    // Attach modifiers to items
    const enrichedItems = items.map((item: any) => ({
      ...item,
      modifier_groups: itemModifiers[item.id] || [],
    }));

    res.json({
      success: true,
      data: { categories, items: enrichedItems }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Gagal memuat menu' });
  }
});

export default router;
