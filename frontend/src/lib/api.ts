const BASE_URL = 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Request gagal');
  return data.data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  getStaff: (outletId: string) =>
    request<any[]>(`/auth/staff/${outletId}`),

  login: (userId: string, pin: string) =>
    request<any>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ userId, pin }),
    }),

  verifyManagerPin: (pin: string, outletId: string) =>
    request<any>(`/auth/verify-manager-pin`, {
      method: 'POST',
      body: JSON.stringify({ pin, outletId }),
    }),
};

// ─── Menu ────────────────────────────────────────────────────────────────────
export const menuApi = {
  getAll: (outletId: string) =>
    request<{ categories: any[]; items: any[] }>(`/menu/outlet/${outletId}`),
};

// ─── Shifts ──────────────────────────────────────────────────────────────────
export const shiftApi = {
  getActive: (outletId: string) =>
    request<any | null>(`/shifts/active/${outletId}`),

  open: (outletId: string, userId: string, openingCash = 0) =>
    request<any>(`/shifts`, {
      method: 'POST',
      body: JSON.stringify({ outletId, userId, openingCash }),
    }),

  close: (shiftId: string, closingCash?: number) =>
    request<any>(`/shifts/${shiftId}/close`, {
      method: 'PUT',
      body: JSON.stringify({ closingCash }),
    }),

  getSummary: (shiftId: string) =>
    request<any>(`/shifts/${shiftId}/summary`),
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const orderApi = {
  create: (orderData: any) =>
    request<any>(`/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  getShiftHistory: (shiftId: string) =>
    request<any[]>(`/orders/shift/${shiftId}`),

  void: (orderId: string, reason: string, voidBy: string) =>
    request<any>(`/orders/${orderId}/void`, {
      method: 'PUT',
      body: JSON.stringify({ reason, voidBy }),
    }),

  getConfig: (outletId: string) =>
    request<any>(`/orders/config/${outletId}`),
};
