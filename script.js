/* ==========================================================
   Web2print – SGL Internal Shop
   Shared data, header/footer, cart (localStorage) and the
   page logic for each screen. Pages set <body data-page="…">.
   ========================================================== */

/* ---------- Data ----------
   The product list lives in products.js (loaded before this file).
   Categories, their card colour and the home-page favourites are set here. */
const CATEGORIES = [
  { slug: 'giveaways',       name: tr('Giveaways', 'Giveaways'),                    bg: '#dce5ce', img: 'assets/images/cat-giveaways.jpg' },
  { slug: 'office-deco',     name: tr('Office deco', 'Kontorindretning'),                  bg: '#dde5ec', img: 'assets/images/cat-office-deco.jpg' },
  { slug: 'printing',        name: tr('On-demand printing materials', 'Tryk on demand'), bg: '#f1eadc', img: 'assets/images/cat-printing.jpg' },
  { slug: 'office-supplies', name: tr('Office supplies', 'Kontorartikler'),              bg: '#dcc2c8', img: 'assets/images/cat-office-supplies.jpg' },
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
const SHIPPING_EXPRESS = 49;  // DKK excl. VAT; standard shipping is free
const VAT_RATE = 0.25;

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const getCat = slug => CATEGORIES.find(c => c.slug === slug);
const getProduct = id => PRODUCTS.find(p => p.id === id);
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

/* Toast shown under the cart icon when something is added: confirms it and links straight to checkout */
let toastTimer;
function showCartToast(id, qty) {
  const p = getProduct(id), c = getCat(p.cat);
  $('.cart-toast')?.remove();
  const el = document.createElement('div');
  el.className = 'cart-toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `
    <button class="ct-close" type="button" aria-label="${t('close')}">&times;</button>
    <div class="ct-head"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>${t('added_to_bag')}</div>
    <div class="ct-item">
      <div class="ct-thumb" style="background:${c.bg}"><img src="${p.img}" alt=""></div>
      <div class="ct-meta"><span class="ct-name">${p.name}</span><span class="ct-qty">${t('qty', { n: qty })} &middot; ${fmt(p.price * qty)}</span></div>
    </div>
    <div class="ct-total"><span>${t(Cart.count() === 1 ? 'bag_one' : 'bag_many', { n: Cart.count() })}</span><b>${fmt(Cart.subtotal())}</b></div>
    <div class="ct-actions">
      <button class="ct-keep" type="button">${t('keep_shopping_lc')}</button>
      <a class="btn btn-red" href="checkout.html">${t('go_to_checkout')}</a>
    </div>`;
  document.body.appendChild(el);
  const close = () => { clearTimeout(toastTimer); el.classList.remove('show'); setTimeout(() => el.remove(), 250); };
  const arm = () => { clearTimeout(toastTimer); toastTimer = setTimeout(close, 5000); };
  $('.ct-close', el).addEventListener('click', close);
  $('.ct-keep', el).addEventListener('click', close);
  el.addEventListener('mouseenter', () => clearTimeout(toastTimer));
  el.addEventListener('mouseleave', arm);
  requestAnimationFrame(() => el.classList.add('show'));
  arm();
  const badge = $('.cart-badge');
  if (badge) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
}

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
      <a class="logo" href="home.html"><img src="assets/images/logo.svg" alt="${t('logo_alt')}"></a>
      <div class="header-right">
        <form class="search" role="search" action="search.html" autocomplete="off">
          <input type="search" name="q" placeholder="${t('search_ph')}" aria-label="${t('search')}" value="${(location.pathname.endsWith('search.html') ? params.get('q') || '' : '').replace(/"/g, '&quot;')}">
          <button type="submit" aria-label="${t('search')}">${ICON.search}</button>
          <div class="suggest" hidden></div>
        </form>
        <div class="lang">
          <button class="lang-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="${t('language')}">
            <img src="assets/icons/flag-${LANG}.png" alt=""><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <ul class="lang-menu" hidden>
            <li><button type="button" data-lang="en"${LANG === 'en' ? ' aria-current="true"' : ''}><img src="assets/icons/flag-en.png" alt="">English</button></li>
            <li><button type="button" data-lang="da"${LANG === 'da' ? ' aria-current="true"' : ''}><img src="assets/icons/flag-da.png" alt="">Dansk (DK)</button></li>
          </ul>
        </div>
        <div class="account">
          <a class="icon-link" href="index.html" aria-label="${t('account')}" aria-describedby="account-pop">${ICON.user}</a>
          <div class="account-pop" id="account-pop" role="tooltip">
            <p><span>${t('acc_user')}</span> sglhvidovre</p>
            <p><span>${t('acc_address')}</span> Jernholmen 49</p>
          </div>
        </div>
        <a class="icon-link" href="checkout.html" aria-label="${t('my_bag')}">${ICON.cart}<span class="cart-badge"></span></a>
      </div>
    </header>`;
  updateBadge();
  initSearch();
  initLangMenu();
}

function initLangMenu() {
  const box = $('.lang'); if (!box) return;
  const btn = $('.lang-btn', box), menu = $('.lang-menu', box);
  const setOpen = o => { menu.hidden = !o; btn.setAttribute('aria-expanded', o); };
  btn.addEventListener('click', e => { e.stopPropagation(); setOpen(menu.hidden); });
  $$('[data-lang]', menu).forEach(b => b.addEventListener('click', () => (b.dataset.lang === LANG ? setOpen(false) : setLang(b.dataset.lang))));
  document.addEventListener('click', e => { if (!box.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
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
        }).join('') + (hits.length > 5 ? `<a class="s-all" href="search.html?q=${encodeURIComponent(q)}">${t('see_all_results', { n: hits.length })}</a>` : '')
      : `<p class="s-none">${t('no_products_found')}</p>`;
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
    <div class="card-img" style="background:${c.bg}"><img class="img-main" src="${p.img}" alt="${p.name}" loading="lazy" decoding="async">${p.hover ? `<img class="img-hover" src="${p.hover}" alt="" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0" onerror="this.remove()">` : ''}</div>
    <div class="card-body"><strong class="price">${fmt(p.price)}</strong><span class="name">${p.name}</span><span class="cat">${c.name}</span></div>
  </a>`;
}
/* Home hero: four slides that change by themselves every 10 s (no controls) */
function collectionInfo(key) {
  const ids = COLLECTIONS[key]; if (!ids) return null;
  const title = heroSlides().find(sl => sl.href.endsWith('=' + key)).title;
  return { title, items: ids.map(getProduct).filter(Boolean) };
}
function heroSlides() {
  return [
    { title: t('site_name'), sub: t('hero_sub'), href: 'shop.html' },
    { title: tr('Latest added items', 'Senest tilføjede varer'), sub: tr('Fresh additions for your everyday needs.', 'Nyheder til din hverdag.'), href: 'category.html?collection=latest' },
    { title: tr('Outlet', 'Outlet'), sub: tr('Shop the last items before they’re gone.', 'Køb de sidste varer, før de er væk.'), href: 'category.html?collection=outlet' },
    { title: tr('Our favourites', 'Vores favoritter'), sub: tr('Explore a selection of our favourite products.', 'Udforsk et udvalg af vores favoritprodukter.'), href: 'category.html?collection=favourites' }
  ];
}
function initHeroSlider() {
  const slides = $$('.hero-slide'); if (slides.length < 2) return;
  slides.forEach((_, i) => { new Image().src = `assets/images/hero-${i + 1}.jpg`; });
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove('active'); slides[i].inert = true; slides[i].setAttribute('aria-hidden', 'true');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active'); slides[i].inert = false; slides[i].removeAttribute('aria-hidden');
  }, 10000);
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
    <button class="row-arrow prev" aria-label="${t('previous')}">${ICON.left}</button>
    <button class="row-arrow next" aria-label="${t('next')}">${ICON.right}</button>`;
}

function lineItemHTML(l, { editable = true } = {}) {
  const p = l.product, c = getCat(p.cat);
  return `<div class="line-item" data-id="${p.id}">
    <div class="thumb" style="background:${c.bg}"><img src="${p.img}" alt=""></div>
    <div class="meta">
      <a href="product.html?id=${p.id}">${p.name}</a>
      <span class="cat">${c.name}</span>
      ${editable
        ? `<span class="mini-step"><button data-act="dec" aria-label="${t('dec_qty')}">&minus;</button>${l.qty}<button data-act="inc" aria-label="${t('inc_qty')}">+</button></span>`
        : `<span class="mini-step">${t('qty', { n: l.qty })}</span>`}
    </div>
    <div class="line-price">${fmt(p.price * l.qty)}</div>
    ${editable ? `<button class="remove" data-act="remove" aria-label="${t('remove', { name: p.name })}">&times;</button>` : ''}
  </div>`;
}

/* ---------- Pages ---------- */
/* ---------- Shared filter pieces (used by shop.html and category.html) ---------- */
const SORTERS = {
  'recommended': null,
  'price-asc':  (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'name-asc':   (a, b) => a.name.localeCompare(b.name, LANG),
  'name-desc':  (a, b) => b.name.localeCompare(a.name, LANG),
};
const SORT_GROUP = `
  <details class="f-group" open>
    <summary>${t('sort_by')}</summary>
    <div class="f-body">
      <select id="sort" aria-label="${t('sort_by')}">
        <option value="recommended">${t('recommended')}</option>
        <option value="price-asc">${t('price_asc')}</option>
        <option value="price-desc">${t('price_desc')}</option>
        <option value="name-asc">${t('name_asc')}</option>
        <option value="name-desc">${t('name_desc')}</option>
      </select>
    </div>
  </details>`;
const priceGroup = MAXP => `
  <details class="f-group" open>
    <summary><span>${t('price_dkk')}<small class="hint">${t('price_per_unit')}</small></span></summary>
    <div class="f-body">
      <div class="range">
        <div class="range-fill"></div>
        <input type="range" id="p-min" min="0" max="${MAXP}" step="1" value="0" aria-label="${t('min_price')}">
        <input type="range" id="p-max" min="0" max="${MAXP}" step="1" value="${MAXP}" aria-label="${t('max_price')}">
      </div>
      <div class="price-inputs">
        <label>${t('from')}<input type="number" id="p-from" min="0" max="${MAXP}" value="0"></label>
        <label>${t('to')}<input type="number" id="p-to" min="0" max="${MAXP}" value="${MAXP}"></label>
      </div>
    </div>
  </details>`;
const maxPrice = list => Math.ceil(Math.max(...list.map(p => p.price)) / 10) * 10;

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
    // carousel order: Office deco on the far left, Giveaways in the centre (start slide)
    const HOME_CATS = ['office-deco', 'giveaways', 'printing', 'office-supplies'].map(getCat);
    $('#app').innerHTML = `
      <section class="hero hero-slider" aria-roledescription="carousel" aria-label="${t('site_name')}">
        ${heroSlides().map((sl, i) => `<div class="hero-slide${i ? '' : ' active'}" style="--img:url('assets/images/hero-${i + 1}.jpg')"${i ? ' inert aria-hidden="true"' : ''}>
          ${i ? `<h2>${sl.title}</h2>` : `<h1>${sl.title}</h1>`}
          <p>${sl.sub}</p>
          <a class="btn btn-red" href="${sl.href}">${t('browse_products')}</a>
        </div>`).join('')}
      </section>
      <section class="section">
        <div class="wrap">${heading(t('browse_by_cat'))}</div>
        <div class="cat-carousel" aria-roledescription="carousel" aria-label="${t('product_categories')}">
          <div class="cat-viewport"><div class="cat-track">
            ${HOME_CATS.map(c => `<a class="cat-slide" href="category.html?cat=${c.slug}"
              style="--bg:${c.bg}; background-image:url('${c.img}'), linear-gradient(135deg,#2a2a2a,#555); background-size:cover; background-position:center;"><span>${c.name}</span></a>`).join('')}
          </div></div>
          <button class="arrow-btn cat-arrow prev" aria-label="${t('prev_cat')}">${ICON.left}</button>
          <button class="arrow-btn cat-arrow next" aria-label="${t('next_cat')}">${ICON.right}</button>
          <div class="dots">${HOME_CATS.map((c, i) => `<button aria-label="${t('show_cat', { name: c.name })}" data-i="${i}"></button>`).join('')}</div>
        </div>
      </section>
      <section class="section wrap home-end">
        ${heading(t('our_favourites'))}
        <div class="grid-4">${FAVORITES.map(id => card(getProduct(id))).join('')}</div>
      </section>`;
    initHeroSlider();
    initCategoryCarousel($('.cat-carousel'));
  },

  /* Shop: filters on the left, one panel per category on the right */
  shop() {
    document.body.classList.add('shop-page');
    const MAXP = maxPrice(PRODUCTS);
    const state = { sort: 'recommended', cats: new Set(), min: 0, max: MAXP };

    $('#app').innerHTML = `
      <div class="shop-layout">
        <aside class="filters" aria-label="${t('filters')}">
          <div class="filters-head">
            <h2>${t('filters')}</h2>
            <button class="reset" type="button">${t('reset_filters')}</button>
          </div>
          ${SORT_GROUP}
          <details class="f-group" open>
            <summary>${t('categories')}</summary>
            <div class="f-body">
              ${CATEGORIES.map(c => `<label class="check-row"><input type="checkbox" value="${c.slug}">${c.name}</label>`).join('')}
            </div>
          </details>
          ${priceGroup(MAXP)}
        </aside>
        <section class="shop-content">
          <div class="shop-head">
            <h1>${t('shop')}</h1>
            <p class="sub">${t('browse_our_products')}</p>
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
          <div class="panel-head">
            <h2 class="panel-title">${c.name}</h2>
            <a class="see-all" href="category.html?cat=${c.slug}">${t('see_all_products')} <svg viewBox="0 0 24 16" aria-hidden="true"><path d="M0 0h6l8 8-8 8H0l8-8zM10 0h6l8 8-8 8h-6l8-8z"/></svg></a>
          </div>
          ${body}
        </section>`;
      }).join('');
      panels.innerHTML = html || `<div class="panel panel-empty"><p>${t('no_match_filters')}</p><button class="btn btn-red" type="button" data-reset>${t('reset_filters')}</button></div>`;
      $('.count').textContent = countOf('product', total);
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
        ${heading(q ? t('results_for', { q: safe }) : t('search'))}
        ${hits.length
          ? `<p class="result-count">${countOf('found', hits.length)}</p><div class="grid-4">${hits.map(card).join('')}</div>`
          : `<div class="empty">${q ? t('no_match_search') : t('type_something')}<br><a class="btn btn-red" href="shop.html">${t('browse_all')}</a></div>`}
      </div>`;
    document.title = `${t('search')} – ${t('site_name')}`;
  },

  /* Category page: all products of one category, with sub-group, sort and price filters */
  category() {
    document.body.classList.add('shop-page');
    const coll = collectionInfo(params.get('collection'));
    const cat = coll ? null : getCat(params.get('cat'));
    const base = coll ? coll.items : cat ? PRODUCTS.filter(p => p.cat === cat.slug) : PRODUCTS;
    const pageTitle = coll ? coll.title : cat ? cat.name : t('all_categories');
    const subs = [...new Set(base.map(p => p.sub))];                 // sub-groups, in the order of products.js
    const MAXP = maxPrice(base);
    const state = { sort: 'recommended', subs: new Set(), min: 0, max: MAXP };

    $('#app').innerHTML = `
      <section class="hero hero-short"><h1>${pageTitle}</h1></section>
      <div class="shop-layout">
        <aside class="filters" aria-label="${t('filters')}">
          <div class="filters-head">
            <h2>${t('filters')}</h2>
            <button class="reset" type="button">${t('reset_filters')}</button>
          </div>
          ${SORT_GROUP}
          <details class="f-group" open>
            <summary>${t('subcategories')}</summary>
            <div class="f-body">
              ${subs.map(sub => `<label class="check-row"><input type="checkbox" value="${sub.replace(/"/g, '&quot;')}">${subLabel(sub)}
                <span class="n">${base.filter(p => p.sub === sub).length}</span></label>`).join('')}
            </div>
          </details>
          ${priceGroup(MAXP)}
        </aside>
        <section class="shop-content">
          <div class="shop-head">
            <h1>${t('all_products')}</h1>
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
        : `<div class="panel panel-empty"><p>${t('no_match_filters')}</p><button class="btn btn-red" type="button" data-reset>${t('reset_filters')}</button></div>`;
      $('.count').textContent = countOf('product', list.length);
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
    document.title = `${coll || cat ? pageTitle : t('all_products')} – ${t('site_name')}`;
    render();
  },

  /* Product page */
  product() {
    const p = getProduct(params.get('id')) || PRODUCTS[0];
    const c = getCat(p.cat);
    // p.imgs can hold extra photos later (e.g. lifestyle shots); until then each product has one image
    const slides = (p.imgs || [p.img].concat(p.hover ? [p.hover] : [])).map((src, i) => `<img class="main${src === p.hover ? ' full' : ''}" src="${src}" alt="${p.name}${i ? ' – ' + t('image_n', { n: i + 1 }) : ''}">`);
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
              <button class="g-prev" aria-label="${t('prev_image')}">&lsaquo;</button>
              <span class="g-count"></span>
              <button class="g-next" aria-label="${t('next_image')}">&rsaquo;</button>
            </div>
          </div>
          <div class="product-info">
            <h1>${p.name}</h1>
            <div class="price">${fmt(p.price)}</div>
            <div class="buy-row">
              <div class="stepper">
                <button class="q-dec" aria-label="${t('dec_qty')}">&minus;</button>
                <output class="q-val" aria-live="polite">1</output>
                <button class="q-inc" aria-label="${t('inc_qty')}">+</button>
              </div>
              <button class="btn btn-red add">${t('add_to_cart')}</button>
            </div>
            <div class="desc"><h2>${t('description')}</h2><p>${p.desc || (LANG === 'da' ? SUB_DESC_DA : SUB_DESC)[p.sub] || GENERIC_DESC_T}</p></div>
          </div>
        </section>
        <section class="section" style="padding-top:48px;padding-bottom:88px">
          ${heading(t('similar'))}
          <div class="grid-4">${similarList.map(id => card(getProduct(id))).join('')}</div>
        </section>
      </div>`;
    document.title = `${p.name} – ${t('site_name')}`;

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
      showCartToast(p.id, qty);
      addBtn.textContent = t('added');
      setTimeout(() => (addBtn.textContent = t('add_to_cart')), 1400);
    });
  },

  /* Checkout (also the bag): edit quantities / remove items on the right, billing details on the left */
  checkout() {
    const field = (ph, name, req = true, type = 'text') =>
      `<input type="${type}" name="${name}" placeholder="${req ? '*' : ''}${ph}" ${req ? 'required' : ''} aria-label="${ph}">`;

    $('#app').innerHTML = `
      <div class="wrap checkout-layout">
        <section>
          <h2 class="col-title">${t('billing')}</h2>
          <div class="purchase-toggle" role="radiogroup" aria-label="${t('purchase_type')}">
            <label><input type="radio" name="purchase" value="company" checked><span>${t('company_purchase')}</span></label>
            <label><input type="radio" name="purchase" value="personal"><span>${t('personal_purchase')}</span></label>
          </div>
          <form class="billing" id="billing" novalidate>
            <fieldset class="mode" id="company-fields">
            <h3 class="form-h">${t('contact')}</h3>
            <div class="row2">
              ${field(t('contact_person'), 'contact')}
              ${field(t('email'), 'email', true, 'email')}
              ${field(t('phone'), 'phone', true, 'tel')}
              <div class="tracking">
                ${field(t('tracking_email'), 'tracking', true, 'email')}
                <button class="add-link" type="button" id="add-tracking">${t('add_tracking')}</button>
              </div>
            </div>
            <h3 class="form-h">${t('invoice')}</h3>
            ${field(t('invoice_ref'), 'invoice')}
            <h3 class="form-h">${t('delivery_contact')}</h3>
            <div class="row2">
              ${field(t('delivery_company'), 'company')}
              ${field(t('delivery_contact'), 'dcontact')}
              ${field(t('delivery_phone'), 'dphone', true, 'tel')}
              ${field(t('delivery_email'), 'demail', true, 'email')}
            </div>
            <h3 class="form-h">${t('delivery_address')}</h3>
            <div class="row2">
              ${field(t('address'), 'address')}
              ${field(t('address2'), 'address2', false)}
            </div>
            <div class="row3">
              ${field(t('postalcode'), 'zip')}${field(t('postal_place'), 'city')}${field(t('country'), 'country')}
            </div>
            </fieldset>
            <fieldset class="mode" id="personal-fields" hidden disabled>
              <h3 class="form-h">${t('your_details')}</h3>
              <div class="row2">
                ${field(t('first_name'), 'p_first')}
                ${field(t('last_name'), 'p_last')}
                ${field(t('email'), 'p_email', true, 'email')}
                ${field(t('phone'), 'p_phone', true, 'tel')}
              </div>
              <h3 class="form-h">${t('delivery_address')}</h3>
              <div class="row2">
                ${field(t('address'), 'p_address')}
                ${field(t('address2'), 'p_address2', false)}
              </div>
              <div class="row3">
                ${field(t('postalcode'), 'p_zip')}${field(t('postal_place'), 'p_city')}${field(t('country'), 'p_country')}
              </div>
              <h3 class="form-h">${t('payment')}</h3>
              <div class="pay-opts">
                <label class="opt"><input type="radio" name="pay" value="mobilepay" checked><span>MobilePay</span><img class="pay-logo mobilepay" src="assets/icons/mobilepay.png" alt="Mobilepay"></label>
                <label class="opt"><input type="radio" name="pay" value="card"><span>${t('card')}</span><span class="logos"><img class="pay-logo dankort" src="assets/icons/dankort.png" alt="Dankort"><img class="pay-logo visa" src="assets/icons/visa.png" alt="Visa"><img class="pay-logo mastercard" src="assets/icons/mastercard.png" alt="Mastercard"></span></label>
              </div>
              <div class="pay-panel" id="pay-mobilepay">
                <div class="mp-phone"><span class="prefix">+45</span><input type="tel" name="mp_phone" placeholder="*${t('mp_phone')}" inputmode="numeric" pattern="[0-9 ]{8,11}" required aria-label="${t('mp_phone')}"></div>
                <small class="pay-note">${t('mp_note')}</small>
              </div>
              <div class="pay-panel" id="pay-card" hidden>
                <input type="text" name="card_number" required placeholder="*${t('card_number')}" inputmode="numeric" autocomplete="cc-number" pattern="[0-9 ]{13,23}" maxlength="23" aria-label="${t('card_number')}">
                <div class="row3 card-row">
                  <input type="text" name="card_exp" required placeholder="*${t('card_exp')}" inputmode="numeric" autocomplete="cc-exp" pattern="(0[1-9]|1[0-2])\/[0-9]{2}" maxlength="5" aria-label="${t('card_exp_label')}">
                  <input type="text" name="card_cvc" required placeholder="*CVC" inputmode="numeric" autocomplete="cc-csc" pattern="[0-9]{3,4}" maxlength="4" aria-label="CVC">
                  <input type="text" name="card_name" required placeholder="*${t('card_name')}" autocomplete="cc-name" aria-label="${t('card_name')}">
                </div>
                <small class="pay-note">${t('proto_note')}</small>
              </div>
            </fieldset>
          </form>
        </section>
        <section class="summary">
          <h2 class="col-title">${t('products')}</h2>
          <div id="lines"></div>
          <h3 class="form-h">${t('shipping')}</h3>
          <div class="ship-opts" id="ship"></div>
          <hr>
          <div class="sum-box" id="sum"></div>
          <div class="order-actions">
            <a class="btn btn-outline" href="shop.html">${t('keep_shopping')}</a>
            <button class="btn btn-red" type="submit" form="billing" id="place">${t('place_order')}</button>
          </div>
        </section>
      </div>`;

    // Prototype auto-fill: only the company purchase delivery address is filled in
    const addr = { address: 'Jernholmen 49', zip: '2650', city: 'Hvidovre', country: tr('Denmark', 'Danmark') };
    const prefill = addr;   // company purchase only – personal purchase starts empty
    Object.entries(prefill).forEach(([name, value]) => { const f = $(`#billing [name="${name}"]`); if (f && value) f.value = value; });

    // Company / personal toggle: only the active fieldset is enabled (disabled fields are skipped by validation)
    const modes = { company: $('#company-fields'), personal: $('#personal-fields') };
    const payPanels = { mobilepay: $('#pay-mobilepay'), card: $('#pay-card') };
    function setPayment(method) {
      Object.entries(payPanels).forEach(([k, el]) => {
        el.hidden = k !== method;
        $$('input', el).forEach(i => { i.disabled = k !== method; });
      });
    }
    function setMode(mode) {
      Object.entries(modes).forEach(([k, el]) => { el.hidden = k !== mode; el.disabled = k !== mode; });
      $('#place').textContent = mode === 'personal' ? t('pay_place_order') : t('place_order');
      if (mode === 'personal') setPayment($('input[name="pay"]:checked').value);
    }
    $$('input[name="purchase"]').forEach(r => r.addEventListener('change', () => setMode(r.value)));
    $$('input[name="pay"]').forEach(r => r.addEventListener('change', () => setPayment(r.value)));
    // card number grouped in fours, expiry gets its slash
    $('[name="card_number"]').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim(); });
    $('[name="card_exp"]').addEventListener('input', e => { let v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); e.target.value = v; });
    $('[name="card_cvc"]').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); });
    setMode('company');

    // extra tracking emails (only one is shown until the red link is used)
    $('#add-tracking').addEventListener('click', e => {
      const inp = document.createElement('input');
      inp.type = 'email'; inp.name = 'tracking'; inp.placeholder = t('another_tracking'); inp.setAttribute('aria-label', t('another_tracking'));
      e.currentTarget.before(inp);
      inp.focus();
    });

    const lines = $('#lines'), sum = $('#sum'), place = $('#place'), ship = $('#ship');
    let express = false;

    function renderSummary() {
      const items = Cart.lines();
      const sub = Cart.subtotal();
      const shipping = items.length && express ? SHIPPING_EXPRESS : 0;
      const net = sub + shipping, vat = net * VAT_RATE, total = net + vat;
      lines.innerHTML = items.length
        ? items.map(l => lineItemHTML(l)).join('')
        : `<div class="empty">${t('bag_empty')}</div>`;
      ship.innerHTML = `
        <label class="opt"><input type="radio" name="ship" value="std" ${express ? '' : 'checked'}><span>${t('standard')}</span><b>${t('free')}</b></label>
        <label class="opt"><input type="radio" name="ship" value="exp" ${express ? 'checked' : ''}><span>${t('express')}</span><b>+${fmt(SHIPPING_EXPRESS)}</b></label>`;
      sum.innerHTML = `
        <div class="r"><span>${t('products')}</span><span>${fmt(sub)}</span></div>
        ${express ? `<div class="r"><span>${t('express_shipping')}</span><span>${fmt(shipping)}</span></div>` : ''}
        <div><div class="r"><span class="big">${t('sum_total')}</span><span class="amt">${fmt(net)}</span></div><small>${t('excl_vat')}</small></div>
        <div><div class="r"><span class="big">${t('total_incl')}</span><span class="amt">${fmt(total)}</span></div>
          <div class="r"><small>${t('vat_amount')}</small><small>${fmt(vat)}</small></div></div>`;
      place.disabled = !items.length;
    }

    ship.addEventListener('change', e => { express = e.target.value === 'exp'; renderSummary(); });

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
      const personal = $('input[name="purchase"]:checked').value === 'personal';
      Cart.clear();
      $('#app').innerHTML = `
        <div class="wrap confirmation">
          <h1>${t('thanks')}</h1>
          <p>${t('confirm_sent', { email: (personal ? form.elements.p_email : form.elements.email).value.replace(/</g, '&lt;') })}</p>
          <a class="btn btn-red" href="home.html">${t('back_to_shop')}</a>
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
  // first paint: jump straight to the centred slide without animating, then enable transitions
  root.classList.add('init');
  render();
  void root.offsetWidth;
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('init')));
  window.addEventListener('load', render);
}

/* ---------- Breadcrumbs ---------- */
function addBreadcrumbs(page) {
  const esc = t => String(t).replace(/</g, '&lt;');
  let trail = null;
  if (page === 'shop') trail = [[t('home'), 'home.html'], [t('shop')]];
  if (page === 'category') {
    const c = getCat(params.get('cat'));
    const co = collectionInfo(params.get('collection'));
    trail = co ? [[t('home'), 'home.html'], [co.title]] : [[t('home'), 'home.html'], [t('shop'), 'shop.html'], [c ? c.name : t('all_categories')]];
  }
  if (page === 'product') {
    const p = getProduct(params.get('id')) || PRODUCTS[0], c = getCat(p.cat);
    trail = [[t('home'), 'home.html'], [t('shop'), 'shop.html'], [c.name, `category.html?cat=${c.slug}`], [p.name]];
  }
  if (page === 'checkout') trail = [[t('home'), 'home.html'], [t('shop'), 'shop.html'], ['Checkout']];
  if (page === 'search') trail = [[t('home'), 'home.html'], [t('search')]];
  if (!trail) return;
  const items = trail.map(([label, href], i) => i === trail.length - 1
    ? `<li aria-current="page">${esc(label)}</li>`
    : `<li><a href="${href}">${esc(label)}</a></li>`).join('');
  $('#app').insertAdjacentHTML('afterbegin', `<nav class="crumbs" aria-label="${t('breadcrumb')}"><ol>${items}</ol></nav>`);
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  renderHeader();
  // footer removed for now (renderFooter() kept for later)
  pages[page] && pages[page]();
  addBreadcrumbs(page);
  if (page !== 'login') initSupport();
});

/* keep sticky filters below the sticky header */
function syncHeaderHeight() {
  const h = document.querySelector('.site-header');
  if (h) document.documentElement.style.setProperty('--header-h', h.offsetHeight + 'px');
}
window.addEventListener('load', syncHeaderHeight);
window.addEventListener('resize', syncHeaderHeight);

/* ---------- Technical support: round button bottom-right + popover form (prototype, nothing is sent) ---------- */
function initSupport() {
  const NUT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z"/><circle cx="12" cy="12" r="3.6"/></svg>';
  const wrap = document.createElement('div');
  wrap.className = 'support';
  wrap.innerHTML = `
    <section class="support-panel" id="support-panel" role="dialog" aria-modal="false" aria-labelledby="support-title" hidden>
      <header class="support-head">
        <div><h2 id="support-title">${tr('Technical support', 'Teknisk support')}</h2><p>8:00–16:00 CET</p></div>
        <button class="support-x" type="button" aria-label="${tr('Close', 'Luk')}">&times;</button>
      </header>
      <form class="support-form" novalidate>
        <label>${tr('Your name', 'Dit navn')}<input name="name" type="text" placeholder="${tr('Your name', 'Dit navn')}" autocomplete="off" required></label>
        <label>${tr('Your e-mail', 'Din e-mail')}<input name="email" type="email" placeholder="${tr('Your e-mail', 'Din e-mail')}" autocomplete="off" required></label>
        <label>${tr('Your subject', 'Dit emne')}<input name="subject" type="text" placeholder="${tr('Your subject', 'Dit emne')}" autocomplete="off" required></label>
        <label>${tr('Your message', 'Din besked')}<textarea name="message" rows="4" placeholder="${tr('Your message', 'Din besked')}" required></textarea></label>
        <div class="support-actions">
          <button class="btn btn-red" type="submit">${tr('Send', 'Send')}</button>
          <button class="support-cancel" type="button">${tr('Cancel', 'Annuller')}</button>
        </div>
      </form>
      <div class="support-done" hidden>
        <strong>${tr('Thank you!', 'Tak!')}</strong>
        <p>${tr('Your message has been sent to technical support.', 'Din besked er sendt til teknisk support.')}</p>
        <button class="btn btn-red" type="button">${tr('Close', 'Luk')}</button>
      </div>
    </section>
    <button class="support-fab" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="support-panel" aria-label="${tr('Technical support', 'Teknisk support')}" title="${tr('Technical support', 'Teknisk support')}">${NUT}</button>`;
  document.body.appendChild(wrap);
  const panel = $('.support-panel', wrap), fab = $('.support-fab', wrap), form = $('.support-form', wrap), done = $('.support-done', wrap);
  const setOpen = open => {
    panel.hidden = !open; fab.setAttribute('aria-expanded', String(open)); wrap.classList.toggle('open', open);
    if (open) { form.hidden = false; done.hidden = true; $('input', form).focus(); } else fab.focus({ preventScroll: true });
  };
  fab.addEventListener('click', () => setOpen(panel.hidden));
  $('.support-x', wrap).addEventListener('click', () => setOpen(false));
  $('.support-cancel', wrap).addEventListener('click', () => { form.reset(); setOpen(false); });
  $('button', done).addEventListener('click', () => { form.reset(); setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) setOpen(false); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = $$('[required]', form).filter(f => !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)));
    $$('[required]', form).forEach(f => f.classList.toggle('invalid', bad.includes(f)));
    if (bad.length) return bad[0].focus();
    form.hidden = true; done.hidden = false;
  });
}
