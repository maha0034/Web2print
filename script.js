/* ==========================================================
   Web2print – SGL Internal Shop
   Shared data, header/footer, cart (localStorage) and the
   page logic for each screen. Pages set <body data-page="…">.
   ========================================================== */

/* ---------- Data ----------
   The product list lives in products.js (loaded before this file).
   Categories, their card colour and the home-page favourites are set here. */
const CATEGORIES = [
  { slug: 'giveaways',       name: 'Giveaways',                    bg: '#eef0c8', img: 'assets/images/cat-giveaways.jpg' },
  { slug: 'office-deco',     name: 'Office deco',                  bg: '#d9d9d9', img: 'assets/images/cat-office-deco.jpg' },
  { slug: 'printing',        name: 'On-demand printing materials', bg: '#c9d6e3', img: 'assets/images/cat-printing.jpg' },
  { slug: 'office-supplies', name: 'Office supplies',              bg: '#e8b8b8', img: 'assets/images/cat-office-supplies.jpg' },
];

const GENERIC_DESC = 'A Scan Global Logistics branded item, available to order through the internal shop. Contact Marcom if you need a custom quantity or a different design.';
const SUB_DESC = {
  'Country Flyers': 'A4 "Did you know" country flyer with a fun fact, local contacts and an overview of the services offered in the market. Printed on demand in the quantity you need.',
  'Product Flyers': 'Printed product flyer that explains one of our services in a clear, customer-ready format. Printed on demand in the quantity you need.',
  'Vertical Flyers': 'Printed flyer for a specific industry or event. Printed on demand in the quantity you need.',
  'Value-added Services': 'Printed flyer describing one of our value-added services. Printed on demand in the quantity you need.',
  'Sustainability': 'Printed flyer about our sustainable logistics solutions. Printed on demand in the quantity you need.',
  'Business Card': 'Business cards in the Scan Global Logistics design, printed with your name, title and contact details.',
  'Stationary': 'Company stationery in the Scan Global Logistics design, printed on demand.',
  'Roll-up': 'Roll-up banner with carrying bag, ready to set up in seconds at fairs, events and in the office.',
  'DNA shop': 'Brand material that brings our DNA and virtues to life in the office or at events.',
  'Wall deco': 'Wall decoration that gives your office the Scan Global Logistics look.',
  'Beachflag': 'Beach flag for outdoor events and entrances. Order the flag, base and pole separately.',
};

const FAVORITES = ['thermo-cup', 'cotton-tote-bag', 'business-card-standard', 'our-virtues-roll-up-red'];
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
        <a class="icon-link" href="checkout.html" aria-label="My bag">${ICON.cart}<span class="cart-badge"></span></a>
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
    const hay = `${p.name} ${getCat(p.cat).name} ${p.sub || ''} ${p.keywords || ''}`.toLowerCase();
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
          const c = getCat(p.cat);
          return `<a href="product.html?id=${p.id}"><span class="s-thumb" style="background:${c.bg}"><img src="${p.img}" alt=""></span>
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
    <div class="card-img" style="background:${c.bg}"><img class="img-main" src="${p.img}" alt="${p.name}" loading="lazy" decoding="async"></div>
    <div class="card-body"><strong class="price">${fmt(p.price)}</strong><span class="name">${p.name}</span><span class="cat">${c.name}</span></div>
  </a>`;
}
const heading = text => `<h2 class="heading">${text}</h2>`;

/* Generic "N cards visible, arrows slide by one" carousel (arrows sit left/right of the images) */
function initRowCarousel(root) {
  const viewport = $('.row-viewport', root);
  const track = $('.row-track', root);
  const prev = $('.prev', root), next = $('.next', root);
  let index = 0;
  const per = () => parseInt(getComputedStyle(track).getPropertyValue('--per')) || 4;
  const max = () => Math.max(0, track.children.length - per());
  const go = i => {
    index = i;
    track.style.transform = `translateX(${-index * (100 / per())}%)`;
  };
  // Arrows move one "page" (as many cards as are visible) and wrap around at the ends
  prev.addEventListener('click', () => go(index <= 0 ? max() : Math.max(0, index - per())));
  next.addEventListener('click', () => go(index >= max() ? 0 : Math.min(max(), index + per())));
  // Re-check on resize: hide arrows when everything fits, keep position valid
  new ResizeObserver(() => {
    root.classList.toggle('no-scroll', max() === 0);
    go(Math.min(index, max()));
  }).observe(viewport);
}

function rowCarouselHTML(cards) {
  return `<div class="row-viewport"><div class="row-track">${cards}</div></div>
    <button class="row-arrow prev" aria-label="Previous">${ICON.left}</button>
    <button class="row-arrow next" aria-label="Next">${ICON.right}</button>`;
}

function lineItemHTML(l, { editable = true } = {}) {
  const p = l.product, c = getCat(p.cat);
  return `<div class="line-item" data-id="${p.id}">
    <div class="thumb" style="background:${c.bg}"><img src="${p.img}" alt=""></div>
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
/* ---------- Shared filter pieces (used by shop.html and category.html) ---------- */
const SORTERS = {
  'recommended': null,
  'price-asc':  (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'name-asc':   (a, b) => a.name.localeCompare(b.name),
  'name-desc':  (a, b) => b.name.localeCompare(a.name),
};
const SORT_GROUP = `
  <details class="f-group" open>
    <summary>Sort by</summary>
    <div class="f-body">
      <select id="sort" aria-label="Sort by">
        <option value="recommended">Recommended</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>
    </div>
  </details>`;
const priceGroup = MAXP => `
  <details class="f-group" open>
    <summary>Price (DKK)</summary>
    <div class="f-body">
      <div class="range">
        <div class="range-fill"></div>
        <input type="range" id="p-min" min="0" max="${MAXP}" step="1" value="0" aria-label="Minimum price">
        <input type="range" id="p-max" min="0" max="${MAXP}" step="1" value="${MAXP}" aria-label="Maximum price">
      </div>
      <div class="price-inputs">
        <label>From<input type="number" id="p-from" min="0" max="${MAXP}" value="0"></label>
        <label>To<input type="number" id="p-to" min="0" max="${MAXP}" value="${MAXP}"></label>
      </div>
    </div>
  </details>`;
const maxPrice = list => Math.ceil(Math.max(...list.map(p => p.price)) / 10) * 10;
const SUB_LABEL = { 'Event s & fairs': 'Events & fairs', 'Stationary': 'Stationery' };   // tidy folder names
const subLabel = s => SUB_LABEL[s] || s;

/* Wires up sort + price + reset. `state` must hold sort/min/max; `onReset` clears the page's own filters. */
function bindFilters(state, MAXP, render, onReset) {
  if (window.innerWidth <= 900) $$('.f-group').forEach(g => (g.open = false));   // sections start closed on mobile
  const sortEl = $('#sort'), lo = $('#p-min'), hi = $('#p-max'), from = $('#p-from'), to = $('#p-to'), range = $('.range');
  const clamp = v => Math.min(MAXP, Math.max(0, Math.round(Number(v) || 0)));
  function paintRange() {
    range.style.setProperty('--lo', state.min / MAXP);
    range.style.setProperty('--hi', state.max / MAXP);
    lo.style.zIndex = state.min > MAXP * 0.9 ? 5 : 3;    // keep the min thumb reachable at the far end
    lo.value = from.value = state.min;
    hi.value = to.value = state.max;
  }
  lo.addEventListener('input', () => { state.min = Math.min(clamp(lo.value), state.max); paintRange(); render(); });
  hi.addEventListener('input', () => { state.max = Math.max(clamp(hi.value), state.min); paintRange(); render(); });
  from.addEventListener('change', () => { state.min = Math.min(clamp(from.value), state.max); paintRange(); render(); });
  to.addEventListener('change', () => { state.max = Math.max(to.value === '' ? MAXP : clamp(to.value), state.min); paintRange(); render(); });
  sortEl.addEventListener('change', () => { state.sort = sortEl.value; render(); });
  const reset = () => {
    Object.assign(state, { sort: 'recommended', min: 0, max: MAXP });
    sortEl.value = 'recommended';
    onReset();
    paintRange(); render();
  };
  $('.reset').addEventListener('click', reset);
  paintRange();
  return reset;
}

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
          <div class="cat-viewport"><div class="cat-track">
            ${CATEGORIES.map(c => `<a class="cat-slide" href="category.html?cat=${c.slug}"
              style="--bg:${c.bg}; background-image:url('${c.img}'), linear-gradient(135deg,#2a2a2a,#555); background-size:cover; background-position:center;"><span>${c.name}</span></a>`).join('')}
          </div></div>
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

  /* Shop: filters on the left, one panel per category on the right */
  shop() {
    document.body.classList.add('shop-page');
    const MAXP = maxPrice(PRODUCTS);
    const state = { sort: 'recommended', cats: new Set(), min: 0, max: MAXP };

    $('#app').innerHTML = `
      <div class="shop-layout">
        <aside class="filters" aria-label="Filters">
          <div class="filters-head">
            <h2>Filters</h2>
            <button class="reset" type="button">Reset filters</button>
          </div>
          ${SORT_GROUP}
          <details class="f-group" open>
            <summary>Categories</summary>
            <div class="f-body">
              ${CATEGORIES.map(c => `<label class="check-row"><input type="checkbox" value="${c.slug}">${c.name}</label>`).join('')}
            </div>
          </details>
          ${priceGroup(MAXP)}
        </aside>
        <section class="shop-content">
          <div class="shop-head">
            <h1>Shop</h1>
            <p class="sub">Browse our products.</p>
            <p class="count" aria-live="polite"></p>
          </div>
          <div id="panels"></div>
        </section>
      </div>`;

    const panels = $('#panels');

    function render() {
      let total = 0;
      const html = CATEGORIES.filter(c => !state.cats.size || state.cats.has(c.slug)).map(c => {
        let list = PRODUCTS.filter(p => p.cat === c.slug && p.price >= state.min && p.price <= state.max);
        if (SORTERS[state.sort]) list = [...list].sort(SORTERS[state.sort]);
        if (!list.length) return '';
        total += list.length;
        // No category picked: one carousel per category. Category picked: show every product in it as a grid.
        const body = state.cats.size
          ? `<div class="grid-4">${list.map(card).join('')}</div>`
          : `<div class="row-carousel">${rowCarouselHTML(list.map(card).join(''))}</div>`;
        return `<section class="panel" id="${c.slug}">
          <h2 class="panel-title">${c.name}</h2>
          ${body}
        </section>`;
      }).join('');
      panels.innerHTML = html || `<div class="panel panel-empty"><p>No products match your filters.</p><button class="btn btn-red" type="button" data-reset>Reset filters</button></div>`;
      $('.count').textContent = `${total} product${total === 1 ? '' : 's'}`;
      $$('.row-carousel', panels).forEach(initRowCarousel);
    }

    $$('.check-row input').forEach(cb => cb.addEventListener('change', () => {
      state.cats = new Set($$('.check-row input:checked').map(x => x.value));
      render();
    }));
    const reset = bindFilters(state, MAXP, render, () => {
      state.cats = new Set();
      $$('.check-row input').forEach(cb => (cb.checked = false));
    });
    panels.addEventListener('click', e => { if (e.target.closest('[data-reset]')) reset(); });
    render();
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

  /* Category page: all products of one category, with sub-group, sort and price filters */
  category() {
    document.body.classList.add('shop-page');
    const cat = getCat(params.get('cat'));
    const base = cat ? PRODUCTS.filter(p => p.cat === cat.slug) : PRODUCTS;
    const subs = [...new Set(base.map(p => p.sub))];                 // sub-groups, in the order of products.js
    const MAXP = maxPrice(base);
    const state = { sort: 'recommended', subs: new Set(), min: 0, max: MAXP };

    $('#app').innerHTML = `
      <section class="hero hero-short"><h1>${cat ? cat.name : 'All categories'}</h1></section>
      <div class="shop-layout">
        <aside class="filters" aria-label="Filters">
          <div class="filters-head">
            <h2>Filters</h2>
            <button class="reset" type="button">Reset filters</button>
          </div>
          ${SORT_GROUP}
          <details class="f-group" open>
            <summary>Subcategories</summary>
            <div class="f-body">
              ${subs.map(sub => `<label class="check-row"><input type="checkbox" value="${sub.replace(/"/g, '&quot;')}">${subLabel(sub)}
                <span class="n">${base.filter(p => p.sub === sub).length}</span></label>`).join('')}
            </div>
          </details>
          ${priceGroup(MAXP)}
        </aside>
        <section class="shop-content">
          <div class="shop-head">
            <h1>All products</h1>
            <p class="count" aria-live="polite"></p>
          </div>
          <div id="panels"></div>
        </section>
      </div>`;

    const panels = $('#panels');

    function render() {
      let list = base.filter(p => (!state.subs.size || state.subs.has(p.sub)) && p.price >= state.min && p.price <= state.max);
      if (SORTERS[state.sort]) list = [...list].sort(SORTERS[state.sort]);
      panels.innerHTML = list.length
        ? `<section class="panel"><div class="grid-4">${list.map(card).join('')}</div></section>`
        : `<div class="panel panel-empty"><p>No products match your filters.</p><button class="btn btn-red" type="button" data-reset>Reset filters</button></div>`;
      $('.count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
    }

    $$('.check-row input').forEach(cb => cb.addEventListener('change', () => {
      state.subs = new Set($$('.check-row input:checked').map(x => x.value));
      render();
    }));
    const reset = bindFilters(state, MAXP, render, () => {
      state.subs = new Set();
      $$('.check-row input').forEach(cb => (cb.checked = false));
    });
    panels.addEventListener('click', e => { if (e.target.closest('[data-reset]')) reset(); });
    document.title = `${cat ? cat.name : 'All products'} – SGL Internal Shop`;
    render();
  },

  /* Product page */
  product() {
    const p = getProduct(params.get('id')) || PRODUCTS[0];
    const c = getCat(p.cat);
    // p.imgs can hold extra photos later (e.g. lifestyle shots); until then each product has one image
    const slides = (p.imgs || [p.img]).map((src, i) => `<img class="main" src="${src}" alt="${p.name}${i ? ' – image ' + (i + 1) : ''}">`);
    const sameSub = PRODUCTS.filter(x => x.id !== p.id && x.sub === p.sub);
    const sameCat = PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat && x.sub !== p.sub);
    const similarList = [...sameSub, ...sameCat].slice(0, 4).map(x => x.id);
    let slide = 0, qty = 1;

    $('#app').innerHTML = `
      <div class="wrap">
        <section class="product-main">
          <div class="gallery">
            <div class="stage" style="background:${c.bg}"></div>
            <div class="gallery-nav"${slides.length < 2 ? ' hidden' : ''}>
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
            <div class="desc"><h2>Description</h2><p>${p.desc || SUB_DESC[p.sub] || GENERIC_DESC}</p></div>
          </div>
        </section>
        <section class="section" style="padding-top:48px;padding-bottom:88px">
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

  /* Checkout (also the bag): edit quantities / remove items on the right, billing details on the left */
  checkout() {
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
          </form>
        </section>
        <section class="summary">
          <h2 class="col-title">Products</h2>
          <div id="lines"></div>
          <hr>
          <div class="sum-box" id="sum"></div>
          <div class="order-actions">
            <button class="btn btn-red" type="submit" form="billing" id="place">Place order</button>
            <a class="btn btn-outline" href="shop.html">Keep Shopping</a>
          </div>
        </section>
      </div>`;

    const lines = $('#lines'), sum = $('#sum'), place = $('#place');

    function renderSummary() {
      const items = Cart.lines();
      const sub = Cart.subtotal(), vat = sub * VAT_RATE, total = sub + vat;
      lines.innerHTML = items.length
        ? items.map(l => lineItemHTML(l)).join('')
        : '<div class="empty">Your bag is empty.</div>';
      sum.innerHTML = `
        <div><div class="r"><span class="big">SUM TOTAL</span><span class="amt">${fmt(sub)}</span></div><small>All prices is excl. VAT</small></div>
        <div><div class="r"><span class="big">TOTAL (incl. VAT)</span><span class="amt">${fmt(total)}</span></div>
          <div class="r"><small>VAT amount</small><small>${fmt(vat)}</small></div></div>`;
      place.disabled = !items.length;
    }

    // + / - change the quantity, the red x removes the line; only the right-hand side is redrawn so typed billing details stay
    lines.addEventListener('click', e => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const id = btn.closest('.line-item').dataset.id;
      const item = Cart.read().find(i => i.id === id);
      if (btn.dataset.act === 'remove') Cart.remove(id);
      if (btn.dataset.act === 'inc') Cart.setQty(id, item.qty + 1);
      if (btn.dataset.act === 'dec') Cart.setQty(id, item.qty - 1);
      renderSummary();
    });

    $('#billing').addEventListener('submit', e => {
      e.preventDefault();
      const form = e.currentTarget;
      if (!Cart.lines().length) return;
      if (!form.reportValidity()) return;
      Cart.clear();
      $('#app').innerHTML = `
        <div class="wrap confirmation">
          <h1>Thank you for your order</h1>
          <p>A confirmation has been sent to ${form.elements.email.value.replace(/</g, '&lt;')}.</p>
          <a class="btn btn-red" href="home.html">Back to shop</a>
        </div>`;
      scrollTo({ top: 0 });
    });

    renderSummary();
  },
};

/* Home category carousel: centred active slide, arrows + dots + swipe */
function initCategoryCarousel(root) {
  const track = $('.cat-track', root);
  const view = $('.cat-viewport', root);
  const slides = $$('.cat-slide', root);
  const dots = $$('.dots button', root);
  let i = 1;                                    // start on 2nd category like the design

  const render = () => {
    const s = slides[i];
    const offset = s.offsetLeft - (view.clientWidth - s.offsetWidth) / 2;
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
