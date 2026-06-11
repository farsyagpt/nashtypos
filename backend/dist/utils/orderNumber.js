"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
const supabase_js_1 = require("../config/supabase.js");
/**
 * Generate a unique order number for the day per outlet.
 * Format: SNY-XXXX
 */
async function generateOrderNumber(outletId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Get the count of orders for today in this outlet
    const { count, error } = await supabase_js_1.supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('outlet_id', outletId)
        .gte('created_at', today.toISOString());
    if (error) {
        throw new Error(`Failed to generate order number: ${error.message}`);
    }
    const sequence = (count || 0) + 1;
    return `SNY-${sequence.toString().padStart(4, '0')}`;
}
