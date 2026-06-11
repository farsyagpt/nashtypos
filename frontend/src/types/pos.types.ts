// ─── Menu & Modifier Types ──────────────────────────────────────────────────

export interface ModifierOption {
  id: string;
  name: string;
  price_adjustment: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  is_required: boolean;
  min_select: number;
  max_select: number;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  emoji?: string;
  photo_url?: string;
  category_id: string;
  station_id: string;
  modifier_groups: ModifierGroup[];
}

export interface MenuCategory {
  id: string;
  name: string;
  emoji?: string;
  order_index: number;
  station_id: string;
}

// ─── Cart Types ─────────────────────────────────────────────────────────────

export interface CartModifier {
  optionId: string;
  groupId: string;
  groupName: string;
  name: string;
  price_adjustment: number;
}

export interface CartItem {
  cartId: string; // unique ID in cart
  menuItemId: string;
  name: string;
  price: number; // base price
  quantity: number;
  modifiers: CartModifier[];
  stationId?: string;
  notes?: string;
  subtotal: number; // (price + modifier total) * qty
}

export type OrderType = 'dine_in' | 'take_away' | 'gofood' | 'grabfood' | 'shopee';

export interface CartState {
  items: CartItem[];
  orderType: OrderType;
  tableNumber: string;
  platformOrderId: string;
  discountType: 'fixed' | 'percent' | null;
  discountValue: number;
  discountAmount: number;
  memberId: string | null;
}

// ─── Payment Types ──────────────────────────────────────────────────────────

export type PaymentMethod = 'tunai' | 'transfer' | 'qris' | 'bca' | 'debit' | 'gofood' | 'grabfood' | 'shopee';

export interface PaymentEntry {
  method: PaymentMethod;
  amount: number;
  change?: number;
  platformRef?: string;
}

// ─── Auth & User Types ──────────────────────────────────────────────────────

export interface StaffCard {
  id: string;
  name: string;
  role: 'owner' | 'manager' | 'kasir';
}

export interface LoggedUser {
  id: string;
  name: string;
  role: 'owner' | 'manager' | 'kasir';
  outlet_id: string;
}

// ─── Shift Types ────────────────────────────────────────────────────────────

export interface Shift {
  id: string;
  outlet_id: string;
  user_id: string;
  user_name?: string;
  started_at: string;
  ended_at?: string;
  opening_cash: number;
  status: 'open' | 'closed';
}

// ─── Order Types ────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  order_number: string;
  type: OrderType;
  table_number?: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'voided';
  subtotal: number;
  discount_amount: number;
  service_charge_amount: number;
  total: number;
  void_reason?: string;
  cashier_name?: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifier_names?: string;
}

// ─── Config Types ───────────────────────────────────────────────────────────

export interface ServiceChargeConfig {
  rate: number;
  is_enabled: boolean | number;
  label: string;
}

export interface OutletSettings {
  auto_logout_minutes: number;
  max_discount_pct: number;
  split_payment_enabled: boolean | number;
  payment_methods_enabled: Record<PaymentMethod, boolean>;
}

export interface POSConfig {
  service_charge: ServiceChargeConfig;
  settings: OutletSettings;
}
