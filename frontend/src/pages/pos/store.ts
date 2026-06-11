import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HISTORY as INITIAL_HISTORY, REFUNDS as INITIAL_REFUNDS } from './mockData';

export const usePosStore = create(
  persist(
    (set: any, get: any) => ({
      theme: 'day',
      toggleTheme: () => set((state: any) => ({ theme: state.theme === 'day' ? 'dark' : 'day' })),

      currentUser: null as any,
      setCurrentUser: (user: any) => set({ currentUser: user }),

      loginSel: null as any,
      setLoginSel: (staff: any) => set({ loginSel: staff }),

      activeTab: 'pos',
      setActiveTab: (tab: string) => set({ activeTab: tab }),

      curCat: 'main',
      setCurCat: (cat: string) => set({ curCat: cat }),

      favorites: new Set<number>(),
      toggleFav: (id: number) => {
        const favs = new Set(get().favorites);
        if (favs.has(id)) favs.delete(id);
        else favs.add(id);
        set({ favorites: favs });
      },

      searchMenuQ: '',
      setSearchMenuQ: (q: string) => set({ searchMenuQ: q }),

      cart: [] as any[],
      setCart: (newCart: any[]) => set({ cart: newCart }),
      addCartItem: (item: any) => set((state: any) => {
        const exIdx = state.cart.findIndex((i: any) => i.id === item.id && !i.cartKey.includes('_'));
        if (exIdx >= 0 && !item.selectedOpts) {
          const newCart = [...state.cart];
          newCart[exIdx].qty++;
          return { cart: newCart };
        }
        return { cart: [...state.cart, item] };
      }),
      updateCartQty: (cartKey: string, delta: number) => set((state: any) => {
        const newCart = [...state.cart];
        const idx = newCart.findIndex((i: any) => i.cartKey === cartKey);
        if (idx >= 0) {
          newCart[idx].qty += delta;
          if (newCart[idx].qty <= 0) newCart.splice(idx, 1);
        }
        return { cart: newCart };
      }),
      updateCartNote: (cartKey: string, note: string) => set((state: any) => {
        const newCart = [...state.cart];
        const idx = newCart.findIndex((i: any) => i.cartKey === cartKey);
        if (idx >= 0) newCart[idx].note = note;
        return { cart: newCart };
      }),
      clearCart: () => set({ cart: [], discount: 0, curMember: null, tableNo: '' }),

      discount: 0,
      setDiscount: (d: number) => set({ discount: d }),

      curMember: null as string | null,
      setCurMember: (m: string | null) => set({ curMember: m }),

      orderType: 'dine',
      setOrderType: (t: string) => {
        const m: any = { 'dine': '', 'take': 'Take Away', 'gofood': 'GoFood', 'grabfood': 'GrabFood', 'shopee': 'ShopeeFood' };
        set({ orderType: t, tableNo: m[t] || '' });
      },

      tableNo: '',
      setTableNo: (t: string) => set({ tableNo: t }),

      history: INITIAL_HISTORY,
      refunds: INITIAL_REFUNDS,
      pettyCashStart: 500000,
      pettyCash: 500000,
      addHistory: (txn: any) => set((state: any) => ({ history: [txn, ...state.history] })),
      updateHistory: (id: number, updates: any) => set((state: any) => {
        const newHist = [...state.history];
        const idx = newHist.findIndex((h: any) => h.id === id);
        if (idx >= 0) newHist[idx] = { ...newHist[idx], ...updates };
        return { history: newHist };
      }),
      addRefund: (ref: any) => set((state: any) => ({ 
        refunds: [...state.refunds, ref],
        pettyCash: state.pettyCash - ref.amt
      })),

      histFilter: 'all',
      setHistFilter: (f: string) => set({ histFilter: f }),

      histQ: '',
      setHistQ: (q: string) => set({ histQ: q }),

      selTxn: null as any,
      setSelTxn: (t: any) => set({ selTxn: t }),

      showOptsModalId: null as number | null,
      setShowOptsModalId: (id: number | null) => set({ showOptsModalId: id }),

      showItemNoteKey: null as string | null,
      setShowItemNoteKey: (key: string | null) => set({ showItemNoteKey: key }),

      showPayModal: false,
      setShowPayModal: (show: boolean) => set({ showPayModal: show }),

      showMemModal: false,
      setShowMemModal: (show: boolean) => set({ showMemModal: show }),

      showDiscModal: false,
      setShowDiscModal: (show: boolean) => set({ showDiscModal: show }),

      showVoidModal: false,
      setShowVoidModal: (show: boolean) => set({ showVoidModal: show }),

      showSuccessModal: false,
      setShowSuccessModal: (show: boolean) => set({ showSuccessModal: show }),
      
      successData: null as any,
      setSuccessData: (data: any) => set({ successData: data }),

      toastMsg: null as { msg: string, type: string } | null,
      showToast: (msg: string, type = 'ok') => {
        set({ toastMsg: { msg, type } });
        setTimeout(() => set({ toastMsg: null }), 3000);
      }
    }),
    {
      name: 'nashty-pos-storage',
      // Optionally skip persisting UI toggles/modals to avoid getting stuck
      partialize: (state: any) => ({
        history: state.history,
        refunds: state.refunds,
        pettyCashStart: state.pettyCashStart,
        pettyCash: state.pettyCash,
        cart: state.cart,
        discount: state.discount,
        curMember: state.curMember,
        orderType: state.orderType,
        tableNo: state.tableNo,
        currentUser: state.currentUser,
        theme: state.theme,
      })
    }
  )
);
