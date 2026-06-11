
import './BackofficePage.css';

const BackofficePage = () => {
  return (
    <>

<div className="app" id="app">


{/* 
 SIDEBAR
 */}
<nav className="sidebar">
 <div className="sb-brand">
 <div className="sb-logo" style={{ fontSize:'15px', fontWeight:'900', color:'#fff', letterSpacing:'-.02em' }}>N</div>
 <div>
 <div className="sb-brand-name">NASHTY OS</div>
 <div className="sb-brand-sub">Backoffice</div>
 </div>
 </div>
 <div className="sb-outlet" onClick={() => {}}>
 <div>
 <div className="sb-outlet-name">Galaxy Mall</div>
 <div className="sb-outlet-sub">Outlet aktif</div>
 </div>
 <div className="sb-outlet-ico">⌄</div>
 </div>

 {/* NAV ITEMS */}
 <div className="sb-section"><div className="sb-section-lbl">Utama</div></div>
 <div className="sb-item act" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg></div>Dashboard
 </div>

 <div className="sb-section"><div className="sb-section-lbl">Menu</div></div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg></div>Kategori
 </div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg></div>Produk
 </div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>Modifier Groups
 </div>

 <div className="sb-section"><div className="sb-section-lbl">POS</div></div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>Pengaturan Umum
 </div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></div>Metode Pembayaran
 </div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></div>Pengaturan Struk
 </div>

 <div className="sb-section"><div className="sb-section-lbl">KDS</div></div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>Workflow Status
 </div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>Production Time
 </div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>Alert Settings
 </div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>KDS Analytics
 </div>

 <div className="sb-section"><div className="sb-section-lbl">Tim</div></div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>Owners
 </div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>Managers
 </div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>Kasir
 </div>

 <div className="sb-section"><div className="sb-section-lbl">Bisnis</div></div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>Outlets
 </div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg></div>Laporan
 <span className="sb-item-badge badge-gn">Baru</span>
 </div>
  <div className="sb-item" onClick={() => {}}>
    <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg></div>Menu Engineering
    <span className="sb-item-badge badge-or">Pro</span>
  </div>

 <div className="sb-section"><div className="sb-section-lbl">Sistem</div></div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>Pengaturan
 </div>
 <div className="sb-item" onClick={() => {}}>
 <div className="sb-ico"></div>Activity Logs
 </div>

 <div style={{ height:'20px' }}></div>
</nav>

{/* 
 MAIN
 */}
<div className="main">
 {/* TOPBAR */}
 <header className="topbar">
 <div>
 <div className="topbar-title" id="page-title">Dashboard</div>
 <div className="topbar-trail" id="page-trail">
 <span>Nashty OS</span> › <span id="trail-cur">Dashboard</span>
 </div>
 </div>
 <div className="tb-right">
 <button className="tb-btn" onClick={() => {}}> Dark Mode</button>
 <button className="tb-btn" onClick={() => {}}> Galaxy Mall</button>
 <div className="tb-avatar" onClick={() => {}}>AD</div>
 </div>
 </header>

 {/* PAGE AREA */}
 <div className="page-area" id="page-area">
 {/* Pages rendered by JS */}
 </div>
</div>

{/* TOAST CONTAINER */}
<div id="toast-container"></div>


</div>
    </>
  );
};

export default BackofficePage;
