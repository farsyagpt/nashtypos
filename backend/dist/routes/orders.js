"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("../config/supabase.js");
const orderNumber_js_1 = require("../utils/orderNumber.js");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const orderItemSchema = zod_1.z.object({
    menu_item_id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    price: zod_1.z.number(),
    quantity: zod_1.z.number().int().positive(),
    station_id: zod_1.z.string().uuid(),
    modifiers: zod_1.z.array(zod_1.z.object({
        modifier_option_id: zod_1.z.string().uuid(),
        name: zod_1.z.string(),
        price_adjustment: zod_1.z.number()
    })).optional()
});
const createOrderSchema = zod_1.z.object({
    outlet_id: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['dine_in', 'take_away', 'gofood', 'grabfood', 'shopee']),
    table_number: zod_1.z.string().optional().nullable(),
    customer_id: zod_1.z.string().uuid().optional().nullable(),
    user_id: zod_1.z.string().uuid(),
    shift_id: zod_1.z.string().uuid(),
    subtotal: zod_1.z.number(),
    discount_type: zod_1.z.string().optional().nullable(),
    discount_value: zod_1.z.number().optional().nullable(),
    discount_amount: zod_1.z.number(),
    tax_amount: zod_1.z.number(),
    service_charge_amount: zod_1.z.number(),
    total: zod_1.z.number(),
    notes: zod_1.z.string().optional().nullable(),
    items: zod_1.z.array(orderItemSchema)
});
// Create Order
router.post('/', async (req, res, next) => {
    try {
        const data = createOrderSchema.parse(req.body);
        const orderNumber = await (0, orderNumber_js_1.generateOrderNumber)(data.outlet_id);
        // Insert Order
        const { data: newOrder, error: orderError } = await supabase_js_1.supabase
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
            const { data: newItem, error: itemError } = await supabase_js_1.supabase
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
            if (itemError || !newItem)
                continue;
            if (item.modifiers && item.modifiers.length > 0) {
                const modifiersToInsert = item.modifiers.map(mod => ({
                    order_item_id: newItem.id,
                    modifier_option_id: mod.modifier_option_id,
                    name: mod.name,
                    price_adjustment: mod.price_adjustment
                }));
                await supabase_js_1.supabase.from('order_item_modifiers').insert(modifiersToInsert);
            }
        }
        res.status(201).json({ success: true, order: newOrder });
    }
    catch (err) {
        next(err);
    }
});
// Update Order Status
router.patch('/:id/status', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = zod_1.z.object({ status: zod_1.z.string() }).parse(req.body);
        const updateData = { status, updated_at: new Date().toISOString() };
        if (status === 'ready') {
            updateData.ready_at = new Date().toISOString();
        }
        else if (status === 'served') {
            updateData.served_at = new Date().toISOString();
        }
        const { data: updatedOrder, error } = await supabase_js_1.supabase
            .from('orders')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json({ success: true, order: updatedOrder });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
