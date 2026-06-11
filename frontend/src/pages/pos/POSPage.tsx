import React, { useEffect, useState } from 'react';
import './POSPage.css';
import { STAFF, CATS, MENU, MEMBERS, SEG, HISTORY, REFUNDS, icoColor, formatRupiah, formatRupiahShort, ico } from './mockData';
import { usePosStore } from './store';
import { Modals } from './components/Modals';

export default function POSPage() {
  const {
    theme, toggleTheme,
    currentUser, setCurrentUser,
    loginSel, setLoginSel,
    activeTab, setActiveTab,
    toastMsg, showToast
  } = usePosStore();

  const [loginPinArr, setLoginPinArr] = useState<string[]>([]);
  const [loginErr, setLoginErr] = useState('');

  // Clock
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      const dN = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const mN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const dateStr = `${dN[d.getDay()]}, ${d.getDate()} ${mN[d.getMonth()]} ${d.getFullYear()}`;
      setTime(`${hh}:${mm}:${ss} • ${dateStr}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set theme on body
  useEffect(() => {
    if (theme === 'day') {
      document.body.classList.add('day');
    } else {
      document.body.classList.remove('day');
    }
  }, [theme]);

  const handleLoginPin = (k: string) => {
    if (!loginSel) return;
    if (k === 'DEL') {
      setLoginPinArr(prev => prev.slice(0, -1));
    } else if (loginPinArr.length < 4) {
      setLoginPinArr(prev => [...prev, k]);
    }
  };

  useEffect(() => {
    if (loginPinArr.length === 4) {
      if (loginPinArr.join('') === loginSel?.pin) {
        setCurrentUser(loginSel);
        setLoginPinArr([]);
        setLoginSel(null);
      } else {
        setLoginErr('PIN salah, coba lagi');
        setLoginPinArr([]);
        setTimeout(() => setLoginErr(''), 900);
      }
    }
  }, [loginPinArr, loginSel, setCurrentUser, setLoginSel]);

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginSel(null);
    setLoginPinArr([]);
    usePosStore.getState().clearCart();
    setActiveTab('pos');
  };

  // SVG ICONS
  const SUN_SVG = `<svg id="ico-sun" style="display:${theme==='dark'?'block':'none'}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const MOON_SVG = `<svg id="ico-moon" style="display:${theme==='day'?'block':'none'}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  const LOGO_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`;

  return (
    <>
      {/* LOGIN SCREEN */}
      {!currentUser && (
        <div id="login-screen" style={{ display: 'flex' }}>
          <div className="login-wrap">
            <div className="login-logo">
              <div className="login-logomark" style={{ overflow: 'hidden', padding: 0, background: 'transparent' }}>
                {/* Simplified Logo for now */}
                <div style={{width:'100%', height:'100%', background:'var(--or)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '32px', fontWeight: 'bold'}}>NH</div>
              </div>
              <div className="login-logotxt">NASHTY HOT CHICKEN</div>
            </div>

            {!loginSel ? (
              <div id="step-staff" style={{ display: 'block' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--txt)', marginBottom: 6 }}>Pilih Profil Kasir</h1>
                  <p style={{ fontSize: 14, color: 'var(--txt3)' }}>Ketuk nama Anda untuk masuk ke sistem</p>
                </div>
                <div className="staff-grid" id="staff-grid">
                  {STAFF.map(s => (
                    <button key={s.id} className="staff-btn" onClick={() => { setLoginSel(s); setLoginPinArr([]); setLoginErr(''); }}>
                      <div className="staff-av" style={{ background: `rgba(${hexToRgb(s.color)},.15)`, color: s.color }}>{s.name[0]}</div>
                      <div className="staff-name">{s.name}</div>
                      <div className="staff-role">{s.role}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div id="step-pin" className="show">
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div className="back-btn" onClick={() => setLoginSel(null)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    Kembali
                  </div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--txt)', marginBottom: 6 }}>Masukkan PIN</h1>
                  <p style={{ fontSize: 14, color: 'var(--txt3)' }}>Halo <strong>{loginSel.name}</strong>, silakan masukkan PIN</p>
                </div>

                <div className="pin-dots">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`pdot ${i < loginPinArr.length ? 'on' : ''}`} />
                  ))}
                </div>
                <div className="pin-err">{loginErr}</div>

                <div className="pin-pad">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'DEL'].map(k => {
                    if (!k) return <div key={Math.random()} />;
                    if (k === 'DEL') return <button key={k} className="ppk dl" onClick={() => handleLoginPin('DEL')}>&#x232B;</button>;
                    return <button key={k} className="ppk" onClick={() => handleLoginPin(k)}>{k}</button>;
                  })}
                </div>
              </div>
            )}

            <div className="login-footer">
              v2.1.0 • Shift Pagi • Terhubung
            </div>
          </div>
        </div>
      )}

      {/* APP SHELL */}
      {currentUser && (
        <>
          <header className="topbar" id="topbar">
            <div className="tb-left">
              <div className="tb-logo">
                <div className="tb-logomark">NH</div>
              </div>
              <div>
                <div className="tb-title">Nashty Hot Chicken</div>
                <div className="tb-sub">Cabang Antasari — POS Kasir</div>
              </div>
            </div>
            <div className="tb-tabs">
              <div className={`ttab ${activeTab === 'pos' ? 'act' : ''}`} onClick={() => setActiveTab('pos')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Kasir
              </div>
              <div className={`ttab ${activeTab === 'hist' ? 'act' : ''}`} onClick={() => setActiveTab('hist')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                Riwayat <span className="ttab-badge">{usePosStore.getState().history.length} Txn</span>
              </div>
              <div className={`ttab ${activeTab === 'laporan' ? 'act' : ''}`} onClick={() => setActiveTab('laporan')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                Laporan
              </div>
            </div>
            <div className="tb-right">
              <div className="online-chip"><div className="ondot"></div><span className="online-t">Online</span></div>
              <div className="clk" id="clk">{time.split(' • ')[0]}</div>
              <button className="theme-btn" onClick={toggleTheme} dangerouslySetInnerHTML={{ __html: SUN_SVG + MOON_SVG }} />
              <div className="user-pill">
                <div className="user-av" id="user-av" style={{ background: `rgba(${hexToRgb(currentUser.color)},.15)`, color: currentUser.color }}>{currentUser.name[0]}</div>
                <span className="user-nm" id="user-nm">{currentUser.name}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </div>
          </header>

          <div id="app-shell" style={{ display: 'flex' }}>
            <PosModule isActive={activeTab === 'pos'} />
            <HistoryModule isActive={activeTab === 'hist'} />
            <LaporanModule isActive={activeTab === 'laporan'} />
          </div>
        </>
      )}

      {/* TOASTS */}
      {toastMsg && (
        <div className={`toast ${toastMsg.type}`}>
          {toastMsg.type === 'ok' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          {toastMsg.type === 'err' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
          {toastMsg.type === 'info' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>}
          {toastMsg.msg}
        </div>
      )}

      {/* MODALS */}
      <Modals />
    </>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// STUBS for Modules (Will expand next)
import { PosModule } from './modules/PosModule';
import { HistoryModule } from './modules/HistoryModule';
import { LaporanModule } from './modules/LaporanModule';
