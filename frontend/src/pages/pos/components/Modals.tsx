import React, { useState, useEffect } from 'react';
import { usePosStore } from '../store';
import { MENU, MEMBERS, SEG, HISTORY, REFUNDS, formatRupiah, STAFF } from '../mockData';

export function Modals() {
  return (
    <>
      <OptsModal />
      <ItemNoteModal />
      <DiscModal />
      <MemModal />
      <PayModal />
      <SuccessModal />
      <VoidModal />
    </>
  );
}

function OptsModal() {
  const { showOptsModalId, setShowOptsModalId, cart, addCartItem } = usePosStore();
  const [selectedOpts, setSelectedOpts] = useState<Record<string, any>>({});
  const [selectedAddons, setSelectedAddons] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (showOptsModalId) {
      setSelectedOpts({});
      setSelectedAddons({});
    }
  }, [showOptsModalId]);

  if (!showOptsModalId) return null;
  const m = MENU.find(x => x.id === showOptsModalId);
  if (!m) return null;

  let addonPrice = 0;
  Object.keys(selectedAddons).forEach(idx => {
    if (selectedAddons[Number(idx)] && m.addons && m.addons[Number(idx)]) {
      addonPrice += m.addons[Number(idx)].p;
    }
  });
  const grand = m.p + addonPrice;

  const handleConfirm = () => {
    const sAddons: any[] = [];
    Object.keys(selectedAddons).forEach(idx => {
      if (selectedAddons[Number(idx)] && m.addons) {
        sAddons.push(m.addons[Number(idx)]);
      }
    });
    const addonNames = sAddons.map(a => a.n).join(', ');
    const cartKey = m.id + '_' + Date.now();
    addCartItem({
      ...m,
      qty: 1,
      p: grand,
      selectedOpts,
      note: '',
      cartKey,
      addonPrice,
      addonNames
    });
    setShowOptsModalId(null);
  };

  return (
    <div className="ov" onClick={(e) => { if (e.target === e.currentTarget) setShowOptsModalId(null); }}>
      <div className="mo" style={{ width: 380 }}>
        <div className="mo-h">
          <div>
            <div className="mo-t">{m.n}</div>
            <div style={{ fontSize: 12, color: 'var(--txt3)', marginTop: 2 }}>{m.d} · <span style={{ color: 'var(--or)', fontFamily: 'var(--mo)' }}>{formatRupiah(m.p)}</span></div>
          </div>
          <div className="mo-x" onClick={() => setShowOptsModalId(null)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </div>
        </div>
        <div className="mo-b">
          {(m.opts || []).map((g: any, gi: number) => (
            <div key={gi} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{g.label}</span>
                <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: 'var(--blL)', color: 'var(--bl)' }}>{g.type === 'single' ? 'Pilih 1' : 'Multi-pilih'}</span>
              </div>
              {g.choices.map((ch: string) => {
                const sel = g.type === 'single' ? selectedOpts[g.label] === ch : (selectedOpts[g.label] || []).includes(ch);
                return (
                  <label key={ch} className={`opts-choice ${sel ? 'sel' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--sf2)', border: `1px solid ${sel ? 'rgba(228,84,12,.4)' : 'var(--brd)'}`, borderRadius: 9, cursor: 'pointer', marginBottom: 5 }}>
                    <input
                      type={g.type === 'single' ? 'radio' : 'checkbox'}
                      name={`og-${m.id}-${gi}`}
                      value={ch}
                      checked={sel}
                      onChange={() => {
                        if (g.type === 'single') {
                          setSelectedOpts(prev => ({ ...prev, [g.label]: ch }));
                        } else {
                          const curr = selectedOpts[g.label] || [];
                          if (curr.includes(ch)) setSelectedOpts(prev => ({ ...prev, [g.label]: curr.filter((x: any) => x !== ch) }));
                          else setSelectedOpts(prev => ({ ...prev, [g.label]: [...curr, ch] }));
                        }
                      }}
                      style={{ width: 16, height: 16, accentColor: 'var(--or)', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)' }}>{ch}</span>
                  </label>
                );
              })}
            </div>
          ))}

          {m.addons && m.addons.length > 0 && (
            <div style={{ borderTop: '1px solid var(--brd)', marginTop: 4, paddingTop: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Variasi Add-on</span>
                <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: 'var(--gnL)', color: 'var(--gn)' }}>Opsional · Multi-pilih</span>
              </div>
              {m.addons.map((a: any, ai: number) => {
                const isSel = selectedAddons[ai];
                return (
                  <div key={ai} className={`addon-row ${isSel ? 'ao-sel' : ''}`} onClick={() => setSelectedAddons(prev => ({ ...prev, [ai]: !isSel }))} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: isSel ? 'var(--gnL)' : 'var(--sf2)', border: `1px solid ${isSel ? 'rgba(34,197,94,.45)' : 'var(--brd)'}`, borderRadius: 10, cursor: 'pointer', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="ao-check" style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${isSel ? 'var(--gn)' : 'var(--brd2)'}`, background: isSel ? 'var(--gn)' : 'var(--sf3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)' }}>{a.n}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gn)', fontFamily: 'var(--mo)', background: 'var(--gnL)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 7, padding: '3px 9px' }}>+{formatRupiah(a.p)}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div id="opts-total-bar" style={{ background: 'var(--sf2)', border: '1px solid var(--brd)', borderRadius: 10, padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--txt3)', fontWeight: 500 }}>Total harga</span>
            <span id="opts-total-val" style={{ fontSize: 17, fontWeight: 900, color: 'var(--or)', fontFamily: 'var(--mo)' }}>{formatRupiah(grand)}</span>
          </div>
          <button onClick={handleConfirm} style={{ width: '100%', marginTop: 12, padding: 13, borderRadius: 11, border: 'none', background: 'var(--or)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--fn)' }}>Tambah ke Pesanan — {formatRupiah(grand)}</button>
        </div>
      </div>
    </div>
  );
}

function ItemNoteModal() {
  const { showItemNoteKey, setShowItemNoteKey, cart, updateCartNote } = usePosStore();
  const [note, setNote] = useState('');

  useEffect(() => {
    if (showItemNoteKey) {
      const item = cart.find(i => i.cartKey === showItemNoteKey);
      setNote(item?.note || '');
    }
  }, [showItemNoteKey, cart]);

  if (!showItemNoteKey) return null;
  const item = cart.find(i => i.cartKey === showItemNoteKey);
  if (!item) return null;

  return (
    <div className="ov" onClick={(e) => { if (e.target === e.currentTarget) setShowItemNoteKey(null); }}>
      <div className="mo" style={{ width: 340 }}>
        <div className="mo-h">
          <div className="mo-t">Catatan: {item.n}</div>
          <div className="mo-x" onClick={() => setShowItemNoteKey(null)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </div>
        </div>
        <div className="mo-b">
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{ width: '100%', background: 'var(--sf2)', border: '1px solid var(--brd)', borderRadius: 9, padding: '10px 12px', fontSize: 14, color: 'var(--txt)', outline: 'none', fontFamily: 'var(--fn)', resize: 'none', minHeight: 80 }}
            placeholder="Contoh: tanpa bawang, extra sambal..."
          />
          <button onClick={() => { updateCartNote(showItemNoteKey, note); setShowItemNoteKey(null); }} style={{ width: '100%', marginTop: 10, padding: 12, borderRadius: 10, border: 'none', background: 'var(--or)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Simpan Catatan</button>
        </div>
      </div>
    </div>
  );
}

function DiscModal() {
  const { showDiscModal, setShowDiscModal, cart, discount, setDiscount } = usePosStore();
  const sub = cart.reduce((s, i) => s + i.p * i.qty, 0);
  const [val, setVal] = useState(String(discount));

  useEffect(() => {
    if (showDiscModal) setVal(String(discount));
  }, [showDiscModal, discount]);

  if (!showDiscModal) return null;

  return (
    <div className="ov" onClick={(e) => { if (e.target === e.currentTarget) setShowDiscModal(false); }}>
      <div className="mo dmo">
        <div className="mo-h">
          <div className="mo-t">Beri Diskon</div>
          <div className="mo-x" onClick={() => setShowDiscModal(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </div>
        </div>
        <div className="mo-b">
          <p style={{ fontSize: 12, color: 'var(--txt2)', marginBottom: 12 }}>Subtotal: <strong style={{ color: 'var(--txt)' }}>{formatRupiah(sub)}</strong></p>
          <div className="disc-presets">
            {[5, 10, 15, 20, 25].map(p => (
              <button key={p} className="dp" onClick={() => setVal(String(Math.round(sub * p / 100)))}>{p}%</button>
            ))}
          </div>
          <input className="disc-inp" type="number" value={val} min="0" max={sub} onChange={e => setVal(e.target.value)} />
          <button className="btn-apl" onClick={() => { setDiscount(parseInt(val || '0')); setShowDiscModal(false); }}>Terapkan Diskon</button>
        </div>
      </div>
    </div>
  );
}

function MemModal() {
  const { showMemModal, setShowMemModal, setCurMember, showToast } = usePosStore();
  const [memInput, setMemInput] = useState('');

  useEffect(() => {
    if (showMemModal) setMemInput('');
  }, [showMemModal]);

  if (!showMemModal) return null;

  const clean = memInput.replace(/\D/g, '');
  const c = MEMBERS[clean] || MEMBERS[clean.slice(0, 11)];

  return (
    <div className="ov" onClick={(e) => { if (e.target === e.currentTarget) setShowMemModal(false); }}>
      <div className="mo memmo">
        <div className="mo-h">
          <div className="mo-t">Cari Member</div>
          <div className="mo-x" onClick={() => setShowMemModal(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </div>
        </div>
        <div className="mo-b">
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Ketuk untuk input nomor HP..."
            value={memInput}
            onChange={e => setMemInput(e.target.value.replace(/[^0-9]/g, ''))}
            style={{ width: '100%', background: 'var(--sf2)', border: '1px solid var(--brd2)', borderRadius: 10, padding: '11px 14px', fontSize: 18, fontWeight: 700, color: 'var(--txt)', outline: 'none', fontFamily: 'var(--mo)', marginBottom: 10, display: 'block' }}
          />
          <div className="mem-npd">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(k => (
              k ? <button key={k} className={`mnk ${k === '⌫' ? 'dl' : ''}`} onClick={() => { if (k === '⌫') setMemInput(prev => prev.slice(0, -1)); else if (memInput.length < 13) setMemInput(prev => prev + k); }}>{k}</button> : <div key={Math.random()} />
            ))}
          </div>
          <div className="mem-res-area" id="mem-res">
            {clean.length >= 5 && c ? (
              <div className="mem-result-card">
                <div className="mem-res-h">
                  <div className="mem-av">{c.name[0]}</div>
                  <div>
                    <div className="mem-nm">{c.name}</div>
                    <div className="mem-ph">{c.phone}</div>
                    <span className={`segb ${SEG[c.seg]?.[0] || SEG.new[0]}`}>{SEG[c.seg]?.[1] || SEG.new[1]}</span>
                  </div>
                </div>
                <div className="mem-stats">
                  <div className="mem-stat"><div className="mem-stat-lbl">Kunjungan</div><div className="mem-stat-val">{c.v}×</div></div>
                  <div className="mem-stat"><div className="mem-stat-lbl">Total Belanja</div><div className="mem-stat-val">Rp {(c.sp / 1000).toFixed(0)}rb</div></div>
                </div>
                <button className="btn-pick" onClick={() => { setCurMember(c.name); setShowMemModal(false); }}>✓ Pilih Member Ini</button>
              </div>
            ) : clean.length >= 7 ? (
              <div style={{ textAlign: 'center', padding: 12, color: 'var(--txt3)', fontSize: 12 }}>Tidak ditemukan untuk nomor <strong style={{ color: 'var(--txt)' }}>{clean}</strong></div>
            ) : null}
          </div>
          <div className="mem-footer">
            <button className="btn-add-new" onClick={() => { setCurMember('Baru'); setShowMemModal(false); showToast('Pelanggan akan didaftarkan saat checkout', 'info'); }}>+ Daftarkan Pelanggan Baru</button>
            <button className="btn-skip-mem" onClick={() => { setCurMember(null); setShowMemModal(false); }}>Lewati — Lanjut tanpa Member</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PayModal() {
  const { showPayModal, setShowPayModal, cart, discount, orderType, tableNo, currentUser, curMember, history, addHistory, clearCart, setSuccessData, setShowSuccessModal } = usePosStore();
  const [pmSel, setPmSel] = useState('cash');
  const [cashIn, setCashIn] = useState('');
  const [delivNote, setDelivNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const sub = cart.reduce((s, i) => s + i.p * i.qty, 0);
  const disc = Math.min(discount, sub);
  const base = sub - disc;
  const tax = Math.round(base * 0.11);
  const svc = Math.round(base * 0.05);
  const grand = base + tax + svc;

  useEffect(() => {
    if (showPayModal) {
      setPmSel('cash');
      setCashIn('');
      setDelivNote('');
      setProcessing(false);
    }
  }, [showPayModal]);

  if (!showPayModal) return null;

  const isDelivery = ['gofood', 'grabfood', 'shopee'].includes(pmSel);
  const PMS = [
    { id: 'cash', label: 'Tunai', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
    { id: 'transfer', label: 'Transfer', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
    { id: 'qris', label: 'QRIS', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="18" y="18" width="2" height="2"/><rect x="20" y="20" width="2" height="2"/></svg>' },
    { id: 'bca', label: 'BCA', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#1E40AF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><text x="5" y="19" font-size="5" fill="#1E40AF" stroke="none">BCA</text></svg>' },
    { id: 'debit', label: 'Debit', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><circle cx="6" cy="15.5" r="1.5" fill="#A855F7"/></svg>' },
    { id: 'gofood', label: 'GoFood', delivery: true, svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#E3175B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>' },
    { id: 'grabfood', label: 'GrabFood', delivery: true, svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#00B14F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>' },
    { id: 'shopee', label: 'ShopeeFood', delivery: true, svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#EE4D2D" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>' },
  ];

  const paid = pmSel === 'cash' ? parseInt(cashIn || '0') : grand;
  const canPay = pmSel === 'cash' ? paid >= grand : true;

  const doPay = () => {
    setProcessing(true);
    setTimeout(() => {
      const chg = Math.max(0, paid - grand);
      const newId = history.length ? history[0].id + 1 : 1;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const yymmdd = String(now.getFullYear()).slice(2) + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0');
      const invoiceNo = 'INV-' + yymmdd + '-' + String(newId).padStart(4, '0');
      const PM_LABELS: any = { cash: 'Tunai', qris: 'QRIS', bca: 'BCA', debit: 'Debit', gofood: 'GoFood', grabfood: 'GrabFood', shopee: 'ShopeeFood', transfer: 'Transfer' };
      
      const txn = {
        id: newId,
        no: invoiceNo,
        table: tableNo || (orderType === 'dine' ? 'T01' : 'TAKE'),
        type: orderType,
        cashier: currentUser ? currentUser.name : 'Kasir',
        time: hh + ':' + mm,
        method: PM_LABELS[pmSel] || pmSel,
        status: 'done',
        sub: sub,
        disc: disc,
        tax: tax,
        svc: svc,
        tips: 0,
        total: grand,
        member: curMember,
        delivNote: delivNote,
        items: cart.map(i => {
          let mods = i.selectedOpts ? Object.values(i.selectedOpts).flat() : [];
          if (i.addonNames) mods = mods.concat(i.addonNames.split(', ').map((a: string) => '+' + a));
          return { id: i.id, n: i.n, qty: i.qty, p: i.p, mods: mods };
        })
      };
      
      addHistory(txn);
      setShowPayModal(false);
      clearCart();
      setSuccessData({ grand, chg, delivNote });
      setShowSuccessModal(true);
    }, 900);
  };

  return (
    <div className="pay-ov" onClick={(e) => { if (e.target === e.currentTarget && !processing) setShowPayModal(false); }}>
      <div className="pay-modal">
        <div className="pay-head">
          <div className="pay-head-t"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> Pembayaran</div>
          {!processing && <div className="pay-x" onClick={() => setShowPayModal(false)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></div>}
        </div>
        <div className="pay-body">
          <div className="pay-left">
            <div className="pay-total-box"><div className="pay-total-lbl">Total Tagihan</div><div className="pay-total-amt">{formatRupiah(grand)}</div></div>
            <div className="pm-lbl">Metode Pembayaran</div>
            <div className="pm-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {PMS.map(pm => {
                const act = pm.id === pmSel ? ' act' : '';
                const isLocked = pm.delivery && orderType === 'dine';
                const style = isLocked ? { opacity: 0.3, cursor: 'not-allowed', pointerEvents: 'none' as const } : {};
                return (
                  <div key={pm.id} className={`pmb ${act}`} onClick={() => setPmSel(pm.id)} style={style}>
                    <div className="pmb-ico" dangerouslySetInnerHTML={{ __html: pm.svg }} />
                    <div className="pmb-lbl">{pm.label}</div>
                    {isLocked && <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 2, fontWeight: 600 }}>Khusus Delivery</div>}
                  </div>
                );
              })}
            </div>
            {isDelivery && (
              <div id="delivery-note-wrap" style={{ marginTop: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Catatan Driver / PIN</div>
                <input type="text" placeholder="Contoh: nama driver, PIN loker..." value={delivNote} onChange={e => setDelivNote(e.target.value)} style={{ width: '100%', background: 'var(--sf2)', border: '1px solid var(--brd2)', borderRadius: 9, padding: '9px 12px', fontSize: 13, color: 'var(--txt)', outline: 'none', fontFamily: 'var(--fn)', transition: 'border .15s' }} />
              </div>
            )}
          </div>
          <div className="pay-mid">
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div className="npd" style={{ opacity: isDelivery ? 0.15 : 1, pointerEvents: isDelivery ? 'none' : 'auto' }}>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'UANG PAS', '0', '⌫'].map(k => (
                  <div key={k} className={`nk ${k === 'UANG PAS' ? 'sp' : k === '⌫' ? 'dl' : ''}`} onClick={() => {
                    if (k === '⌫') setCashIn(prev => prev.slice(0, -1));
                    else if (k === 'UANG PAS') setCashIn(String(grand));
                    else setCashIn(prev => prev + k);
                  }}>{k}</div>
                ))}
              </div>
              {isDelivery && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, pointerEvents: 'none' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>Konfirmasi otomatis</span>
                </div>
              )}
            </div>
            <button className="btn-cfm" id="btn-cfm" disabled={!canPay || processing} onClick={doPay}>
              {processing ? 'Memproses...' : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Konfirmasi</>}
            </button>
          </div>
          <div className="pay-right">
            <div className={`cash-area ${pmSel === 'cash' && paid >= grand ? 'ok' : ''}`} style={{ opacity: pmSel === 'cash' ? 1 : 0.3 }}>
              <div className="cash-lbl">Uang Diterima</div>
              <div className="cash-val">{paid > 0 ? formatRupiah(paid) : '—'}</div>
              {pmSel === 'cash' && paid >= grand && (
                <div className="cash-chg" style={{ display: 'flex' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Kembalian: {formatRupiah(paid - grand)}</span>
                </div>
              )}
            </div>
            <div className="sum-lbl">Rincian Pesanan</div>
            <div className="pay-sum">
              {cart.map(it => {
                let mods = it.selectedOpts ? Object.values(it.selectedOpts).flat() : [];
                if (it.addonNames) mods = mods.concat(it.addonNames.split(', ').map(a => '+' + a));
                return (
                  <div key={it.cartKey} className="sum-item">
                    <div>
                      <div className="sum-item-n">{it.n}</div>
                      {mods.length > 0 && <div style={{ fontSize: 11, color: 'var(--or)', marginTop: 2 }}>{mods.join(' · ')}</div>}
                      <div className="sum-item-q">{it.qty}× {formatRupiah(it.p)}</div>
                    </div>
                    <div className="sum-item-p">{formatRupiah(it.p * it.qty)}</div>
                  </div>
                );
              })}
              <div className="sum-tots">
                <div className="sum-row"><span>Subtotal</span><span>{formatRupiah(sub)}</span></div>
                {disc > 0 && <div className="sum-row disc"><span>Diskon</span><span>- {formatRupiah(disc)}</span></div>}
                <div className="sum-row"><span>Pajak 11%</span><span>{formatRupiah(tax)}</span></div>
                <div className="sum-row"><span>Service 5%</span><span>{formatRupiah(svc)}</span></div>
                <div className="sum-row grand"><span>Total</span><span>{formatRupiah(grand)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessModal() {
  const { showSuccessModal, setShowSuccessModal, successData, setSuccessData } = usePosStore();

  if (!showSuccessModal || !successData) return null;
  const { grand, chg } = successData;

  const handleNewOrder = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
  };

  return (
    <div className="ov" onClick={(e) => { if (e.target === e.currentTarget) handleNewOrder(); }}>
      <div className="mo smo">
        <div className="mo-b" style={{ padding: 24 }}>
          <div className="sico"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div className="stitl">Pembayaran Berhasil!</div>
          <div className="ssub">Pesanan dikirim ke dapur</div>
          {chg > 0 ? (
            <div className="chg-box">
              <div className="chg-lbl">Kembalian</div>
              <div className="chg-amt">{formatRupiah(chg)}</div>
            </div>
          ) : (
            <div style={{ background: 'var(--orM)', border: '1px solid rgba(228,84,12,.18)', borderRadius: 12, padding: 13, marginBottom: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--or)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 2 }}>Total Dibayar</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--or)', fontFamily: 'var(--mo)' }}>{formatRupiah(grand)}</div>
            </div>
          )}
          <button className="btn-new" onClick={handleNewOrder}>+ Order Baru</button>
        </div>
      </div>
    </div>
  );
}

function VoidModal() {
  const { showVoidModal, setShowVoidModal, selTxn, setSelTxn, currentUser, updateHistory, addRefund, showToast } = usePosStore();
  const [voidArr, setVoidArr] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [doRefund, setDoRefund] = useState(false);
  const [vErr, setVErr] = useState('');

  const managers = STAFF.filter(s => s.role === 'Manager');

  useEffect(() => {
    if (showVoidModal) {
      setVoidArr([]);
      setReason('');
      setDoRefund(false);
      setVErr('');
    }
  }, [showVoidModal]);

  if (!showVoidModal || !selTxn || selTxn.status === 'voided') return null;

  const handlePin = (k: string) => {
    if (k === '⌫') setVoidArr(prev => prev.slice(0, -1));
    else if (voidArr.length < 4) {
      const newArr = [...voidArr, k];
      setVoidArr(newArr);
      if (newArr.length === 4) {
        const pinStr = newArr.join('');
        const matchingManager = managers.find(m => m.pin === pinStr);
        if (matchingManager) {
          if (!reason) {
            setVErr('Pilih alasan void terlebih dahulu.');
            setVoidArr([]);
            return;
          }
          // DO VOID
          updateHistory(selTxn.id, {
            status: 'voided',
            voidBy: matchingManager.name,
            voidReason: reason,
            refunded: doRefund,
            refundAmt: doRefund ? selTxn.total : 0
          });
          if (doRefund) {
            addRefund({ no: selTxn.no, amt: selTxn.total, reason, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
          }
          setSelTxn({ ...selTxn, status: 'voided', voidBy: matchingManager.name, voidReason: reason });
          setShowVoidModal(false);
          showToast(`Order ${selTxn.no} di-void${doRefund ? ' + refund' : ''}`, 'err');
        } else {
          setVErr('PIN Manager salah. Coba lagi.');
          setVoidArr([]);
          setTimeout(() => setVErr(''), 900);
        }
      }
    }
  };

  return (
    <div className="ov" onClick={(e) => { if (e.target === e.currentTarget) setShowVoidModal(false); }}>
      <div className="mo vmo" style={{ width: 380 }}>
        <div className="mo-h">
          <div className="mo-t">Void Order</div>
          <div className="mo-x" onClick={() => setShowVoidModal(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </div>
        </div>
        <div className="mo-b">
          <div className="vico"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--rd)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
          <div className="vtitl">Konfirmasi Void</div>
          <div className="vsub">Order <strong>{selTxn.no}</strong> — {formatRupiah(selTxn.total)}</div>
          
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Alasan Void</div>
            <select value={reason} onChange={e => setReason(e.target.value)} style={{ width: '100%', background: 'var(--sf2)', border: '1px solid var(--brd2)', borderRadius: 9, padding: '9px 12px', fontSize: 14, fontWeight: 600, color: 'var(--txt)', outline: 'none', fontFamily: 'var(--fn)', cursor: 'pointer', appearance: 'none' }}>
              <option value="">-- Pilih alasan --</option>
              <option value="Salah input">Salah input</option>
              <option value="Pembatalan pesanan online">Pembatalan pesanan online</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--sf2)', border: '1px solid var(--brd)', borderRadius: 9, padding: '11px 14px', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>Proses Refund</div>
              <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 1 }}>Masuk laporan petty cash hari ini</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
              <input type="checkbox" checked={doRefund} onChange={e => setDoRefund(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', inset: 0, background: doRefund ? 'var(--gn)' : 'var(--sf3)', borderRadius: 12, transition: '.2s', border: '1px solid var(--brd2)' }}></span>
              <span style={{ position: 'absolute', left: doRefund ? 23 : 3, top: 3, width: 16, height: 16, background: '#fff', borderRadius: '50%', transition: '.2s', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }}></span>
            </label>
          </div>

          <div className="pin-dots">
            {[0, 1, 2, 3].map(i => <div key={i} className={`pdot ${i < voidArr.length ? 'on' : ''}`} />)}
          </div>
          <div className="pin-err" style={{ color: 'var(--rd)' }}>{vErr}</div>

          <div className="pin-pad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(k => (
              k ? <button key={k} className={`ppk ${k === '⌫' ? 'dl' : ''}`} onClick={() => handlePin(k)}>{k}</button> : <div key={Math.random()} />
            ))}
          </div>
          <button className="btn-cv" onClick={() => setShowVoidModal(false)}>Batalkan</button>
        </div>
      </div>
    </div>
  );
}
