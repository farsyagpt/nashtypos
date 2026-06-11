import { useState, useEffect } from 'react';
import { orderApi, authApi } from '../../../lib/api';
import type { Order, LoggedUser } from '../../../types/pos.types';

interface Props {
  shiftId: string;
  outletId: string;
  user: LoggedUser;
}

const ORDER_TYPE_LABELS: Record<string, string> = {
  dine_in: '🍽️ Dine In',
  take_away: '🛍️ Take Away',
  gofood: '🟢 GoFood',
  grabfood: '🟢 GrabFood',
  shopee: '🟠 Shopee',
};

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Pending',   cls: 'badge-blue'   },
  preparing: { label: 'Diproses', cls: 'badge-yellow' },
  ready:     { label: 'Siap',     cls: 'badge-green'  },
  completed: { label: 'Selesai',  cls: 'badge-green'  },
  voided:    { label: 'Void',     cls: 'badge-red'    },
};

function formatPrice(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryPanel({ shiftId, outletId, user }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [voidModal, setVoidModal] = useState<{ orderId: string; orderNum: string } | null>(null);
  const [voidReason, setVoidReason] = useState('');
  const [voidPin, setVoidPin] = useState('');
  const [voidError, setVoidError] = useState('');
  const [voidLoading, setVoidLoading] = useState(false);

  useEffect(() => {
    if (shiftId) loadHistory();
  }, [shiftId]);

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await orderApi.getShiftHistory(shiftId);
      setOrders(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleVoid() {
    if (!voidModal || !voidReason.trim() || !voidPin.trim()) {
      setVoidError('Alasan dan PIN Manager wajib diisi');
      return;
    }
    setVoidLoading(true);
    setVoidError('');
    try {
      // Verify manager PIN first
      const mgr = await authApi.verifyManagerPin(voidPin, outletId);
      await orderApi.void(voidModal.orderId, voidReason, mgr.id);
      await loadHistory();
      setVoidModal(null);
      setVoidReason('');
      setVoidPin('');
    } catch (e: any) {
      setVoidError(e.message || 'Void gagal');
    } finally {
      setVoidLoading(false);
    }
  }

  const totalSales = orders
    .filter(o => o.status !== 'voided')
    .reduce((s, o) => s + o.total, 0);

  if (!shiftId) {
    return (
      <div className="shift-notice">
        <span className="shift-notice-icon">📋</span>
        <div className="shift-notice-title">Tidak ada shift aktif</div>
        <div className="shift-notice-sub">Buka shift untuk melihat riwayat transaksi</div>
      </div>
    );
  }

  return (
    <div className="history-panel">
      {/* Header */}
      <div className="history-header">
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>Riwayat Transaksi</div>
          <div style={{ fontSize: '13px', color: 'var(--txt3)' }}>
            {orders.filter(o => o.status !== 'voided').length} transaksi · {formatPrice(totalSales)}
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={loadHistory}>↻ Refresh</button>
      </div>

      {/* Orders */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--txt3)' }}>
          Memuat...
        </div>
      ) : orders.length === 0 ? (
        <div className="shift-notice">
          <span className="shift-notice-icon">🧾</span>
          <div className="shift-notice-title">Belum ada transaksi</div>
          <div className="shift-notice-sub">Transaksi yang dibuat selama shift ini akan muncul di sini</div>
        </div>
      ) : (
        <div className="history-list">
          {orders.map(order => {
            const st = STATUS_LABELS[order.status] || { label: order.status, cls: 'badge-blue' };
            return (
              <div key={order.id} className={`history-order-card ${order.status === 'voided' ? 'voided' : ''}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="history-order-num">{order.order_number}</span>
                    <span className={`badge ${st.cls}`}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--txt3)' }}>
                    {ORDER_TYPE_LABELS[order.type] || order.type}
                    {order.table_number && ` · Meja ${order.table_number}`}
                    {' · '}{formatTime(order.created_at)}
                  </div>
                  {order.status === 'voided' && order.void_reason && (
                    <div style={{ fontSize: '11px', color: 'var(--rd)' }}>
                      Alasan void: {order.void_reason}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <span className="history-order-total">{formatPrice(order.total)}</span>
                  {order.status !== 'voided' && (user.role === 'manager' || user.role === 'owner') && (
                    <button
                      className="history-void-btn"
                      onClick={() => setVoidModal({ orderId: order.id, orderNum: order.order_number })}
                    >
                      Void
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Void Modal */}
      {voidModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setVoidModal(null); }}>
          <div className="modal-box" style={{ maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '4px' }}>⚠️ Void Order {voidModal.orderNum}</h3>
            <p style={{ fontSize: '13px', color: 'var(--txt3)', marginBottom: '16px' }}>
              Tindakan ini tidak dapat dibatalkan. Masukkan alasan dan PIN Manager.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                className="input"
                placeholder="Alasan void (wajib)"
                value={voidReason}
                onChange={e => setVoidReason(e.target.value)}
              />
              <input
                type="password"
                className="input"
                placeholder="PIN Manager / Owner"
                value={voidPin}
                onChange={e => setVoidPin(e.target.value)}
                maxLength={4}
              />
              {voidError && <div style={{ color: 'var(--rd)', fontSize: '13px' }}>{voidError}</div>}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { setVoidModal(null); setVoidError(''); setVoidPin(''); }}>
                Batal
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={handleVoid}
                disabled={voidLoading}
              >
                {voidLoading ? 'Memproses...' : 'Konfirmasi Void'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
