
import './KDSPage.css';

const KDSPage = () => {
  return (
    <>

<div className="shell">

{/* ── TOPBAR ── */}
<header className="topbar">
  <div className="tb-logo">N</div>
  <div>
    <div className="tb-brand">NASHTY OS</div>
    <div className="tb-sub">Kitchen Display</div>
  </div>
  <div className="tb-sep"></div>
  <div className="tb-station">Dapur Utama</div>
  <div className="tb-sep"></div>
  <div className="live-pill"><div className="live-dot"></div><span className="live-txt">Live</span></div>

  {/* Queue Summary: Orders · Items · Urgent */}
  <div className="queue-summary" id="queue-summary">
    <div className="qs-item" id="qs-orders">
      <div className="qs-n" id="qs-orders-n">0</div>
      <div className="qs-lbl">Orders</div>
    </div>
    <div className="qs-item" id="qs-items">
      <div className="qs-n" id="qs-items-n">0</div>
      <div className="qs-lbl">Items</div>
    </div>
    <div className="qs-item urgent" id="qs-urgent">
      <div className="qs-n" id="qs-urgent-n">0</div>
      <div className="qs-lbl">Urgent</div>
    </div>
  </div>

  <div className="tb-right">
    <div className="tb-clock" id="kds-clock">00:00:00</div>
    <div className="tb-btn" id="mode-btn" onClick={() => {}}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      Day
    </div>
    <div className="tb-btn" onClick={() => {}}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Order
    </div>
  </div>
</header>

{/* ── URGENT STICKY STRIP ── */}
<div className="urgent-strip" id="urgent-strip">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  <span className="ust-lbl">URGENT</span>
  <div className="ust-orders" id="ust-orders"></div>
</div>

{/* ── FILTER BAR ── */}
<div className="filterbar">
  <button className="flt act" onClick={() => {}}>Semua</button>
  <button className="flt" onClick={() => {}}>Dine In</button>
  <button className="flt" onClick={() => {}}>Take Away</button>
  <button className="flt" onClick={() => {}}>Delivery</button>
  <button className="flt danger" id="flt-urgent" onClick={() => {}}>⚠ Urgent</button>
  <div className="flt-sep"></div>
  <div className="sort-info">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>
    Auto-sort: Urgent → Warning → Fresh
  </div>
</div>

{/* ── ORDER GRID ── */}
<div className="kds-grid" id="kds-grid"></div>

{/* ── POS NOTIFICATION OVERLAY ── */}
<div className="pos-notify-overlay" id="pos-notify">
  <div className="pos-notify-box">
    <div className="pn-icon">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <div className="pn-title">Pesanan Selesai!</div>
    <div className="pn-order" id="pn-order-no">—</div>
    <div className="pn-sub" id="pn-sub">Meja T03 · Dine In</div>
    <div className="pn-items" id="pn-items"></div>
    <div className="pn-warn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Konfirmasi ke pelanggan sebelum klik selesai
    </div>
    <button className="pn-confirm" id="pn-confirm-btn">
      ✓ Pesanan Sudah Diserahkan ke Pelanggan
    </button>
  </div>
</div>



</div>
    </>
  );
};

export default KDSPage;
