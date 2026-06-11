import { useCartStore } from '../../../store/cart-store';
import type { POSConfig, LoggedUser, OrderType } from '../../../types/pos.types';

interface Props {
  config: POSConfig | null;
  onCheckout: () => void;
  shiftActive: boolean;
  outletId: string;
  user: LoggedUser;
}

const ORDER_TYPES: { value: OrderType; label: string; icon: string }[] = [
  { value: 'dine_in',   label: 'Dine In',  icon: '🍽️' },
  { value: 'take_away', label: 'Take Away', icon: '🛍️' },
  { value: 'gofood',    label: 'GoFood',   icon: '🟢' },
  { value: 'grabfood',  label: 'GrabFood', icon: '🟢' },
  { value: 'shopee',    label: 'Shopee',   icon: '🟠' },
];

function formatPrice(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function CartPanel({ config, onCheckout, shiftActive }: Props) {
  const cart = useCartStore();
  const subtotal = cart.subtotal();
  const itemCount = cart.itemCount();

  const scConfig = config?.service_charge;
  const scEnabled = scConfig?.is_enabled;
  const scRate = scEnabled ? (scConfig?.rate || 0) : 0;
  const scAmount = Math.round((subtotal - cart.discountAmount) * scRate);
  const total = subtotal - cart.discountAmount + scAmount;

  const canCheckout = shiftActive && itemCount > 0 && (
    cart.orderType !== 'dine_in' || cart.tableNumber.trim() !== ''
  );

  return (
    <div className="cart-panel">
      {/* Order type picker */}
      <div className="order-type-picker">
        <div className="order-types">
          {ORDER_TYPES.map(t => (
            <button
              key={t.value}
              className={`order-type-btn ${cart.orderType === t.value ? 'active' : ''}`}
              onClick={() => cart.setOrderType(t.value)}
            >
              <span className="order-type-icon">{t.icon}</span>
              <span className="order-type-label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table number input for dine in */}
      {cart.orderType === 'dine_in' && (
        <div className="table-input-wrapper">
          <input
            type="text"
            className="table-input"
            placeholder="Nomor Meja (wajib)"
            value={cart.tableNumber}
            onChange={e => cart.setTableNumber(e.target.value)}
          />
        </div>
      )}

      {/* Platform order ID for delivery */}
      {['gofood','grabfood','shopee'].includes(cart.orderType) && (
        <div className="table-input-wrapper">
          <input
            type="text"
            className="table-input"
            placeholder="No. Order Platform (opsional)"
            value={cart.platformOrderId}
            onChange={e => cart.setPlatformOrderId(e.target.value)}
          />
        </div>
      )}

      {/* Cart items */}
      <div className="cart-items">
        {cart.items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <span className="cart-empty-text">
              Pilih menu dari kiri untuk menambah ke cart
            </span>
          </div>
        ) : cart.items.map(item => (
          <div key={item.cartId} className="cart-item">
            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              {item.modifiers.length > 0 && (
                <div className="cart-item-mods">
                  {item.modifiers.map(m => m.name).join(', ')}
                </div>
              )}
              {item.notes && (
                <div style={{
                  fontSize: '11px', color: 'var(--ye)',
                  background: 'var(--yeL)', padding: '2px 6px',
                  borderRadius: '4px', marginTop: '2px',
                  border: '1px solid rgba(245,158,11,0.2)',
                  display: 'inline-flex', alignItems: 'center', gap: '3px'
                }}>
                  📝 {item.notes}
                </div>
              )}
              <div className="cart-item-price">{formatPrice(item.subtotal)}</div>
            </div>
            <div className="cart-item-controls">
              <button
                className="qty-btn minus"
                onClick={() => cart.updateQuantity(item.cartId, -1)}
              >−</button>
              <span className="qty-value">{item.quantity}</span>
              <button
                className="qty-btn"
                onClick={() => cart.updateQuantity(item.cartId, 1)}
              >+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {itemCount > 0 && (
        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Subtotal ({itemCount} item)</span>
            <span className="cart-summary-value">{formatPrice(subtotal)}</span>
          </div>
          {cart.discountAmount > 0 && (
            <div className="cart-summary-row" style={{ color: 'var(--gn)' }}>
              <span>Diskon</span>
              <span className="cart-summary-value">−{formatPrice(cart.discountAmount)}</span>
            </div>
          )}
          {scEnabled && (
            <div className="cart-summary-row">
              <span>{scConfig?.label || 'Service Charge'} ({Math.round(scRate * 100)}%)</span>
              <span className="cart-summary-value">{formatPrice(scAmount)}</span>
            </div>
          )}
          <div className="cart-summary-row total">
            <span>Total</span>
            <span className="price-total">{formatPrice(total)}</span>
          </div>
        </div>
      )}

      {/* Checkout button */}
      <button
        className="checkout-btn"
        disabled={!canCheckout}
        onClick={onCheckout}
      >
        <span>
          {!shiftActive ? '🔒 Buka Shift Dulu' :
           itemCount === 0 ? 'Pilih Menu' :
           cart.orderType === 'dine_in' && !cart.tableNumber ? '⚠️ Isi Nomor Meja' :
           'Bayar'}
        </span>
        {canCheckout && <span style={{ fontFamily: 'var(--mo)' }}>{formatPrice(total)}</span>}
      </button>
    </div>
  );
}
