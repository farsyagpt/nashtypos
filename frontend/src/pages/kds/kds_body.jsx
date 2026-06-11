
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
    <div className="tb-btn" id="mode-btn" onclick="toggleMode()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      Day
    </div>
    <div className="tb-btn" onclick="addDemoOrder()">
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
  <button className="flt act" onclick="setFilter('all',this)">Semua</button>
  <button className="flt" onclick="setFilter('dine',this)">Dine In</button>
  <button className="flt" onclick="setFilter('take',this)">Take Away</button>
  <button className="flt" onclick="setFilter('delivery',this)">Delivery</button>
  <button className="flt danger" id="flt-urgent" onclick="setFilter('urgent',this)">⚠ Urgent</button>
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

<script>
// ═══════════════════════════════════════════════════════
// CONFIG (all configurable via Backoffice in production)
// ═══════════════════════════════════════════════════════
const CFG = {
  warnMin:    10,   // Warning threshold (minutes)
  urgentMin:  20,   // Urgent threshold (minutes)
  swipeEnabled: true,
  soundEnabled: true,
  highlightDuration: 3500,
  stickyUrgent: true,
  autoSort: true,
  compactThreshold: 12,
};

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════
const TYPE_LABEL = {dine:'Dine In',take:'Take Away',gofood:'GoFood',grabfood:'GrabFood',shopee:'ShopeeFood'};
const TYPE_CSS   = {dine:'dine',take:'take',gofood:'gof',grabfood:'grab',shopee:'sf'};
const NOW = Date.now();
const MIN = 60000;

// ═══════════════════════════════════════════════════════
// DEMO DATA
// ═══════════════════════════════════════════════════════
let ORDERS = [
  {
    id:1, no:'#0188', table:'T03', type:'dine', cashier:'Citra',
    startTs: NOW - 3*MIN - 20000, status:'active',
    items:[
      {n:'Nasi Goreng Spesial', qty:2, mods:['Pedas Sedang'], addons:[], note:''},
      {n:'Kopi Susu Aren',      qty:1, mods:['Dingin'],       addons:['+Oat Milk'], note:''},
    ]
  },
  {
    id:2, no:'#0189', table:'T07', type:'dine', cashier:'Budi',
    startTs: NOW - 12*MIN - 15000, status:'active',
    items:[
      {n:'Ayam Bakar Madu', qty:1, mods:['Pedas Extra'], addons:['+Extra Sambal','+Nasi Putih'], note:'Sambalnya pisah ya'},
      {n:'Rawon Spesial',   qty:2, mods:['Telur Asin'],  addons:[], note:''},
    ]
  },
  {
    id:3, no:'#0190', table:'TAKE', type:'take', cashier:'Ani',
    startTs: NOW - 23*MIN - 5000, status:'active',
    items:[
      {n:'Sate Ayam 10pcs', qty:1, mods:['Mix'],        addons:['+Extra Sate 5pcs','+Lontong'], note:''},
      {n:'Es Teh Manis',    qty:2, mods:['Kurang Manis'],addons:[], note:'Tanpa es untuk 1'},
      {n:'French Fries',    qty:1, mods:['Keju'],        addons:['+Cheese Dip'], note:''},
    ]
  },
  {
    id:4, no:'#0191', table:'GoFood', type:'gofood', cashier:'Citra',
    startTs: NOW - 7*MIN, status:'active',
    items:[
      {n:'Ayam Geprek',qty:2, mods:['Level 3'],addons:[], note:'Extra pedas beneran'},
      {n:'Nasi Putih', qty:2, mods:[],          addons:[], note:''},
      {n:'Lemon Tea',  qty:2, mods:[],          addons:[], note:''},
    ]
  },
  {
    id:5, no:'#0187', table:'T12', type:'dine', cashier:'Citra',
    startTs: NOW - 18*MIN, status:'active',
    items:[
      {n:'Sop Buntut',     qty:1, mods:[],      addons:['+Extra Kuah'], note:''},
      {n:'Es Krim Cokelat',qty:2, mods:['Oreo'],addons:['+Extra Scoop'], note:''},
    ]
  },
  {
    id:6, no:'#0186', table:'T01', type:'dine', cashier:'Budi',
    startTs: NOW - 28*MIN, status:'active',
    items:[
      {n:'Gado-Gado',  qty:1, mods:[], addons:[], note:'Tanpa kacang'},
      {n:'Jus Alpukat',qty:1, mods:['Large'], addons:[], note:''},
    ]
  },
];

let curFilter = 'all';
let pendingDoneId = null;
let demoCounter = 7;
let isDayMode = false;

// ═══════════════════════════════════════════════════════
// CLOCK
// ═══════════════════════════════════════════════════════
function pad(n){ return String(n).padStart(2,'0'); }
function tick(){
  const n = new Date();
  document.getElementById('kds-clock').textContent =
    pad(n.getHours())+':'+pad(n.getMinutes())+':'+pad(n.getSeconds());
}
setInterval(tick, 1000); tick();

// ═══════════════════════════════════════════════════════
// TIMER + URGENCY
// ═══════════════════════════════════════════════════════
function getElapsed(ts){ return Math.floor((Date.now()-ts)/1000); }
function fmtTimer(sec){
  const m = Math.floor(sec/60), s = sec%60;
  return pad(m)+':'+pad(s);
}
function urgClass(sec){
  if(sec >= CFG.urgentMin*60) return 'urgent';
  if(sec >= CFG.warnMin*60)   return 'warn';
  return 'fresh';
}

// ═══════════════════════════════════════════════════════
// FILTER + SORT
// ═══════════════════════════════════════════════════════
function setFilter(f, el){
  curFilter = f;
  document.querySelectorAll('.flt').forEach(b=>b.classList.remove('act'));
  el.classList.add('act');
  render();
}

function getFiltered(){
  let list = ORDERS.filter(o=>o.status==='active');
  if(curFilter==='dine')     list=list.filter(o=>o.type==='dine');
  else if(curFilter==='take')list=list.filter(o=>o.type==='take');
  else if(curFilter==='delivery') list=list.filter(o=>['gofood','grabfood','shopee'].includes(o.type));
  else if(curFilter==='urgent')   list=list.filter(o=>urgClass(getElapsed(o.startTs))==='urgent');

  // Auto-sort: Urgent → Warning → Fresh, then oldest first within each
  if(CFG.autoSort){
    const urgOrder = {urgent:0, warn:1, fresh:2};
    list.sort((a,b)=>{
      const ua = urgOrder[urgClass(getElapsed(a.startTs))];
      const ub = urgOrder[urgClass(getElapsed(b.startTs))];
      return ua !== ub ? ua-ub : a.startTs-b.startTs;
    });
  }
  return list;
}

// ═══════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════
function render(){
  const grid  = document.getElementById('kds-grid');
  const list  = getFiltered();
  const active= ORDERS.filter(o=>o.status==='active');

  // Queue summary
  const totalItems = active.reduce((s,o)=>s+o.items.reduce((si,i)=>si+i.qty,0),0);
  const urgCount   = active.filter(o=>urgClass(getElapsed(o.startTs))==='urgent').length;
  document.getElementById('qs-orders-n').textContent = active.length;
  document.getElementById('qs-items-n').textContent  = totalItems;
  document.getElementById('qs-urgent-n').textContent = urgCount;

  // Urgent strip
  const strip = document.getElementById('urgent-strip');
  const ustOrders = document.getElementById('ust-orders');
  if(CFG.stickyUrgent && urgCount > 0){
    strip.classList.add('visible');
    const urgList = active.filter(o=>urgClass(getElapsed(o.startTs))==='urgent');
    ustOrders.innerHTML = urgList.map(o=>
      `<div className="ust-no" onclick="scrollToCard(${o.id})">${o.no}</div>`
    ).join('');
  } else {
    strip.classList.remove('visible');
  }

  // Urgent filter badge
  const fltUrgent = document.getElementById('flt-urgent');
  fltUrgent.textContent = urgCount > 0 ? `⚠ Urgent (${urgCount})` : '⚠ Urgent';

  // Compact mode
  if(list.length >= CFG.compactThreshold) grid.classList.add('compact');
  else grid.classList.remove('compact');

  // Preserve scroll
  const scrollY = grid.scrollTop;

  if(list.length === 0){
    grid.innerHTML = `<div className="kds-empty">
      <div className="kds-empty-icon">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
      </div>
      <div className="kds-empty-t">Tidak ada pesanan aktif</div>
      <div className="kds-empty-s">Pesanan baru akan muncul di sini secara otomatis</div>
    </div>`;
    return;
  }

  grid.innerHTML = list.map(o => buildCard(o)).join('');
  grid.scrollTop = scrollY;

  // Re-attach swipe handlers
  list.forEach(o => attachSwipe(o.id));
}

// ═══════════════════════════════════════════════════════
// BUILD CARD
// ═══════════════════════════════════════════════════════
function buildCard(o){
  const sec     = getElapsed(o.startTs);
  const urg     = urgClass(sec);
  const isDone  = o.status === 'done';
  const typeCss = TYPE_CSS[o.type] || 'dine';
  const typeLabel = TYPE_LABEL[o.type] || o.type;

  const urgBadge = {
    fresh:  `<span className="oc-urgency urg-ok">On time</span>`,
    warn:   `<span className="oc-urgency urg-warn">&gt;${CFG.warnMin} mnt</span>`,
    urgent: `<span className="oc-urgency urg-urg">&gt;${CFG.urgentMin} mnt</span>`,
  }[urg];

  // Items HTML
  let itemsHtml = o.items.map(it=>{
    const modsHtml = it.mods.map(m=>`<span className="oc-mod">${m}</span>`).join('');
    const addonsHtml = it.addons.map(a=>`<span className="oc-mod addon">${a}</span>`).join('');
    const noteHtml = it.note
      ? `<div className="oc-note"><span className="oc-note-ico">⚠</span><span className="oc-note-txt">${it.note}</span></div>`
      : '';
    return `<div className="oc-item">
      <div className="oc-qty">${it.qty}</div>
      <div className="oc-item-info">
        <div className="oc-item-name">${it.n}</div>
        ${(modsHtml||addonsHtml) ? `<div className="oc-mods">${modsHtml}${addonsHtml}</div>` : ''}
        ${noteHtml}
      </div>
    </div>`;
  }).join('');

  // Swipe button
  const swipeHtml = `<div className="swipe-wrap">
    <div className="oc-cashier">Kasir: ${o.cashier}</div>
    <div className="swipe-track" id="swipe-${o.id}">
      <div className="swipe-fill" id="swipefill-${o.id}"></div>
      <div className="swipe-thumb" id="swipethumb-${o.id}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  </div>`;

  const cardClass = ['ocard', isDone?'done':urg].filter(Boolean).join(' ');

  return `<div className="${cardClass}" id="ocard-${o.id}">
    <div className="oc-head">
      <div className="oc-head-left">
        <div className="oc-no">${o.no}</div>
        <div className="oc-meta">
          <span className="oc-table">${o.table}</span>
          <span className="oc-type type-${typeCss}">${typeLabel}</span>
        </div>
      </div>
      <div className="oc-head-right">
        <div className="oc-timer ${isDone?'fresh':urg}" id="timer-${o.id}">${fmtTimer(sec)}</div>
        <div className="oc-timer-lbl">menit:detik</div>
        ${urgBadge}
      </div>
    </div>
    <div className="oc-items">${itemsHtml}</div>
    ${swipeHtml}
  </div>`;
}

// ═══════════════════════════════════════════════════════
// SWIPE TO COMPLETE
// ═══════════════════════════════════════════════════════
function attachSwipe(orderId){
  const track = document.getElementById(`swipe-${orderId}`);
  const thumb = document.getElementById(`swipethumb-${orderId}`);
  const fill  = document.getElementById(`swipefill-${orderId}`);
  if(!track || !thumb) return;

  const order = ORDERS.find(o=>o.id===orderId);
  if(!order || order.status==='done') return;

  let dragging = false, startX = 0, curX = 0;
  const trackW = 160;
  const thumbW = 30;
  const maxLeft = trackW - thumbW - 6;

  function startDrag(x){
    dragging = true;
    startX = x;
    curX = parseInt(thumb.style.left||'3');
    track.classList.add('swiping');
    thumb.style.transition = 'none';
    fill.style.transition   = 'none';
  }
  function moveDrag(x){
    if(!dragging) return;
    const dx   = x - startX;
    const newL = Math.max(3, Math.min(maxLeft, curX + dx));
    thumb.style.left = newL + 'px';
    const pct = (newL - 3) / (maxLeft - 3);
    fill.style.width = (newL + thumbW) + 'px';
    if(pct >= 1) endDrag(true);
  }
  function endDrag(complete){
    if(!dragging) return;
    dragging = false;
    track.classList.remove('swiping');
    thumb.style.transition = '';
    fill.style.transition  = '';
    if(complete){
      thumb.style.left  = maxLeft + 'px';
      fill.style.width  = '100%';
      markDone(orderId);
    } else {
      thumb.style.left = '3px';
      fill.style.width = '0';
    }
  }

  // Touch
  track.addEventListener('touchstart', e=>{ startDrag(e.touches[0].clientX); e.preventDefault(); }, {passive:false});
  track.addEventListener('touchmove',  e=>{ moveDrag(e.touches[0].clientX); e.preventDefault(); },  {passive:false});
  track.addEventListener('touchend',   ()=>{ endDrag(false); });

  // Mouse
  track.addEventListener('mousedown',  e=>startDrag(e.clientX));
  document.addEventListener('mousemove', e=>{ if(dragging) moveDrag(e.clientX); });
  document.addEventListener('mouseup',   e=>{ if(dragging) endDrag(false); });

  // Click shortcut (for demo)
  track.addEventListener('click', ()=>{
    if(CFG.swipeEnabled) return; // swipe only
    markDone(orderId);
  });
}

// ═══════════════════════════════════════════════════════
// MARK DONE → Show POS notification (cannot close until confirmed)
// ═══════════════════════════════════════════════════════
function markDone(orderId){
  const o = ORDERS.find(x=>x.id===orderId);
  if(!o || o.status!=='active') return;
  o.status = 'done';
  pendingDoneId = orderId;
  showPosNotify(o);
  render();
}

function showPosNotify(o){
  document.getElementById('pn-order-no').textContent = o.no;
  document.getElementById('pn-sub').textContent = `${o.table} · ${TYPE_LABEL[o.type]||o.type} · Kasir: ${o.cashier}`;
  
  let itemsText = '';
  o.items.forEach(it=>{
    itemsText += `${it.qty}× ${it.n}`;
    const allMods = [...it.mods, ...it.addons];
    if(allMods.length) itemsText += ' (' + allMods.join(', ') + ')';
    if(it.note) itemsText += '\n   ⚠ ' + it.note;
    itemsText += '\n';
  });
  document.getElementById('pn-items').textContent = itemsText.trim();

  const overlay = document.getElementById('pos-notify');
  overlay.classList.add('visible');

  document.getElementById('pn-confirm-btn').onclick = confirmDone;

  // Prevent closing by clicking outside
  overlay.onclick = (e)=>{ if(e.target===overlay){ /* blocked */ } };
}

function confirmDone(){
  if(pendingDoneId === null) return;
  const o = ORDERS.find(x=>x.id===pendingDoneId);
  if(o) o.status = 'confirmed';
  pendingDoneId = null;
  document.getElementById('pos-notify').classList.remove('visible');
  render();
}

// ═══════════════════════════════════════════════════════
// LIVE TIMER UPDATE (every second)
// ═══════════════════════════════════════════════════════
function updateTimers(){
  ORDERS.forEach(o=>{
    if(o.status!=='active') return;
    const sec = getElapsed(o.startTs);
    const urg = urgClass(sec);

    const timerEl = document.getElementById('timer-'+o.id);
    if(timerEl){
      timerEl.textContent = fmtTimer(sec);
      timerEl.className = 'oc-timer ' + urg;
    }

    const card = document.getElementById('ocard-'+o.id);
    if(card){
      const wasWarn   = card.classList.contains('warn');
      const wasUrgent = card.classList.contains('urgent');
      if((urg==='warn'&&!wasWarn)||(urg==='urgent'&&!wasUrgent)){
        card.classList.remove('fresh','warn','urgent');
        card.classList.add(urg);
        if(urg==='urgent' && CFG.soundEnabled) playSound('urgent');
      }
    }
  });

  // Update queue summary counts
  const active = ORDERS.filter(o=>o.status==='active');
  const totalItems = active.reduce((s,o)=>s+o.items.reduce((si,i)=>si+i.qty,0),0);
  const urgCount   = active.filter(o=>urgClass(getElapsed(o.startTs))==='urgent').length;
  const el_o = document.getElementById('qs-orders-n');
  const el_i = document.getElementById('qs-items-n');
  const el_u = document.getElementById('qs-urgent-n');
  if(el_o) el_o.textContent = active.length;
  if(el_i) el_i.textContent = totalItems;
  if(el_u) el_u.textContent = urgCount;

  // Update urgent strip
  const strip = document.getElementById('urgent-strip');
  const ustOrders = document.getElementById('ust-orders');
  if(CFG.stickyUrgent && urgCount > 0){
    strip.classList.add('visible');
    const urgList = active.filter(o=>urgClass(getElapsed(o.startTs))==='urgent');
    const expected = urgList.map(o=>o.no).join(',');
    if(ustOrders.dataset.last !== expected){
      ustOrders.dataset.last = expected;
      ustOrders.innerHTML = urgList.map(o=>
        `<div className="ust-no" onclick="scrollToCard(${o.id})">${o.no}</div>`
      ).join('');
    }
  } else {
    strip.classList.remove('visible');
  }

  const fltU = document.getElementById('flt-urgent');
  if(fltU) fltU.textContent = urgCount>0?`⚠ Urgent (${urgCount})`:'⚠ Urgent';
}

setInterval(updateTimers, 1000);

// ═══════════════════════════════════════════════════════
// SCROLL TO CARD (from urgent strip)
// ═══════════════════════════════════════════════════════
function scrollToCard(id){
  const el = document.getElementById('ocard-'+id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'center'});
}

// ═══════════════════════════════════════════════════════
// SOUND (Web Audio API)
// ═══════════════════════════════════════════════════════
let audioCtx = null;
function ensureAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
}
function playTone(freq, dur, vol=0.3, when=0){
  try {
    ensureAudio();
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    const t = audioCtx.currentTime + when;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t+dur);
    osc.start(t); osc.stop(t+dur);
  } catch(e){}
}
function playSound(type){
  if(!CFG.soundEnabled) return;
  if(type==='new')    { playTone(880, 0.18, 0.25); }
  if(type==='urgent') { playTone(660, 0.12, 0.3, 0); playTone(880, 0.12, 0.3, 0.18); }
}

// ═══════════════════════════════════════════════════════
// ADD DEMO ORDER
// ═══════════════════════════════════════════════════════
const DEMO_ORDERS = [
  {table:'T05', type:'dine', cashier:'Ani',   items:[{n:'Pecel Lele',qty:1,mods:[],addons:[],note:''},{n:'Es Teh Manis',qty:1,mods:['Normal'],addons:[],note:''}]},
  {table:'GrabFood',type:'grabfood',cashier:'Budi',items:[{n:'Ayam Bakar Madu',qty:2,mods:['Original'],addons:['+Extra Sambal'],note:''},{n:'Nasi Putih',qty:2,mods:[],addons:[],note:''}]},
  {table:'T11', type:'dine', cashier:'Citra', items:[{n:'Kopi Susu Aren',qty:3,mods:['Dingin'],addons:['+Extra Shot'],note:'Semua jangan terlalu manis'},{n:'French Fries',qty:1,mods:['Tomat','Mayo'],addons:[],note:''}]},
  {table:'T09', type:'dine', cashier:'Budi',  items:[{n:'Sop Buntut',qty:1,mods:[],addons:['+Extra Kuah'],note:'Kuahnya banyakin'},{n:'Rawon Spesial',qty:1,mods:[],addons:[],note:''}]},
  {table:'ShopeeFood',type:'shopee',cashier:'Ani',items:[{n:'Ayam Geprek',qty:3,mods:['Level 2'],addons:[],note:'Minta nasi pisah'},{n:'Lemon Tea',qty:3,mods:[],addons:[],note:''}]},
];

function addDemoOrder(){
  const d = DEMO_ORDERS[demoCounter % DEMO_ORDERS.length];
  const id = ++demoCounter + 100;
  const no = '#' + String(188 + demoCounter).padStart(4,'0');
  const order = {
    id, no,
    table:   d.table,
    type:    d.type,
    cashier: d.cashier,
    startTs: Date.now(),
    status: 'active',
    items:   d.items,
  };
  ORDERS.unshift(order);
  render();
  playSound('new');

  // Highlight new card for 3.5s
  setTimeout(()=>{
    const card = document.getElementById('ocard-'+id);
    if(card) card.classList.add('new-highlight');
  }, 50);
  setTimeout(()=>{
    const card = document.getElementById('ocard-'+id);
    if(card) card.classList.remove('new-highlight');
  }, CFG.highlightDuration + 50);
}

// ═══════════════════════════════════════════════════════
// DAY/DARK MODE
// ═══════════════════════════════════════════════════════
function toggleMode(){
  isDayMode = !isDayMode;
  document.body.classList.toggle('day', isDayMode);
  const btn = document.getElementById('mode-btn');
  if(isDayMode){
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Dark`;
    btn.classList.add('act');
  } else {
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Day`;
    btn.classList.remove('act');
  }
}

// ═══════════════════════════════════════════════════════
// AUTO-ADD demo orders for realism
// ═══════════════════════════════════════════════════════
setTimeout(()=>addDemoOrder(), 8000);
setTimeout(()=>addDemoOrder(), 16000);

// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════
render();
</script>
