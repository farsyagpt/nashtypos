import React, { useState } from 'react';
import { usePosStore } from '../store';
import { CATS, MENU, icoColor, formatRupiah, formatRupiahShort, ico } from '../mockData';

export function PosModule({ isActive }: { isActive: boolean }) {
  const {
    curCat, setCurCat,
    searchMenuQ, setSearchMenuQ,
    favorites, toggleFav,
    cart, addCartItem, updateCartQty, updateCartNote, clearCart,
    discount, setDiscount,
    curMember, setCurMember,
    orderType, setOrderType,
    tableNo, setTableNo,
    setShowOptsModalId, setShowItemNoteKey, setShowPayModal, setShowMemModal
  } = usePosStore();

  // Cart totals calculation
  const calcT = () => {
    const sub = cart.reduce((s, i) => s + i.p * i.qty, 0);
    const disc = Math.min(discount, sub);
    const base = sub - disc;
    const tax = Math.round(base * 0.11);
    const svc = Math.round(base * 0.05);
    return { sub, disc, base, tax, svc, grand: base + tax + svc };
  };

  const { sub, disc, tax, svc, grand } = calcT();

  const handleMenuClick = (m: any) => {
    if (m.sold) return;
    const hasOpts = m.opts && m.opts.length > 0;
    const hasAddons = m.addons && m.addons.length > 0;
    if (hasOpts || hasAddons) {
      setShowOptsModalId(m.id);
    } else {
      addCartItem({ ...m, qty: 1, selectedOpts: {}, note: '', cartKey: String(m.id) });
    }
  };

  // Render menu items
  const sq = searchMenuQ.toLowerCase();
  const items = MENU.filter(m => {
    const catOk = searchMenuQ ? true : (curCat === 'fav' ? favorites.has(m.id) : m.cat === curCat);
    const srchOk = !searchMenuQ || m.n.toLowerCase().includes(sq);
    return catOk && srchOk;
  });

  return (
    <div className={`mod ${isActive ? 'act' : ''}`} id="mod-pos">
      <div className="pos-body">
        {/* MENU PANEL */}
        <div className="menu-panel">
          <div className="cat-strip" id="cat-strip">
            {CATS.map(c => {
              const cnt = MENU.filter(m => m.cat === c.id).length;
              return (
                <button key={c.id} className={`cbt ${c.id === curCat ? 'act' : ''}`} onClick={() => { setCurCat(c.id); setSearchMenuQ(''); }}>
                  <span dangerouslySetInnerHTML={{ __html: c.svg }} /> {c.label} <span className="cat-ct">{c.id === 'fav' ? favorites.size : cnt}</span>
                </button>
              );
            })}
          </div>
          <div className="srch-row">
            <div className="srch-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--txt3)', flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input type="text" id="msearch" placeholder="Cari nama menu..." value={searchMenuQ} onChange={e => setSearchMenuQ(e.target.value)} />
              {searchMenuQ && <span className="srch-ct" id="srch-ct">{items.length} item</span>}
            </div>
          </div>
          <div className="menu-grid" id="menu-grid">
            {!items.length && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '32px', color: 'var(--txt3)', fontSize: '13px' }}>Tidak ada menu ditemukan</div>}
            {items.map(m => {
              const isAddon = m.cat === 'addon';
              const qty = cart.filter(i => i.id === m.id).reduce((s, i) => s + i.qty, 0);
              const clr = icoColor(m.cat);
              const hasOpts = m.opts && m.opts.length > 0;
              const hasAddons = m.addons && m.addons.length > 0;
              const OPTS_SVG = `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`;

              return (
                <div key={m.id} className={`mcard ${m.sold ? 'sold' : ''} ${isAddon ? 'addon-c' : ''}`} onClick={() => handleMenuClick(m)}>
                  <div className="mc-img">
                    <div className="mc-ph"><div style={{ width: 32, height: 32 }} dangerouslySetInnerHTML={{ __html: ico(m.ico, clr) }} /><span>Foto produk</span></div>
                    {m.sold && <div className="mc-sold-ov"><div className="mc-sold-b">Habis</div></div>}
                    {qty > 0 && <div className="mc-qty-b">{qty}</div>}
                    {(hasOpts || hasAddons) && <div className="mc-opts-b" dangerouslySetInnerHTML={{ __html: OPTS_SVG + ' Opsi' }} />}
                  </div>
                  <div className="mc-body">
                    <div className="mc-name">{m.n}</div>
                    <div className="mc-desc">{m.d}</div>
                    <div className="mc-footer">
                      <div className={isAddon ? 'mc-price-pu' : 'mc-price'}>{formatRupiah(m.p)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CART PANEL */}
        <div className="cart-panel">
          <div className="cart-hdr">
            <div><span className="cart-title">Pesanan</span><span className="cart-n" id="cart-n">{cart.reduce((s, i) => s + i.qty, 0)}</span></div>
            <div className={`member-pill ${curMember ? 'on' : ''}`} id="mem-pill" onClick={() => setShowMemModal(true)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <span id="mem-lbl">{curMember ? curMember.split(' ')[0] : 'Member'}</span>
            </div>
          </div>
          {/* Meja */}
          <div className="tbl-row">
            <span className="tbl-lbl">Meja</span>
            <input type="text" className="tbl-inp" id="tbl-no" placeholder="T01..." value={tableNo} onChange={e => setTableNo(e.target.value)} />
          </div>
          {/* Order type */}
          <div className="otype-row">
            <button className={`obt ${orderType === 'dine' ? 'act' : ''}`} onClick={() => setOrderType('dine')}>Dine In</button>
            <button className={`obt ${orderType === 'take' ? 'act' : ''}`} onClick={() => setOrderType('take')}>Take Away</button>
          </div>
          {/* Cart items */}
          <div className="cart-items" id="cart-items">
            {!cart.length && (
              <div className="cart-empty">
                <svg className="ce-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                <span className="ce-txt">Tekan kartu menu<br />untuk menambahkan</span>
              </div>
            )}
            {cart.map(item => {
              const opts = item.selectedOpts ? Object.values(item.selectedOpts).flat().join(', ') : '';
              const addonStr = item.addonNames || '';
              const noted = item.note && item.note.length > 0;
              return (
                <div key={item.cartKey} className="ci">
                  <div className="ci-info">
                    <div className="ci-name">{item.n}</div>
                    {opts && <div className="ci-opts">{opts}</div>}
                    {addonStr && <div className="ci-opts" style={{ color: 'var(--gn)' }}>+{addonStr}</div>}
                    {noted && <div className="ci-note-tag">{item.note}</div>}
                    <div className="ci-unitp">{formatRupiah(item.p)}</div>
                    <div className="ci-totalp">{formatRupiah(item.p * item.qty)}</div>
                  </div>
                  <div className="ci-right">
                    <div className="ci-qty">
                      <div className="qb mi" onClick={() => updateCartQty(item.cartKey, -1)}>
                        {item.qty === 1 ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>}
                      </div>
                      <span className="qnum">{item.qty}</span>
                      <div className="qb pl" onClick={() => updateCartQty(item.cartKey, 1)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </div>
                    </div>
                    <div className={`ci-pencil ${noted ? 'noted' : ''}`} onClick={() => setShowItemNoteKey(item.cartKey)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          {cart.length > 0 && (
            <div className="cart-tots" id="cart-tots">
              <div className="trow"><span>Subtotal</span><span id="t-sub">{formatRupiah(sub)}</span></div>
              {disc > 0 && <div className="trow disc" id="t-disc-row"><span>Diskon</span><span id="t-disc">- {formatRupiah(disc)}</span></div>}
              <div className="trow"><span>Pajak (11%)</span><span id="t-tax">{formatRupiah(tax)}</span></div>
              <div className="trow"><span>Service (5%)</span><span id="t-svc">{formatRupiah(svc)}</span></div>
              <div className="trow grand"><span>Total</span><span id="t-tot">{formatRupiah(grand)}</span></div>
            </div>
          )}

          {/* Buttons */}
          <div className="cart-btns">
            <button className="btn-pay" id="btn-pay" disabled={!cart.length} onClick={() => setShowPayModal(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
              {cart.length ? ` Bayar ${formatRupiah(grand)}` : ' Pilih menu terlebih dahulu'}
            </button>
            {cart.length > 0 && (
              <div className="sub-row" id="sub-row">
                <button className="sbtn" onClick={() => setDiscount(discount ? 0 : 5000)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="2" /><circle cx="15" cy="15" r="2" /><line x1="5" y1="19" x2="19" y2="5" /></svg>
                  Diskon
                </button>
                <button className="sbtn del" onClick={clearCart}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                  Hapus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
