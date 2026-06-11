import { create } from 'zustand';
import type { CartItem, CartModifier, OrderType, MenuItem } from '../types/pos.types';

function generateCartId() {
  return Math.random().toString(36).slice(2, 10);
}

function computeItemSubtotal(price: number, qty: number, mods: CartModifier[]) {
  const modTotal = mods.reduce((s, m) => s + m.price_adjustment, 0);
  return (price + modTotal) * qty;
}

interface CartStore {
  // State
  items: CartItem[];
  orderType: OrderType;
  tableNumber: string;
  platformOrderId: string;
  discountType: 'fixed' | 'percent' | null;
  discountValue: number;
  discountAmount: number;
  memberId: string | null;

  // Computed
  subtotal: () => number;
  itemCount: () => number;

  // Actions
  addItem: (item: MenuItem, modifiers: CartModifier[], notes?: string) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  updateNotes: (cartId: string, notes: string) => void;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (n: string) => void;
  setPlatformOrderId: (id: string) => void;
  setDiscount: (type: 'fixed' | 'percent' | null, value: number, subtotal: number) => void;
  setMember: (id: string | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  // ─── Initial State ────────────────────────────────────────────────
  items: [],
  orderType: 'dine_in',
  tableNumber: '',
  platformOrderId: '',
  discountType: null,
  discountValue: 0,
  discountAmount: 0,
  memberId: null,

  // ─── Computed ─────────────────────────────────────────────────────
  subtotal: () => get().items.reduce((s, i) => s + i.subtotal, 0),
  itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),

  // ─── Actions ──────────────────────────────────────────────────────
  addItem: (item, modifiers, notes) => {
    set((state) => {
      // Check if same item + same modifiers already in cart
      const key = item.id + JSON.stringify(modifiers.map(m => m.optionId).sort());
      const existing = state.items.find(
        ci => ci.menuItemId === item.id &&
          JSON.stringify(ci.modifiers.map(m => m.optionId).sort()) ===
          JSON.stringify(modifiers.map(m => m.optionId).sort())
      );

      if (existing && !notes) {
        return {
          items: state.items.map(ci =>
            ci.cartId === existing.cartId
              ? { ...ci, quantity: ci.quantity + 1, subtotal: computeItemSubtotal(ci.price, ci.quantity + 1, ci.modifiers) }
              : ci
          )
        };
      }

      const newItem: CartItem = {
        cartId: generateCartId(),
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        modifiers,
        stationId: item.station_id,
        notes: notes || '',
        subtotal: computeItemSubtotal(item.price, 1, modifiers),
      };

      // Suppress unused variable warning
      void key;

      return { items: [...state.items, newItem] };
    });
  },

  removeItem: (cartId) => set(s => ({ items: s.items.filter(i => i.cartId !== cartId) })),

  updateQuantity: (cartId, delta) => {
    set((state) => {
      const items = state.items.map(ci => {
        if (ci.cartId !== cartId) return ci;
        const newQty = ci.quantity + delta;
        if (newQty <= 0) return null;
        return { ...ci, quantity: newQty, subtotal: computeItemSubtotal(ci.price, newQty, ci.modifiers) };
      }).filter(Boolean) as CartItem[];
      return { items };
    });
  },

  updateNotes: (cartId, notes) => set(s => ({
    items: s.items.map(ci => ci.cartId === cartId ? { ...ci, notes } : ci)
  })),

  setOrderType: (type) => set({ orderType: type, tableNumber: '', platformOrderId: '' }),

  setTableNumber: (n) => set({ tableNumber: n }),

  setPlatformOrderId: (id) => set({ platformOrderId: id }),

  setDiscount: (type, value, subtotal) => {
    let amount = 0;
    if (type === 'fixed') amount = Math.min(value, subtotal);
    else if (type === 'percent') amount = Math.round(subtotal * (value / 100));
    set({ discountType: type, discountValue: value, discountAmount: amount });
  },

  setMember: (id) => set({ memberId: id }),

  clearCart: () => set({
    items: [],
    orderType: 'dine_in',
    tableNumber: '',
    platformOrderId: '',
    discountType: null,
    discountValue: 0,
    discountAmount: 0,
    memberId: null,
  }),
}));
