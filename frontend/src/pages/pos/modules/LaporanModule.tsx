import React from 'react';
import { usePosStore } from '../store';
import { formatRupiah, formatRupiahShort } from '../mockData';

export function LaporanModule({ isActive }: { isActive: boolean }) {
  const { history, refunds, pettyCashStart, pettyCash } = usePosStore();

  const PMC: Record<string, string> = { 'Tunai': '#22C55E', 'QRIS': '#3B82F6', 'BCA': '#1E40AF', 'Debit': '#A855F7', 'GoFood': '#E3175B', 'GrabFood': '#00B14F', 'ShopeeFood': '#EE4D2D', 'Transfer': '#06B6D4' };
  const TYC: Record<string, string> = { 'dine': '#E4540C', 'take': '#3B82F6', 'gofood': '#E3175B', 'grabfood': '#00B14F', 'shopee': '#EE4D2D', 'GoFood': '#E3175B', 'GrabFood': '#00B14F', 'ShopeeFood': '#EE4D2D' };
  const TYL: Record<string, string> = { 'dine': 'Dine In', 'take': 'Take Away', 'gofood': 'GoFood', 'grabfood': 'GrabFood', 'shopee': 'ShopeeFood', 'GoFood': 'GoFood', 'GrabFood': 'GrabFood', 'ShopeeFood': 'ShopeeFood' };

  const done = history.filter(h => h.status === 'done');
  const voided = history.filter(h => h.status === 'voided');

  const gSales = done.reduce((s, h) => s + (h.sub || 0), 0);
  const tDisc = done.reduce((s, h) => s + (h.disc || 0), 0);
  const tRefund = refunds.reduce((s, r) => s + r.amt, 0);
  const netSales = gSales - tDisc - tRefund;

  const tTax = done.reduce((s, h) => s + (h.tax || 0), 0);
  const tSvc = done.reduce((s, h) => s + (h.svc || 0), 0);
  const tColl = done.reduce((s, h) => s + h.total, 0);

  const pM: Record<string, any> = {};
  done.forEach(h => {
    (h.items || []).forEach((it: any) => {
      if (!pM[it.n]) pM[it.n] = { name: it.n, qty: 0, rev: 0 };
      pM[it.n].qty += it.qty;
      pM[it.n].rev += it.p * it.qty;
    });
  });
  const prods = Object.values(pM).sort((a: any, b: any) => b.qty - a.qty);
  const tItems = prods.reduce((s, p) => s + p.qty, 0);
  const tPRev = prods.reduce((s, p) => s + p.rev, 0);

  const pmM: Record<string, any> = {};
  done.forEach(h => {
    if (!pmM[h.method]) pmM[h.method] = { label: h.method, count: 0, total: 0 };
    pmM[h.method].count++;
    pmM[h.method].total += h.total;
  });
  const pms = Object.values(pmM).sort((a: any, b: any) => b.total - a.total);
  const pmT = pms.reduce((s, p) => s + p.count, 0);

  const tyM: Record<string, any> = {};
  done.forEach(h => {
    const t = h.type || 'dine';
    if (!tyM[t]) tyM[t] = { type: t, count: 0, total: 0 };
    tyM[t].count++;
    tyM[t].total += h.total;
  });
  const types = Object.values(tyM).sort((a: any, b: any) => b.total - a.total);
  const tyT = types.reduce((s, t) => s + t.count, 0);

  const now = new Date();
  const dN = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const mN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const ds = `${dN[now.getDay()]}, ${now.getDate()} ${mN[now.getMonth()]} ${now.getFullYear()}`;



  const LapKpi = ({ lbl, val, sub, color }: any) => (
    <div className="lap-kpi" style={{ '--kc': color } as any}>
      <div className="lap-kpi-lbl">{lbl}</div>
      <div className="lap-kpi-val">{val}</div>
      <div className="lap-kpi-sub">{sub}</div>
    </div>
  );

  const LstRow = ({ lbl, val, isSub, bold, vc }: any) => (
    <div className={`lst-row ${isSub ? 'subtotal' : ''}`}>
      <span className={`lst-lbl ${bold ? 'b' : ''}`}>{lbl}</span>
      <span className={`lst-val ${bold ? 'b' : ''} ${vc || ''}`}>{val}</span>
    </div>
  );

  return (
    <div className={`mod ${isActive ? 'act' : ''}`} id="mod-laporan">
      <div className="lap-scroll">
        <div className="lap-bo-note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {ds} — Laporan hari ini. Riwayat lengkap tersedia di Backoffice.
        </div>
        <div className="lap-kpi-strip">
          <LapKpi lbl="Gross Sales" val={formatRupiahShort(gSales)} sub={`${done.length} transaksi selesai`} color="#E4540C" />
          <LapKpi lbl="Net Sales" val={formatRupiahShort(netSales)} sub="Setelah diskon & refund" color="#16A34A" />
          <LapKpi lbl="Total Transaksi" val={String(done.length + voided.length)} sub={`${done.length} selesai · ${voided.length} void`} color="#1D4ED8" />
          <LapKpi lbl="Total Refund" val={formatRupiahShort(tRefund)} sub={`${refunds.length} refund diproses`} color="#DC2626" />
        </div>

        <div>
          <div className="lap-section-lbl">Ringkasan Penjualan</div>
          <div className="lap-sum-table">
            <LstRow lbl="Gross Sales" val={formatRupiah(gSales)} />
            <LstRow lbl="Diskon" val={formatRupiah(tDisc)} isNeg />
            <LstRow lbl="Refund" val={formatRupiah(tRefund)} isNeg />
            <LstRow lbl="Net Sales" val={formatRupiah(netSales)} isSub bold />
            <LstRow lbl="Pajak (11%)" val={formatRupiah(tTax)} />
            <LstRow lbl="Service (5%)" val={formatRupiah(tSvc)} />
            <LstRow lbl="COGS" val="Rp 0" vc="dim" />
            <LstRow lbl="Total Collected" val={formatRupiah(tColl)} isSub bold vc="or" />
          </div>
        </div>

        <div>
          <div className="lap-section-lbl">Penjualan per Tipe Order</div>
          <div className="lap-data-table">
            <div className="ldt-head ldt-3"><span>Sales Type</span><span>Count</span><span>Total Collected</span></div>
            {types.length ? types.map((t: any) => (
              <div key={t.type} className="ldt-row ldt-3">
                <div className="ldt-cell" style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="type-dot" style={{ background: TYC[t.type] || '#E4540C' }} />
                  {TYL[t.type] || t.type}
                </div>
                <div className="ldt-cell">{t.count.toLocaleString('id-ID')}</div>
                <div className="ldt-cell b">{formatRupiah(t.total)}</div>
              </div>
            )) : <div className="ldt-row ldt-3"><div className="ldt-cell dim" style={{ gridColumn: '1/-1', textAlign: 'left', padding: '16px 0' }}>Belum ada transaksi hari ini</div></div>}
            <div className="ldt-row ldt-3 total-row"><div className="ldt-cell b">Total</div><div className="ldt-cell b">{tyT.toLocaleString('id-ID')}</div><div className="ldt-cell or">{formatRupiah(tColl)}</div></div>
          </div>
        </div>

        <div>
          <div className="lap-section-lbl">Penjualan per Metode Pembayaran</div>
          <div className="lap-data-table">
            <div className="ldt-head ldt-3"><span>Metode</span><span>Transaksi</span><span>Total</span></div>
            {pms.length ? pms.map((pm: any) => (
              <div key={pm.label} className="ldt-row ldt-3">
                <div className="ldt-cell" style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="type-dot" style={{ background: PMC[pm.label] || '#E4540C' }} />
                  {pm.label}
                </div>
                <div className="ldt-cell">{pm.count.toLocaleString('id-ID')}</div>
                <div className="ldt-cell b">{formatRupiah(pm.total)}</div>
              </div>
            )) : <div className="ldt-row ldt-3"><div className="ldt-cell dim" style={{ gridColumn: '1/-1', textAlign: 'left', padding: '16px 0' }}>Belum ada data</div></div>}
            <div className="ldt-row ldt-3 total-row"><div className="ldt-cell b">Total</div><div className="ldt-cell b">{pmT.toLocaleString('id-ID')}</div><div className="ldt-cell or">{formatRupiah(tColl)}</div></div>
          </div>
        </div>

        <div>
          <div className="lap-section-lbl">Produk Terjual</div>
          <div className="lap-data-table">
            <div className="ldt-head ldt-3"><span>Nama Menu</span><span>Qty Terjual</span><span>Revenue</span></div>
            {prods.length ? prods.map((p: any, i: number) => {
              const bg = i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7C3F' : 'rgba(0,0,0,.1)';
              const tc = i < 3 ? '#fff' : '#6B6560';
              return (
                <div key={p.name} className="ldt-row ldt-3">
                  <div className="ldt-cell" style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="rank-badge" style={{ background: bg, color: tc }}>{i + 1}</span>
                    {p.name}
                  </div>
                  <div className="ldt-cell">{p.qty.toLocaleString('id-ID')}</div>
                  <div className="ldt-cell b">{formatRupiah(p.rev)}</div>
                </div>
              );
            }) : <div className="ldt-row ldt-3"><div className="ldt-cell dim" style={{ gridColumn: '1/-1', textAlign: 'left', padding: '16px 0' }}>Belum ada transaksi</div></div>}
            <div className="ldt-row ldt-3 total-row"><div className="ldt-cell b">Total Semua Menu</div><div className="ldt-cell b">{tItems.toLocaleString('id-ID')}</div><div className="ldt-cell or">{formatRupiah(tPRev)}</div></div>
          </div>
        </div>

        <div>
          <div className="lap-section-lbl">Refund & Petty Cash</div>
          <div className="lap-sum-table">
            <LstRow lbl="Saldo Petty Cash Awal" val={formatRupiah(pettyCashStart)} />
            {refunds.length ? refunds.map((r: any) => (
              <LstRow key={r.no} lbl={`Refund — ${r.no} (${r.reason})`} val={formatRupiah(r.amt)} vc="rd" />
            )) : <LstRow lbl="Belum ada refund hari ini" val="Rp 0" vc="dim" />}
            <LstRow lbl="Saldo Petty Cash Akhir" val={formatRupiah(Math.max(0, pettyCash))} isSub bold />
            <LstRow lbl="Total Refund Hari Ini" val={formatRupiah(tRefund)} vc={tRefund > 0 ? 'rd' : ''} />
          </div>
        </div>
      </div>
    </div>
  );
}
