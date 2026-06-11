import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { z } from 'zod';

const router = Router();

const orderItemSchema = z.object({
  menu_item_id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  station_id: z.string().uuid(),
  modifiers: z.array(z.object({
    modifier_option_id: z.string().uuid(),
    name: z.string(),
    price_adjustment: z.number()
  })).optional()
});

const createOrderSchema = z.object({
  outlet_id: z.string().uuid(),
  type: z.enum(['dine_in', 'take_away', 'gofood', 'grabfood', 'shopee']),
  table_number: z.string().optional().nullable(),
  customer_id: z.string().uuid().optional().nullable(),
  user_id: z.string().uuid(),
  shift_id: z.string().uuid(),
  subtotal: z.number(),
  discount_type: z.string().optional().nullable(),
  discount_value: z.number().optional().nullable(),
  discount_amount: z.number(),
  tax_amount: z.number(),
  service_charge_amount: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  items: z.array(orderItemSchema)
});

// Create Order
router.post('/', async (req: Request, res: Response, next) => {
  try {
    const data = createOrderSchema.parse(req.body);

    const orderNumber = await generateOrderNumber(data.outlet_id);

    // Insert Order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        outlet_id: data.outlet_id,
        order_number: orderNumber,
        type: data.type,
        table_number: data.table_number,
        status: 'new',
        customer_id: data.customer_id,
        user_id: data.user_id,
        shift_id: data.shift_id,
        subtotal: data.subtotal,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        discount_amount: data.discount_amount,
        tax_amount: data.tax_amount,
        service_charge_amount: data.service_charge_amount,
        total: data.total,
        notes: data.notes
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      throw new Error(`Failed to insert order: ${orderError?.message}`);
    }

    // Insert Items and Modifiers
    for (const item of data.items) {
      const { data: newItem, error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: newOrder.id,
          menu_item_id: item.menu_item_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_status: 'new',
          station_id: item.station_id
        })
        .select()
        .single();

      if (itemError || !newItem) continue;

      if (item.modifiers && item.modifiers.length > 0) {
        const modifiersToInsert = item.modifiers.map(mod => ({
          order_item_id: newItem.id,
          modifier_option_id: mod.modifier_option_id,
          name: mod.name,
          price_adjustment: mod.price_adjustment
        }));

        await supabase.from('order_item_modifiers').insert(modifiersToInsert);
      }
    }

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    next(err);
  }
});

// Update Order Status
router.patch('/:id/status', async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const { status } = z.object({ status: z.string() }).parse(req.body);

    const updateData: any = { status, updated_at: new Date().toISOString() };
    
    if (status === 'ready') {
      updateData.ready_at = new Date().toISOString();
    } else if (status === 'served') {
      updateData.served_at = new Date().toISOString();
    }

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    next(err);
  }
});

export default router;
