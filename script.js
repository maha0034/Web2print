/* ==========================================================
   Web2print – SGL Internal Shop
   Shared data, header/footer, cart (localStorage) and the
   page logic for each screen. Pages set <body data-page="…">.
   ========================================================== */

/* ---------- Data ---------- */
const CATEGORIES = [
  { slug: 'giveaways',   name: 'Giveaways',                      bg: '#eef0c8', img: 'assets/images/cat-giveaways.jpg' },
  { slug: 'office-deco', name: 'Office deco',                    bg: '#d9d9d9', img: 'assets/images/cat-office-deco.jpg' },
  { slug: 'printing',    name: 'On-demand printing materials',   bg: '#c9d6e3', img: 'assets/images/cat-printing.jpg' },
  { slug: 'christmas',   name: 'Christmas gifts 2026',           bg: '#e8b8b8', img: 'assets/images/cat-christmas.jpg' },
];

const CHOC_DESC = 'Anthon Berg Mixed Chocolate Selection is a premium assortment that brings together some of the finest chocolates from Anthon Berg\u2019s range. It includes filled chocolates, chocolate-covered marzipan, and assorted chocolate pieces, making it perfect for sharing, gifting, or enjoying at the office. This carefully curated mix of high-quality chocolates is an easy way to delight employees, customers, or friends, while the practical container helps keep the chocolates fresh. An ideal choice for any occasion where luxury chocolate and a variety of flavors are appreciated.';
const GENERIC_DESC = 'A Scan Global Logistics branded item, available to order through the internal shop. Ideal for events, customer gifts and everyday office use. Contact Marcom if you need a custom quantity or a different design.';

// type = which illustration to draw (see art())
const PRODUCTS = [
  // Giveaways
  { id: 'tote-black',   name: 'Tote bag',                 price: 19,     cat: 'giveaways',   type: 'tote', keywords: 'bag totebag taske pose indkoebspose' },
  { id: 'thermo-cup',   name: 'Thermo cup',               price: 89,     cat: 'giveaways',   type: 'thermo', keywords: 'thermos termokop termo kop cup travel mug',
    desc: 'Insulated stainless steel thermo cup with a black grip and lid, printed with the Scan Global Logistics logo. Keeps drinks hot or cold on the road and fits most cup holders. A practical giveaway for colleagues, drivers and customers.' },
  { id: 'tote-slim',    name: 'Tote bag, slim',           price: 19,     cat: 'giveaways',   type: 'tote' },
  { id: 'mug',          name: 'SGL coffee mug',           price: 35,     cat: 'giveaways',   type: 'mug' },
  { id: 'notebook',     name: 'A5 notebook',              price: 29,     cat: 'giveaways',   type: 'notebook' },
  { id: 'pen-set',      name: 'Pen set',                  price: 15,     cat: 'giveaways',   type: 'notebook' },
  { id: 'tote-large',   name: 'Tote bag, large',          price: 24,     cat: 'giveaways',   type: 'tote' },
  // Office deco
  { id: 'dna-folder',   name: 'DNA Folder Strategic Narrative', price: 10, cat: 'office-deco', type: 'folder' },
  { id: 'dna-folder-2', name: 'DNA Folder Strategic Narrative, 10 pack', price: 85, cat: 'office-deco', type: 'folder' },
  { id: 'desk-mug',     name: 'Desk mug',                 price: 35,     cat: 'office-deco', type: 'mug' },
  { id: 'desk-notes',   name: 'Desk notebook',            price: 32,     cat: 'office-deco', type: 'notebook' },
  { id: 'annual-report',name: 'Annual report folder',     price: 12,     cat: 'office-deco', type: 'folder' },
  { id: 'poster-set',   name: 'Poster set',               price: 48,     cat: 'office-deco', type: 'folder' },
  // On-demand printing
  { id: 'business-card',name: 'Business card',            price: 9,      cat: 'printing',    type: 'card' },
  { id: 'letterhead',   name: 'Letterhead',               price: 9,      cat: 'printing',    type: 'card' },
  { id: 'envelope',     name: 'Envelope, C5',             price: 6,      cat: 'printing',    type: 'card' },
  { id: 'brochure',     name: 'Company brochure',         price: 14,     cat: 'printing',    type: 'folder', keywords: 'brochure firmabrochure folder katalog' },
  { id: 'compliment',   name: 'Compliment slip',          price: 7,      cat: 'printing',    type: 'card' },
  { id: 'sticker-sheet',name: 'Sticker sheet',            price: 11,     cat: 'printing',    type: 'card' },
  // Christmas gifts 2026
  { id: 'choc-truck',   name: 'ScanGL truck filled with 750g Anthon Berg chocolates', price: 208.8, cat: 'christmas', type: 'truck', desc: CHOC_DESC },
  { id: 'choc-truck-s', name: 'ScanGL truck filled with 400g Anthon Berg chocolates', price: 129.5, cat: 'christmas', type: 'truck', desc: CHOC_DESC },
  { id: 'gift-box',     name: 'Christmas gift box',       price: 149,    cat: 'christmas',   type: 'box' },
  { id: 'gift-box-s',   name: 'Christmas gift box, small',price: 89,     cat: 'christmas',   type: 'box' },
  { id: 'choc-truck-xl',name: 'ScanGL truck filled with 1.2kg Anthon Berg chocolates', price: 289, cat: 'christmas', type: 'truck', desc: CHOC_DESC },
  { id: 'candle',       name: 'Advent candle set',        price: 79,     cat: 'christmas',   type: 'box' },
];

// Real photos per product type: `img` = cut-out shown on the card, `hover` = lifestyle photo shown on hover.
// Types without an entry fall back to the drawn placeholder in art().
const PHOTOS = {
  tote:   { img: 'assets/images/tote.png',   hover: 'assets/images/tote-hover.jpg' },
  folder: { img: 'assets/images/folder.png', hover: 'assets/images/folder-hover.jpg' },
  card:   { img: 'assets/images/card.png',   hover: 'assets/images/card-hover.jpg' },
  truck:  { img: 'assets/images/truck.png',  hover: 'assets/images/truck-hover.jpg' },
  thermo: { img: 'assets/images/thermo.png', hover: 'assets/images/thermo-hover.jpg' },
  // Illustrated (not photographed) – replace with real photos when available
  mug:      { img: 'assets/images/mug.svg',      hover: 'assets/images/mug-hover.svg' },
  notebook: { img: 'assets/images/notebook.svg', hover: 'assets/images/notebook-hover.svg' },
  box:      { img: 'assets/images/box.svg',      hover: 'assets/images/box-hover.svg' },
};

const FAVORITES = ['choc-truck', 'business-card', 'dna-folder', 'tote-black'];
const VAT_RATE = 0.25;

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const getCat = slug => CATEGORIES.find(c => c.slug === slug);
const getProduct = id => PRODUCTS.find(p => p.id === id);
const fmt = n => (Number.isInteger(n) ? n : n.toFixed(2)) + 'kr';
const params = new URLSearchParams(location.search);

const ICON = {
  search: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4.5"/><path d="M3 22c0-5 4-8 9-8s9 3 9 8z"/></svg>',
  cart: '<svg viewBox="0 0 24 24"><path d="M1 2h4l1 3h16l-3 9H8L5 4 4 4zM9 18a2 2 0 100 4 2 2 0 000-4zm9 0a2 2 0 100 4 2 2 0 000-4z"/></svg>',
  left: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  right: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
};

/* ---------- Product illustrations (placeholders – swap for real images) ---------- */
function art(type, variant = 0) {
  const r = variant ? 'transform="rotate(-6 100 100)"' : '';
  const shapes = {
    tote: `<g ${r}><path d="M70 70c0-30 60-30 60 0" fill="none" stroke="#111" stroke-width="6"/><path d="M52 70h96l8 112H44z" fill="#161616"/><rect x="76" y="110" width="48" height="5" fill="#c8232c"/><rect x="82" y="120" width="36" height="4" fill="#ddd"/></g>`,
    mug: `<g ${r}><path d="M150 80c28 0 28 50-8 52" fill="none" stroke="#fff" stroke-width="12"/><rect x="50" y="62" width="100" height="100" rx="8" fill="#fff"/><rect x="50" y="90" width="100" height="14" fill="#c8232c"/><rect x="62" y="112" width="70" height="5" fill="#777"/></g>`,
    notebook: `<g ${r}><rect x="60" y="34" width="86" height="132" rx="5" fill="#2b2b2b"/><rect x="60" y="34" width="12" height="132" fill="#c8232c"/><rect x="88" y="62" width="42" height="5" fill="#ddd"/><rect x="88" y="73" width="30" height="4" fill="#999"/></g>`,
    card: `<g ${r}><rect x="40" y="70" width="110" height="68" fill="#fff" transform="rotate(-14 95 104)"/><rect x="62" y="82" width="110" height="68" fill="#fff" stroke="#e5e5e5"/><path d="M62 82h46l-30 68H62z" fill="#c8232c"/><rect x="118" y="100" width="40" height="4" fill="#aaa"/><rect x="118" y="110" width="30" height="4" fill="#ccc"/></g>`,
    folder: `<g ${r}><rect x="46" y="46" width="108" height="108" fill="#fff" transform="rotate(-18 100 100)"/><rect x="54" y="54" width="92" height="92" fill="#c0702a" transform="rotate(-18 100 100)"/><path d="M54 120l92-30v56H54z" fill="#8c3d1a" transform="rotate(-18 100 100)"/><rect x="62" y="132" width="40" height="5" fill="#fff" transform="rotate(-18 100 100)"/></g>`,
    truck: `<g ${r}><rect x="16" y="66" width="134" height="52" fill="#fff" stroke="#ddd"/><path d="M60 66l22 0-22 52H38z M92 66h22l-22 52H70z" fill="#c8232c"/><path d="M150 82h22l12 16v20h-34z" fill="#c8232c"/><circle cx="40" cy="122" r="9" fill="#222"/><circle cx="76" cy="122" r="9" fill="#222"/><circle cx="162" cy="122" r="9" fill="#222"/><g><circle cx="60" cy="142" r="7" fill="#7a3a8c"/><circle cx="76" cy="146" r="7" fill="#c8232c"/><circle cx="92" cy="141" r="7" fill="#e8a72a"/><circle cx="108" cy="146" r="7" fill="#3c6ea5"/><circle cx="124" cy="141" r="7" fill="#7a3a8c"/><circle cx="68" cy="152" r="7" fill="#e8a72a"/><circle cx="100" cy="153" r="7" fill="#c8232c"/></g></g>`,
    box: `<g ${r}><rect x="46" y="76" width="108" height="84" fill="#c8232c"/><rect x="40" y="62" width="120" height="22" fill="#9f1a22"/><rect x="94" y="62" width="12" height="98" fill="#fff"/><path d="M100 62c-24-26-40-4-14 0zM100 62c24-26 40-4 14 0z" fill="none" stroke="#fff" stroke-width="5"/></g>`,
  };
  return `<svg viewBox="0 0 200 200" role="img" aria-hidden="true">${shapes[type] || shapes.box}</svg>`;
}

/* ---------- Cart (localStorage) ---------- */
const Cart = {
  key: 'sgl_cart',
  read() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; } },
  write(items) { try { localStorage.setItem(this.key, JSON.stringify(items)); } catch {} updateBadge(); },
  add(id, qty = 1) {
    const items = this.read();
    const found = items.find(i => i.id === id);
    found ? (found.qty += qty) : items.push({ id, qty });
    this.write(items);
  },
  setQty(id, qty) {
    let items = this.read();
    items = qty < 1 ? items.filter(i => i.id !== id) : items.map(i => i.id === id ? { ...i, qty } : i);
    this.write(items);
  },
  remove(id) { this.write(this.read().filter(i => i.id !== id)); },
  clear() { this.write([]); },
  lines() { return this.read().map(i => ({ ...i, product: getProduct(i.id) })).filter(l => l.product); },
  count() { return this.read().reduce((n, i) => n + i.qty, 0); },
  subtotal() { return this.lines().reduce((s, l) => s + l.product.price * l.qty, 0); },
};

function updateBadge() {
  const badge = $('.cart-badge');
  if (!badge) return;
  const n = Cart.count();
  badge.textContent = n;
  badge.classList.toggle('show', n > 0);
}

/* ---------- Shared layout ---------- */
function renderHeader() {
  const el = $('#site-header');
  if (!el) return;
  el.outerHTML = `
    <header class="site-header">
      <a class="logo" href="home.html"><img src="assets/images/logo.svg" alt="Scan Global Logistics – home"></a>
      <div class="header-right">
        <form class="search" role="search" action="search.html" autocomplete="off">
          <input type="search" name="q" placeholder="search..." aria-label="Search" value="${(location.pathname.endsWith('search.html') ? params.get('q') || '' : '').replace(/"/g, '&quot;')}">
          <button type="submit" aria-label="Search">${ICON.search}</button>
          <div class="suggest" hidden></div>
        </form>
        <a class="icon-link" href="index.html" aria-label="Account">${ICON.user}</a>
        <a class="icon-link" href="cart.html" aria-label="My bag">${ICON.cart}<span class="cart-badge"></span></a>
      </div>
    </header>`;
  updateBadge();
  initSearch();
}

function renderFooter() {
  const el = $('#site-footer');
  if (!el) return;
  el.outerHTML = `
    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-brand">
          <img src="assets/images/logo.svg" alt="Scan Global Logistics">
          <div class="marcom">MARCOM</div>
          <address>Scan Global Logistics A/S<br>CVR 14049673<br>Kirstinehoej 7<br>DK-2770 Kastrup<br>Denmark<br><br>Tel +45 32 48 00 00<br>Fax +45 32 48 01 01<br>headoffice@scangl.com</address>
        </div>
        <div class="footer-cols">
          <div class="footer-col"><h4>LOCATIONS</h4><p>We have local offices worldwide. Find your local office here:</p>
            <a href="#">Asia Pacific</a><a href="#">Europa</a><a href="#">Africa</a><a href="#">Americas</a></div>
          <div class="footer-col"><h4>SERVICES</h4><p>Scan Global covers all of your logistical needs.</p>
            <a href="#">Air</a><a href="#">Ocean</a><a href="#">Road</a><a href="#">Other services</a></div>
          <div class="footer-col"><h4>CAREER</h4><p>Grow your career at Scan Global - We are hiring.</p>
            <a href="#">Jobs</a></div>
        </div>
      </div>
      <div class="footer-bottom">
        <span><a href="#">Disclaimer</a> / <a href="#">Privacy notice</a> / <a href="#">Inspection reports</a></span>
        <span class="linkedin">Linked<b style="background:#fff;color:#2e2e2e;border-radius:2px;padding:0 2px;margin-left:1px">in</b></span>
      </div>
    </footer>`;
}

/* ---------- Search ---------- */
function searchProducts(q) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return PRODUCTS.filter(p => {
    const hay = `${p.name} ${getCat(p.cat).name} ${p.keywords || ''}`.toLowerCase();
    return terms.every(t => hay.includes(t));
  });
}

function initSearch() {
  const form = $('.search');
  if (!form) return;
  const input = $('input', form), box = $('.suggest', form);
  const close = () => { box.hidden = true; };
  const open = () => {
    const q = input.value.trim();
    if (!q) return close();
    const hits = searchProducts(q);
    box.innerHTML = hits.length
      ? hits.slice(0, 5).map(p => {
          const c = getCat(p.cat), ph = PHOTOS[p.type];
          return `<a href="product.html?id=${p.id}"><span class="s-thumb" style="background:${c.bg}">${ph ? `<img src="${ph.img}" alt="">` : ''}</span>
            <span class="s-text"><strong>${p.name}</strong><small>${c.name}</small></span><span class="s-price">${fmt(p.price)}</span></a>`;
        }).join('') + (hits.length > 5 ? `<a class="s-all" href="search.html?q=${encodeURIComponent(q)}">See all ${hits.length} results</a>` : '')
      : '<p class="s-none">No products found</p>';
    box.hidden = false;
  };
  input.addEventListener('input', open);
  input.addEventListener('focus', open);
  input.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.addEventListener('click', e => { if (!form.contains(e.target)) close(); });
  form.addEventListener('submit', e => { if (!input.value.trim()) e.preventDefault(); });
}

/* ---------- Reusable pieces ---------- */
function card(p) {
  const c = getCat(p.cat);
  return `<a class="card" href="product.html?id=${p.id}">
    <div class="card-img" style="background:${c.bg}">${PHOTOS[p.type]
      ? `<img class="img-main" src="${PHOTOS[p.type].img}" alt="${p.name}"><img class="img-hover" src="${PHOTOS[p.type].hover}" alt="" loading="lazy">`
      : art(p.type)}</div>
    <div class="card-body"><strong class="price">${fmt(p.price)}</strong><span class="name">${p.name}</span><span class="cat">${c.name}</span></div>
  </a>`;
}
const heading = text => `<h2 class="heading">${text}</h2>`;

/* Generic "N cards visible, arrows slide by one" carousel */
function initRowCarousel(root) {
  const track = $('.row-track', root);
  const prev = $('.prev', root), next = $('.next', root);
  let index = 0;
  const per = () => parseInt(getComputedStyle(track).getPropertyValue('--per')) || 4;
  const max = () => Math.max(0, track.children.length - per());
  const go = i => {
    index = i;
    track.style.transform = `translateX(${-index * (100 / per())}%)`;
  };
  prev.addEventListener('click', () => go(index <= 0 ? max() : index - 1));
  next.addEventListener('click', () => go(index >= max() ? 0 : index + 1));
  window.addEventListener('resize', () => go(Math.min(index, max())));
}

function rowCarouselHTML(cards) {
  return `<div class="row-viewport"><div class="row-track">${cards}</div></div>
    <div class="row-controls">
      <button class="arrow-btn dark prev" aria-label="Previous">${ICON.left}</button>
      <button class="arrow-btn next" aria-label="Next">${ICON.right}</button>
    </div>`;
}

function lineItemHTML(l, { editable = true } = {}) {
  const p = l.product, c = getCat(p.cat);
  return `<div class="line-item" data-id="${p.id}">
    <div class="thumb" style="background:${c.bg}">${PHOTOS[p.type] ? `<img src="${PHOTOS[p.type].img}" alt="">` : art(p.type)}</div>
    <div class="meta">
      <a href="product.html?id=${p.id}">${p.name}</a>
      <span class="cat">${c.name}</span>
      ${editable
        ? `<span class="mini-step"><button data-act="dec" aria-label="Decrease quantity">&minus;</button>${l.qty}<button data-act="inc" aria-label="Increase quantity">+</button></span>`
        : `<span class="mini-step">Qty ${l.qty}</span>`}
    </div>
    <div class="line-price">${fmt(p.price * l.qty)}</div>
    ${editable ? `<button class="remove" data-act="remove" aria-label="Remove ${p.name}">&times;</button>` : ''}
  </div>`;
}

/* ---------- Pages ---------- */
const pages = {
  /* Login */
  login() {
    $('#login-form').addEventListener('submit', e => {
      e.preventDefault();               // No real auth – just move on to the shop
      location.href = 'home.html';
    });
  },

  /* Home */
  home() {
    $('#app').innerHTML = `
      <section class="hero">
        <h1>SGL Internal Shop</h1>
        <p>Everything you need, all in one place</p>
        <a class="btn btn-red" href="shop.html">Browse products</a>
      </section>
      <section class="section">
        <div class="wrap">${heading('Browse by category:')}</div>
        <div class="cat-carousel" aria-roledescription="carousel" aria-label="Product categories">
          <div class="cat-track">
            ${CATEGORIES.map(c => `<a class="cat-slide" href="category.html?cat=${c.slug}"
              style="--bg:${c.bg}; background-image:url('${c.img}'), linear-gradient(135deg,#2a2a2a,#555); background-size:cover; background-position:center;"><span>${c.name}</span></a>`).join('')}
          </div>
          <button class="arrow-btn cat-arrow prev" aria-label="Previous category">${ICON.left}</button>
          <button class="arrow-btn cat-arrow next" aria-label="Next category">${ICON.right}</button>
          <div class="dots">${CATEGORIES.map((c, i) => `<button aria-label="Show ${c.name}" data-i="${i}"></button>`).join('')}</div>
        </div>
      </section>
      <section class="section wrap">
        ${heading('Se vores favoritter:')}
        <div class="grid-4">${FAVORITES.map(id => card(getProduct(id))).join('')}</div>
      </section>`;
    initCategoryCarousel($('.cat-carousel'));
  },

  /* Shop by category */
  shop() {
    $('#app').innerHTML = `
      <div class="wrap section">
        ${heading('Shop by category:')}
        <div class="cat-tiles">
          ${CATEGORIES.map(c => `<a class="cat-tile" href="category.html?cat=${c.slug}">
            <div class="thumb" style="background-image:url('${c.img}')"></div><strong>${c.name}</strong></a>`).join('')}
        </div>
        ${CATEGORIES.map(c => `
          <section class="row-section" id="${c.slug}">
            ${heading(c.name)}
            <div class="row-carousel">${rowCarouselHTML(PRODUCTS.filter(p => p.cat === c.slug).map(card).join(''))}</div>
          </section>`).join('')}
      </div>`;
    $$('.row-carousel').forEach(initRowCarousel);
  },

  /* Search results */
  search() {
    const q = (params.get('q') || '').trim();
    const hits = searchProducts(q);
    const safe = q.replace(/</g, '&lt;');
    $('#app').innerHTML = `
      <div class="wrap all-products">
        ${heading(q ? `Results for \u201c${safe}\u201d` : 'Search')}
        ${hits.length
          ? `<p class="result-count">${hits.length} product${hits.length > 1 ? 's' : ''} found</p><div class="grid-4">${hits.map(card).join('')}</div>`
          : `<div class="empty">${q ? 'No products match your search.' : 'Type something in the search box.'}<br><a class="btn btn-red" href="shop.html">Browse all products</a></div>`}
      </div>`;
    document.title = `Search – SGL Internal Shop`;
  },

  /* Category page */
  category() {
    const cat = getCat(params.get('cat'));
    const list = cat ? PRODUCTS.filter(p => p.cat === cat.slug) : PRODUCTS;
    $('#app').innerHTML = `
      <section class="hero hero-short"><h1>${cat ? cat.name : 'All categories'}</h1></section>
      <div class="wrap all-products">
        ${heading('All products')}
        <div class="grid-4">${list.map(card).join('')}</div>
      </div>`;
    document.title = `${cat ? cat.name : 'All products'} – SGL Internal Shop`;
  },

  /* Product page */
  product() {
    const p = getProduct(params.get('id')) || PRODUCTS.find(x => x.id === 'choc-truck');
    const c = getCat(p.cat);
    const ph = PHOTOS[p.type];
    const slides = ph
      ? [`<img class="main" src="${ph.img}" alt="${p.name}">`, `<img class="full" src="${ph.hover}" alt="${p.name} in use">`]
      : [art(p.type, 0), art(p.type, 1)];
    const similar = ['choc-truck', 'business-card', 'dna-folder', 'tote-black'].filter(id => id !== p.id);
    const similarList = [...similar, ...PRODUCTS.map(x => x.id).filter(id => id !== p.id && !similar.includes(id))].slice(0, 4);
    let slide = 0, qty = 1;

    $('#app').innerHTML = `
      <div class="wrap">
        <section class="product-main">
          <div class="gallery">
            <div class="stage" style="background:${c.bg}"></div>
            <div class="gallery-nav">
              <button class="g-prev" aria-label="Previous image">&lsaquo;</button>
              <span class="g-count"></span>
              <button class="g-next" aria-label="Next image">&rsaquo;</button>
            </div>
          </div>
          <div class="product-info">
            <h1>${p.name}</h1>
            <div class="price">${fmt(p.price)}</div>
            <div class="buy-row">
              <div class="stepper">
                <button class="q-dec" aria-label="Decrease quantity">&minus;</button>
                <output class="q-val" aria-live="polite">1</output>
                <button class="q-inc" aria-label="Increase quantity">+</button>
              </div>
              <button class="btn btn-red add">Add to cart</button>
            </div>
            <div class="desc"><h2>Description</h2><p>${p.desc || GENERIC_DESC}</p></div>
          </div>
        </section>
        <section class="section" style="padding-top:48px">
          ${heading('Se lignende produkter:')}
          <div class="grid-4">${similarList.map(id => card(getProduct(id))).join('')}</div>
        </section>
      </div>`;
    document.title = `${p.name} – SGL Internal Shop`;

    const stage = $('.stage'), count = $('.g-count');
    const show = i => {
      slide = (i + slides.length) % slides.length;
      stage.innerHTML = slides[slide];
      count.textContent = `${slide + 1}/${slides.length}`;
    };
    show(0);
    $('.g-prev').addEventListener('click', () => show(slide - 1));
    $('.g-next').addEventListener('click', () => show(slide + 1));

    const val = $('.q-val');
    $('.q-dec').addEventListener('click', () => { qty = Math.max(1, qty - 1); val.textContent = qty; });
    $('.q-inc').addEventListener('click', () => { qty += 1; val.textContent = qty; });

    const addBtn = $('.add');
    addBtn.addEventListener('click', () => {
      Cart.add(p.id, qty);
      addBtn.textContent = 'Added \u2713';
      setTimeout(() => (addBtn.textContent = 'Add to cart'), 1400);
    });
  },

  /* Cart */
  cart() {
    const render = () => {
      const lines = Cart.lines();
      $('#app').innerHTML = `
        <div class="wrap cart-layout">
          <section>
            <h1 class="page-title">My bag</h1>
            ${lines.length
              ? lines.map(l => lineItemHTML(l)).join('')
              : `<div class="empty">Your bag is empty.<br><a class="btn btn-red" href="shop.html">Start shopping</a></div>`}
          </section>
          <aside class="total-box">
            <h2>TOTAL</h2>
            <div class="sub-row"><span>Sub-total</span><span>${fmt(Cart.subtotal())}</span></div>
            <small>All prices are excl. VAT</small>
            <div class="total-actions">
              ${lines.length ? '<a class="btn btn-red" href="checkout.html">Checkout</a>' : '<span class="btn btn-red" style="opacity:.5;pointer-events:none">Checkout</span>'}
              <a class="btn btn-outline" href="shop.html">Keep Shopping</a>
            </div>
          </aside>
        </div>`;
    };
    render();
    $('#app').addEventListener('click', e => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const id = btn.closest('.line-item').dataset.id;
      const item = Cart.read().find(i => i.id === id);
      if (btn.dataset.act === 'remove') Cart.remove(id);
      if (btn.dataset.act === 'inc') Cart.setQty(id, item.qty + 1);
      if (btn.dataset.act === 'dec') Cart.setQty(id, item.qty - 1);
      render();
    });
  },

  /* Checkout */
  checkout() {
    const lines = Cart.lines();
    const sub = Cart.subtotal(), vat = sub * VAT_RATE, total = sub + vat;
    const field = (ph, name, req = true, type = 'text') =>
      `<input type="${type}" name="${name}" placeholder="${req ? '*' : ''}${ph}" ${req ? 'required' : ''} aria-label="${ph}">`;

    $('#app').innerHTML = `
      <div class="wrap checkout-layout">
        <section>
          <h2 class="col-title">Billing</h2>
          <form class="billing" id="billing" novalidate>
            ${field('Contact person', 'contact')}
            ${field('Email', 'email', true, 'email')}
            ${field('Phone/Mobile', 'phone', true, 'tel')}
            <div class="gap"></div>
            ${field('Email for tracking', 'tracking', true, 'email')}
            <label class="insurance">Insurance
              <select name="insurance" aria-label="Insurance"><option>Yes</option><option>No</option></select>
            </label>
            ${field('Initials and ref. for invoice', 'invoice')}
            <div class="gap"></div>
            ${field('Delivery company name', 'company')}
            ${field('Delivery contact', 'dcontact')}
            ${field('Contact phone for delivery', 'dphone', true, 'tel')}
            ${field('Contact Email for delivery', 'demail', true, 'email')}
            <div class="gap"></div>
            ${field('Delivery adress', 'address')}
            ${field('Adress 2', 'address2', false)}
            <div class="split">${field('Postalcode', 'zip')}${field('Postal place', 'city')}</div>
            ${field('Country', 'country')}
            <button class="btn btn-red place-order" type="submit">Place order</button>
          </form>
        </section>
        <section class="summary">
          <h2 class="col-title">Products</h2>
          ${lines.length ? lines.map(l => lineItemHTML(l, { editable: false })).join('') : '<div class="empty">Your bag is empty.</div>'}
          <hr>
          <div class="sum-box">
            <div><div class="r"><span class="big">SUM TOTAL</span><span class="amt">${fmt(sub)}</span></div><small>All prices is excl. VAT</small></div>
            <div><div class="r"><span class="big">TOTAL (incl. VAT)</span><span class="amt">${fmt(total)}</span></div>
              <div class="r"><small>VAT amount</small><small>${fmt(vat)}</small></div></div>
          </div>
        </section>
      </div>`;

    $('#billing').addEventListener('submit', e => {
      e.preventDefault();
      const form = e.currentTarget;
      if (!lines.length) { location.href = 'shop.html'; return; }
      if (!form.reportValidity()) return;
      Cart.clear();
      $('#app').innerHTML = `
        <div class="wrap confirmation">
          <h1>Thank you for your order</h1>
          <p>A confirmation has been sent to ${form.elements.email.value}.</p>
          <a class="btn btn-red" href="home.html">Back to shop</a>
        </div>`;
      scrollTo({ top: 0 });
    });
  },
};

/* Home category carousel: centred active slide, arrows + dots + swipe */
function initCategoryCarousel(root) {
  const track = $('.cat-track', root);
  const slides = $$('.cat-slide', root);
  const dots = $$('.dots button', root);
  let i = 1;                                    // start on 2nd category like the design

  const render = () => {
    const s = slides[i];
    const offset = s.offsetLeft - (root.clientWidth - s.offsetWidth) / 2;
    track.style.transform = `translateX(${-offset}px)`;
    slides.forEach((el, n) => el.classList.toggle('active', n === i));
    dots.forEach((d, n) => d.classList.toggle('active', n === i));
  };
  const go = n => { i = (n + slides.length) % slides.length; render(); };

  $('.prev', root).addEventListener('click', () => go(i - 1));
  $('.next', root).addEventListener('click', () => go(i + 1));
  dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.i)));
  slides.forEach((s, n) => s.addEventListener('click', e => {
    if (swiped || n !== i) { e.preventDefault(); if (!swiped) go(n); }  // side slides: bring to centre first
  }));
  window.addEventListener('resize', render);

  let startX = null, swiped = false;
  root.addEventListener('pointerdown', e => { startX = e.clientX; swiped = false; });
  root.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) { swiped = true; go(dx < 0 ? i + 1 : i - 1); }
    startX = null;
  });
  render();
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  renderHeader();
  renderFooter();
  pages[page] && pages[page]();
});
