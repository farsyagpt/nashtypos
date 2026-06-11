import React, { useState } from 'react';
import { usePosStore } from '../store';
import { MENU, icoColor, formatRupiah, ico } from '../mockData';

export function HistoryModule({ isActive }: { isActive: boolean }) {
  const {
    history,
    histFilter, setHistFilter,
    histQ, setHistQ,
    selTxn, setSelTxn,
  } = usePosStore();

  const [showVoidModal, setShowVoidModal] = useState(false);

  const items = history.filter(h => {
    if (histFilter !== 'all' && h.status !== histFilter) return false;
    if (histQ) {
      const q = histQ.toLowerCase();
      return h.no.toLowerCase().includes(q) || String(h.table).toLowerCase().includes(q) || h.cashier.toLowerCase().includes(q) || (h.member || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className={`mod ${isActive ? 'act' : ''}`} id="mod-hist">
      <div className="hist-body">
        <div className="hist-list">
          <div className="hist-tb">
            <div className="hist-tb-top">
              <div className="hist-ttl">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
                Riwayat
              </div>
              <div className="hist-sum">{history.length} txn · {formatRupiah(history.reduce((sum, h) => sum + h.total, 0))}</div>
            </div>
            <div className="flts">
              <button className={`fbt ${histFilter === 'all' ? 'act' : ''}`} onClick={() => setHistFilter('all')}>Semua</button>
              <button className={`fbt ${histFilter === 'done' ? 'act' : ''}`} onClick={() => setHistFilter('done')}>Selesai</button>
              <button className={`fbt ${histFilter === 'voided' ? 'act' : ''}`} onClick={() => setHistFilter('voided')}>Void</button>
              <button className={`fbt ${histFilter === 'open' ? 'act' : ''}`} onClick={() => setHistFilter('open')}>Terbuka</button>
            </div>
            <div className="hsrch">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--txt3)', flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input type="text" id="hsrch" placeholder="No. order, meja, kasir..." value={histQ} onChange={e => setHistQ(e.target.value)} />
            </div>
          </div>
          <div className="hist-items" id="hist-items">
            {!items.length && <div style={{ textAlign: 'center', padding: '32px', color: 'var(--txt3)', fontSize: '12px' }}>Tidak ada transaksi</div>}
            {items.map(h => (
              <div key={h.id} className={`hist-item ${selTxn && selTxn.id === h.id ? 'act' : ''} ${h.status === 'voided' ? 'voided' : ''}`} onClick={() => setSelTxn(h)}>
                <div className="hi-top">
                  <div className="hi-no">{h.no}</div>
                  <div className={`hi-st ${h.status}`}>{h.status === 'done' ? 'SELESAI' : h.status === 'voided' ? 'VOID' : 'TERBUKA'}</div>
                </div>
                <div className="hi-meta">
                  <span>{h.time}</span><span>{h.type === 'take' ? 'Take Away' : 'Meja ' + h.table}</span><span>{h.cashier}</span><span>{h.method}</span>
                </div>
                <div className="hi-total">{formatRupiah(h.total)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hist-detail">
          <div className="hd-bar">
            <div>
              <div className="hd-no" id="hd-no">{selTxn ? selTxn.no : 'Pilih transaksi'}</div>
              <div className="hd-meta" id="hd-meta">
                {!selTxn ? 'Klik item untuk detail & struk' : (
                  <>Hari ini · {selTxn.time} | {selTxn.type === 'take' ? 'Take Away' : 'Meja ' + selTxn.table} | Kasir: {selTxn.cashier}</>
                )}
              </div>
            </div>
            <div className="hd-acts" id="hd-acts" style={{ display: selTxn ? 'flex' : 'none' }}>
              <button className="btn-print" onClick={() => usePosStore.getState().showToast('Mencetak struk ' + selTxn?.no, 'ok')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                Cetak Ulang
              </button>
              <button className="btn-void-o" id="btn-void-o" onClick={() => selTxn?.status !== 'voided' && setShowVoidModal(true)} style={{ opacity: selTxn?.status === 'voided' ? 0.5 : 1 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                Void
              </button>
            </div>
          </div>
          
          <div className="hd-body" id="hd-body">
            {!selTxn ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.15 }}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt3)' }}>Pilih transaksi untuk detail & struk</p>
              </div>
            ) : (
              <>
                {selTxn.status === 'voided' && (
                  <div style={{ background: 'var(--rdL)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 10, padding: '10px 13px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--rd)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--rd)' }}>Order di-VOID</div>
                      <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 1 }}>Oleh: {selTxn.voidBy} · {selTxn.voidReason}</div>
                    </div>
                  </div>
                )}
                <div className="hd-sec">
                  <div className="hd-sec-h">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> Detail Pesanan
                  </div>
                  {selTxn.items.map((it: any, idx: number) => {
                    const m = MENU.find(x => x.id === it.id) || { ico: 'rice', cat: 'main' };
                    const clr = icoColor(m.cat);
                    return (
                      <div key={idx} className="hd-item">
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--sf2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <div style={{ width: 18, height: 18 }} dangerouslySetInnerHTML={{ __html: ico(m.ico, clr) }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="hd-iname">{it.n}</div>
                          {it.mods && it.mods.length > 0 && <div className="hd-imod">{it.mods.join(', ')}</div>}
                          <div className="hd-iqty">{it.qty}× {formatRupiah(it.p)}</div>
                        </div>
                        <div className="hd-iprice">{formatRupiah(it.qty * it.p)}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="hd-sec">
                  <div className="hd-sec-h">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> Rincian Tagihan
                  </div>
                  <div className="hd-row"><div className="hd-rl">Subtotal</div><div className="hd-rv">{formatRupiah(selTxn.sub)}</div></div>
                  {selTxn.disc > 0 && <div className="hd-row"><div className="hd-rl">Diskon</div><div className="hd-rv gn">- {formatRupiah(selTxn.disc)}</div></div>}
                  <div className="hd-row"><div className="hd-rl">Pajak (11%)</div><div className="hd-rv">{formatRupiah(selTxn.tax)}</div></div>
                  <div className="hd-row"><div className="hd-rl">Service (5%)</div><div className="hd-rv">{formatRupiah(selTxn.svc)}</div></div>
                  <div className="hd-row" style={{ background: 'var(--orM)' }}>
                    <div className="hd-rl" style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--txt)' }}>Total</div>
                    <div className="hd-rv or" style={{ fontSize: 15 }}>{formatRupiah(selTxn.total)}</div>
                  </div>
                  <div className="hd-row"><div className="hd-rl">Metode</div><div className="hd-rv">{selTxn.method}</div></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
