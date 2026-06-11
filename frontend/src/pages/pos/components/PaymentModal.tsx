import { useState } from 'react';
import { useCartStore } from '../../../store/cart-store';
import type { POSConfig, PaymentMethod, PaymentEntry } from '../../../types/pos.types';

interface Props {
  cart: ReturnType<typeof useCartStore.getState>;
  config: POSConfig;
  onConfirm: (payments: PaymentEntry[]) => void;
  onClose: () => void;
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'tunai',    label: 'Tunai',    icon: '💵' },
  { id: 'qris',     label: 'QRIS',     icon: '📱' },
  { id: 'transfer', label: 'Transfer', icon: '🏦' },
  { id: 'bca',      label: 'BCA',      icon: '🔵' },
  { id: 'debit',    label: 'Debit',    icon: '💳' },
  { id: 'gofood',   label: 'GoFood',   icon: '🟢' },
  { id: 'grabfood', label: 'GrabFood', icon: '🟢' },
  { id: 'shopee',   label: 'Shopee',   icon: '🟠' },
];

function formatPrice(n: number) {
  return 'Rp ' + Math.max(0, n).toLocaleString('id-ID');
}

export default function PaymentModal({ cart, config, onConfirm, onClose }: Props) {
  const subtotal = cart.items.reduce((s, i) => s + i.subtotal, 0);
  const scConfig = config.service_charge;
  const scEnabled = scConfig?.is_enabled;
  const scRate = scEnabled ? (scConfig?.rate || 0) : 0;
  const scAmount = Math.round((subtotal - cart.discountAmount) * scRate);
  const orderTotal = subtotal - cart.discountAmount + scAmount;

  const enabledMethods = config.settings?.payment_methods_enabled || {};

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('tunai');
  const [cashInput, setCashInput] = useState('');
  const [payments, setPayments] = useState<PaymentEntry[]>([]);

  const cashAmount = parseInt(cashInput.replace(/\D/g, '')) || 0;
  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const remaining = orderTotal - totalPaid;
  const change = selectedMethod === 'tunai' ? Math.max(0, cashAmount - remaining) : 0;
  const canConfirm = totalPaid >= orderTotal || (selectedMethod === 'tunai' && cashAmount >= remaining);

  function handleNumpad(key: string) {
    if (selectedMethod !== 'tunai') return;
    if (key === 'del') {
      setCashInput(p => p.slice(0, -1));
    } else if (key === '000') {
      setCashInput(p => p + '000');
    } else {
      setCashInput(p => p + key);
    }
  }

  function handleShortcut(amt: number) {
    setCashInput(String(Math.ceil(remaining / amt) * amt));
  }

  function addPayment() {
    const amount = selectedMethod === 'tunai' ? Math.min(cashAmount, remaining) : remaining;
    if (amount <= 0) return;
    setPayments(prev => [...prev, { method: selectedMethod, amount, change }]);
    setCashInput('');
  }

  function handleConfirm() {
    let finalPayments: PaymentEntry[] = [...payments];

    if (finalPayments.length === 0 || remaining > 0) {
      // Single payment
      if (selectedMethod === 'tunai') {
        finalPayments = [{ method: 'tunai', amount: orderTotal, change: Math.max(0, cashAmount - orderTotal) }];
      } else {
        finalPayments = [{ method: selectedMethod, amount: orderTotal }];
      }
    }

    onConfirm(finalPayments);
  }

  const NUMPAD_KEYS = ['1','2','3','4','5','6','7','8','9','000','0','del'];

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box payment-modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>💳 Pembayaran</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        {/* Order summary */}
        <div className="payment-summary">
          <div className="payment-summary-row">
            <span style={{ color: 'var(--txt2)' }}>Subtotal</span>
            <span style={{ fontFamily: 'var(--mo)' }}>{formatPrice(subtotal)}</span>
          </div>
          {cart.discountAmount > 0 && (
            <div className="payment-summary-row">
              <span style={{ color: 'var(--gn)' }}>Diskon</span>
              <span style={{ fontFamily: 'var(--mo)', color: 'var(--gn)' }}>−{formatPrice(cart.discountAmount)}</span>
            </div>
          )}
          {scEnabled && (
            <div className="payment-summary-row">
              <span style={{ color: 'var(--txt2)' }}>{scConfig?.label} ({Math.round(scRate*100)}%)</span>
              <span style={{ fontFamily: 'var(--mo)' }}>{formatPrice(scAmount)}</span>
            </div>
          )}
          <div className="payment-summary-row total-row">
            <span>Total</span>
            <span style={{ fontFamily: 'var(--mo)', color: 'var(--or)' }}>{formatPrice(orderTotal)}</span>
          </div>
        </div>

        {/* Payment methods */}
        <div className="payment-methods">
          {PAYMENT_METHODS.map(m => {
            const enabled = enabledMethods[m.id] !== false;
            return (
              <button
                key={m.id}
                className={`payment-method-btn ${selectedMethod === m.id ? 'active' : ''} ${!enabled ? 'disabled' : ''}`}
                onClick={() => { if (enabled) { setSelectedMethod(m.id); setCashInput(''); } }}
                disabled={!enabled}
              >
                <span className="payment-method-icon">{m.icon}</span>
                <span className="payment-method-name">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cash numpad */}
        {selectedMethod === 'tunai' && (
          <div className="numpad-section">
            <div className="amount-display">
              <div className="amount-label">Uang Diterima</div>
              <div className="amount-value">
                {cashAmount > 0 ? 'Rp ' + cashAmount.toLocaleString('id-ID') : 'Rp 0'}
              </div>
            </div>

            {/* Shortcuts */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {[20000,50000,100000,200000].map(amt => (
                <button key={amt} className="numpad-key shortcut" style={{ flex: 1, height: '38px', fontSize: '11px' }} onClick={() => handleShortcut(amt)}>
                  +{amt/1000}K
                </button>
              ))}
              <button className="numpad-key shortcut" style={{ flex: 1, height: '38px', fontSize: '11px' }} onClick={() => setCashInput(String(remaining))}>
                Pas
              </button>
            </div>

            <div className="numpad">
              {NUMPAD_KEYS.map((key, i) => (
                <button
                  key={i}
                  className={`numpad-key ${key === 'del' ? 'del-key' : ''}`}
                  onClick={() => handleNumpad(key)}
                >
                  {key === 'del' ? '⌫' : key}
                </button>
              ))}
            </div>

            {cashAmount > 0 && cashAmount >= remaining && (
              <div className="change-display">
                <span className="change-label">Kembalian</span>
                <span className="change-value">{formatPrice(change)}</span>
              </div>
            )}
          </div>
        )}

        {/* Non-cash — just show remaining */}
        {selectedMethod !== 'tunai' && (
          <div style={{ padding: '16px', background: 'var(--sf2)', borderRadius: 'var(--rad-md)', textAlign: 'center', margin: '8px 0' }}>
            <div style={{ fontSize: '13px', color: 'var(--txt3)', marginBottom: '4px' }}>Jumlah yang diterima</div>
            <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--mo)', color: 'var(--txt)' }}>
              {formatPrice(remaining)}
            </div>
          </div>
        )}

        {/* Confirm button */}
        <button
          className="payment-confirm-btn"
          disabled={!canConfirm}
          onClick={handleConfirm}
        >
          ✓ Konfirmasi Pembayaran
          {canConfirm && selectedMethod === 'tunai' && change > 0 && ` • Kembalian ${formatPrice(change)}`}
        </button>
      </div>
    </div>
  );
}
