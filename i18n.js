/* ==========================================================
   Language support (English / Dansk).
   - LANG is stored in localStorage ("sgl_lang"); English is the default.
   - The login page is always English.
   - All UI texts live in STR below as key: [English, Dansk].
   - Danish product names are in PRODUCT_DA.
   - Search only looks at the active language (name + keywords).
   ========================================================== */
const LANG = (() => {
  if (document.body && document.body.dataset.page === 'login') return 'en';
  try { return localStorage.getItem('sgl_lang') === 'da' ? 'da' : 'en'; } catch { return 'en'; }
})();
document.documentElement.lang = LANG;

const tr = (en, da) => (LANG === 'da' ? da : en);

const STR = {
  // header
  search_ph: ['search...', 'søg...'], search: ['Search', 'Søg'], account: ['Account', 'Konto'], my_bag: ['My bag', 'Min kurv'],
  language: ['Language', 'Sprog'], logo_alt: ['Scan Global Logistics – home', 'Scan Global Logistics – forside'],
  see_all_results: ['See all {n} results', 'Se alle {n} resultater'], no_products_found: ['No products found', 'Ingen produkter fundet'],
  // toast
  added_to_bag: ['Added to your bag', 'Lagt i din kurv'], qty: ['Qty {n}', 'Antal {n}'],
  bag_one: ['Bag ({n} item)', 'Kurv ({n} vare)'], bag_many: ['Bag ({n} items)', 'Kurv ({n} varer)'],
  keep_shopping_lc: ['Keep shopping', 'Fortsæt med at shoppe'], go_to_checkout: ['Go to checkout', 'Gå til checkout'], close: ['Close', 'Luk'],
  // generic
  previous: ['Previous', 'Forrige'], next: ['Next', 'Næste'], prev_cat: ['Previous category', 'Forrige kategori'], next_cat: ['Next category', 'Næste kategori'],
  show_cat: ['Show {name}', 'Vis {name}'], product_categories: ['Product categories', 'Produktkategorier'],
  dec_qty: ['Decrease quantity', 'Mindsk antal'], inc_qty: ['Increase quantity', 'Øg antal'], remove: ['Remove {name}', 'Fjern {name}'],
  // filters
  filters: ['Filters', 'Filtre'], reset_filters: ['Reset filters', 'Nulstil filtre'], sort_by: ['Sort by', 'Sortér efter'],
  recommended: ['Recommended', 'Anbefalet'], price_asc: ['Price: low to high', 'Pris: lav til høj'], price_desc: ['Price: high to low', 'Pris: høj til lav'],
  name_asc: ['Name: A to Z', 'Navn: A til Å'], name_desc: ['Name: Z to A', 'Navn: Å til A'],
  categories: ['Categories', 'Kategorier'], subcategories: ['Subcategories', 'Underkategorier'],
  price_dkk: ['Price (DKK)', 'Pris (DKK)'], price_per_unit: ['Price per unit', 'Pris pr. stk.'], min_price: ['Minimum price', 'Mindstepris'], max_price: ['Maximum price', 'Maksimumpris'],
  from: ['From', 'Fra'], to: ['To', 'Til'],
  // home / shop / category / search
  site_name: ['SGL Internal Shop', 'SGL Intern Shop'], hero_sub: ['Everything you need, all in one place', 'Alt hvad du har brug for, samlet ét sted'],
  browse_products: ['Browse products', 'Se produkter'], browse_by_cat: ['Browse by category:', 'Gennemse efter kategori:'], our_favourites: ['Our favourites:', 'Vores favoritter:'],
  shop: ['Shop', 'Shop'], browse_our_products: ['Browse our products.', 'Gennemse vores produkter.'], see_all_products: ['See all products', 'Se alle produkter'],
  no_match_filters: ['No products match your filters.', 'Ingen produkter matcher dine filtre.'],
  product_one: ['{n} product', '{n} produkt'], product_many: ['{n} products', '{n} produkter'],
  found_one: ['{n} product found', '{n} produkt fundet'], found_many: ['{n} products found', '{n} produkter fundet'],
  results_for: ['Results for “{q}”', 'Resultater for “{q}”'], no_match_search: ['No products match your search.', 'Ingen produkter matcher din søgning.'],
  type_something: ['Type something in the search box.', 'Skriv noget i søgefeltet.'], browse_all: ['Browse all products', 'Se alle produkter'],
  all_categories: ['All categories', 'Alle kategorier'], all_products: ['All products', 'Alle produkter'],
  // product
  prev_image: ['Previous image', 'Forrige billede'], next_image: ['Next image', 'Næste billede'], image_n: ['image {n}', 'billede {n}'],
  add_to_cart: ['Add to cart', 'Læg i kurv'], added: ['Added ✓', 'Tilføjet ✓'], description: ['Description', 'Beskrivelse'], similar: ['Similar products:', 'Lignende produkter:'],
  // checkout
  billing: ['Billing', 'Fakturering'], products: ['Products', 'Produkter'], purchase_type: ['Purchase type', 'Købstype'],
  company_purchase: ['Company purchase', 'Firmakøb'], personal_purchase: ['Personal purchase', 'Privatkøb'],
  contact: ['Contact', 'Kontakt'], contact_person: ['Contact person', 'Kontaktperson'], email: ['Email', 'E-mail'], phone: ['Phone/Mobile', 'Telefon/mobil'],
  tracking_email: ['Email for tracking', 'E-mail til tracking'], add_tracking: ['+ Add another tracking email', '+ Tilføj endnu en tracking-e-mail'], another_tracking: ['Another email for tracking', 'Endnu en e-mail til tracking'],
  invoice: ['Invoice', 'Faktura'], invoice_ref: ['Initials and ref. for invoice', 'Initialer og ref. til faktura'],
  delivery_contact: ['Delivery contact', 'Leveringskontakt'], delivery_company: ['Delivery company name', 'Leveringsfirma'],
  delivery_phone: ['Contact phone for delivery', 'Kontakttelefon til levering'], delivery_email: ['Contact Email for delivery', 'Kontakt-e-mail til levering'],
  delivery_address: ['Delivery address', 'Leveringsadresse'], address: ['Delivery adress', 'Leveringsadresse'], address2: ['Adress 2', 'Adresse 2'],
  postalcode: ['Postalcode', 'Postnummer'], postal_place: ['Postal place', 'By'], country: ['Country', 'Land'],
  your_details: ['Your details', 'Dine oplysninger'], first_name: ['First name', 'Fornavn'], last_name: ['Last name', 'Efternavn'],
  payment: ['Payment', 'Betaling'], card: ['Card', 'Kort'], mp_phone: ['MobilePay phone number', 'MobilePay-telefonnummer'],
  mp_note: ['You will receive a request in the MobilePay app to approve the payment.', 'Du modtager en anmodning i MobilePay-appen, hvor du godkender betalingen.'],
  card_number: ['Card number', 'Kortnummer'], card_exp: ['MM/YY', 'MM/ÅÅ'], card_exp_label: ['Expiry date', 'Udløbsdato'], card_name: ['Name on card', 'Navn på kortet'],
  proto_note: ['Prototype: no real payment is made.', 'Prototype: der gennemføres ingen rigtig betaling.'],
  shipping: ['Shipping', 'Fragt'], standard: ['Standard', 'Standard'], free: ['Free', 'Gratis'], express: ['Express', 'Express'], express_shipping: ['Express shipping', 'Express-fragt'],
  keep_shopping: ['Keep Shopping', 'Fortsæt med at shoppe'], place_order: ['Place order', 'Afgiv ordre'], pay_place_order: ['Pay & place order', 'Betal & afgiv ordre'],
  bag_empty: ['Your bag is empty.', 'Din kurv er tom.'], sum_total: ['SUM TOTAL', 'SUM I ALT'], excl_vat: ['All prices is excl. VAT', 'Alle priser er ekskl. moms'],
  total_incl: ['TOTAL (incl. VAT)', 'I ALT (inkl. moms)'], vat_amount: ['VAT amount', 'Momsbeløb'],
  thanks: ['Thank you for your order', 'Tak for din ordre'], confirm_sent: ['A confirmation has been sent to {email}.', 'En bekræftelse er sendt til {email}.'], back_to_shop: ['Back to shop', 'Tilbage til shoppen'],
  // breadcrumbs
  home: ['Home', 'Hjem'], breadcrumb: ['Breadcrumb', 'Brødkrumme'],
};
const t = (key, vars) => {
  const pair = STR[key];
  let s = pair ? pair[LANG === 'da' ? 1 : 0] : key;
  if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.split('{' + k + '}').join(v); });
  return s;
};
/* count + word, e.g. 1 product / 5 products */
const countOf = (base, n) => t(n === 1 ? base + '_one' : base + '_many', { n });

/* money: 89kr (English) / 89 kr. (Dansk, comma as decimal separator) */
const fmt = n => {
  const v = Number.isInteger(n) ? String(n) : n.toFixed(2);
  return LANG === 'da' ? v.replace('.', ',') + ' kr.' : v + 'kr';
};

/* ---------- Category / sub-group / description texts ---------- */
const CAT_DA = { 'giveaways': 'Giveaways', 'office-deco': 'Kontorindretning', 'printing': 'Tryk on demand', 'office-supplies': 'Kontorartikler' };
const SUB_EN = { 'Event s & fairs': 'Events & fairs', 'Stationary': 'Stationery' };
const SUB_DA = {
  'Event s & fairs': 'Events & messer', 'Exclusive gifts': 'Eksklusive gaver', 'Outdoor & Sports': 'Outdoor & sport', 'Seasonal Items': 'Sæsonartikler',
  'Sweets': 'Slik', 'Travelling': 'Rejser', 'Beachflag': 'Beachflag', 'DNA shop': 'DNA-shop', 'Outdoor deco': 'Udendørsindretning', 'Roll-up': 'Roll-ups',
  'Wall deco': 'Vægdekoration', 'Notebooks and Paper': 'Notesbøger og papir', 'Other': 'Andet', 'Workspace items': 'Arbejdsplads', 'Business Card': 'Visitkort',
  'Company Flyer': 'Virksomhedsflyer', 'Country Flyers': 'Landeflyers', 'IT Flyers': 'IT-flyers', 'Local Flyers': 'Lokale flyers', 'Product Flyers': 'Produktflyers',
  'Stationary': 'Brevpapir & kuverter', 'Stickers': 'Klistermærker', 'Sustainability': 'Bæredygtighed', 'Value-added Services': 'Merværdiydelser', 'Vertical Flyers': 'Branche-flyers',
};
const subLabel = s => (LANG === 'da' ? (SUB_DA[s] || s) : (SUB_EN[s] || s));

const GENERIC_DESC_T = tr(
  'A Scan Global Logistics branded item, available to order through the internal shop. Contact Marcom if you need a custom quantity or a different design.',
  'En vare med Scan Global Logistics-design, som kan bestilles i den interne shop. Kontakt Marcom, hvis du har brug for et særligt antal eller et andet design.');
const SUB_DESC_DA = {
  'Country Flyers': 'A4 "Vidste du"-flyer for et land med en sjov fakta, lokale kontakter og et overblik over de ydelser, vi tilbyder på markedet. Trykkes on demand i det antal, du har brug for.',
  'Product Flyers': 'Trykt produktflyer, der forklarer en af vores ydelser klart og kundeklart. Trykkes on demand i det antal, du har brug for.',
  'Vertical Flyers': 'Trykt flyer til en bestemt branche eller et bestemt event. Trykkes on demand i det antal, du har brug for.',
  'Value-added Services': 'Trykt flyer, der beskriver en af vores merværdiydelser. Trykkes on demand i det antal, du har brug for.',
  'Sustainability': 'Trykt flyer om vores bæredygtige logistikløsninger. Trykkes on demand i det antal, du har brug for.',
  'Business Card': 'Visitkort i Scan Global Logistics-design, trykt med dit navn, din titel og dine kontaktoplysninger.',
  'Stationary': 'Brevpapir og kuverter i Scan Global Logistics-design, trykt on demand.',
  'Roll-up': 'Roll-up banner med bæretaske, der er klar til brug på få sekunder på messer, til events og på kontoret.',
  'DNA shop': 'Brandmateriale, der bringer vores DNA og værdier til live på kontoret eller til events.',
  'Wall deco': 'Vægdekoration, der giver dit kontor Scan Global Logistics-udseendet.',
  'Beachflag': 'Beachflag til udendørs events og indgange. Flag, fod og stang bestilles hver for sig.',
};

/* ---------- Danish product names ---------- */
const PRODUCT_DA = {
 "safety-helmet": "Sikkerhedshjelm",
 "logo-pin": "Logonål",
 "table-flag-set": "Bordflagsæt",
 "usb-flash-drive-gold": "USB-stik, guld",
 "cotton-tote-bag": "Bomuldstaske",
 "adidas-polo-shirt-black": "Adidas poloshirt, sort",
 "golf-polo-shirt": "Golf poloshirt",
 "hoodie-grey": "Hættetrøje, grå",
 "adidas-polo-shirt-navy": "Adidas poloshirt, marineblå",
 "polo-shirt-women-blue-pattern": "Poloshirt, dame, blåmønstret",
 "adidas-performance-polo-black": "Adidas performance polo, sort",
 "callaway-supersoft-golf-balls": "Callaway Supersoft golfbolde",
 "callaway-chrome-tour-x-golf-balls": "Callaway Chrome Tour X golfbolde",
 "golf-tees-100-pack": "Golftees, 100 stk.",
 "golf-towel-olive": "Golfhåndklæde, oliven",
 "golf-towel-blue": "Golfhåndklæde, blå",
 "callaway-chrome-soft-golf-balls": "Callaway Chrome Soft golfbolde",
 "cooler-bag-red": "Køletaske, rød",
 "ice-scraper": "Isskraber",
 "waterproof-phone-pouch": "Vandtæt mobilpose",
 "thermo-cup": "Termokop",
 "water-bottle-black": "Drikkeflaske, sort",
 "sports-bag-black": "Sportstaske, sort",
 "container-mints-red-tin": "Mintdåse, rød",
 "chocolate-experience-tube": "Chokoladetube",
 "caramels-in-bag": "Karameller i pose",
 "twist-mix-sweets": "Twist slikmix",
 "clear-toiletry-bag": "Gennemsigtig toilettaske",
 "leather-luggage-tag": "Bagagemærke i læder",
 "luggage-strap": "Kuffertrem",
 "hand-sanitizer-card": "Håndspritkort",
 "face-mask-black": "Mundbind, sort",
 "beach-flag": "Beachflag",
 "beach-flag-base": "Beachflag-fod",
 "beach-flag-pole": "Beachflag-stang",
 "our-virtues-roll-up-red": "Our Virtues roll-up, rød",
 "our-virtues-roll-up-gold": "Our Virtues roll-up, guld",
 "our-virtues-roll-up-blue": "Our Virtues roll-up, blå",
 "acoustic-panel-our-virtues-180x100-cm": "Akustikpanel, Our Virtues, 180x100 cm",
 "window-sticker-logo": "Vinduesklistermærke, logo",
 "aid-relief-roll-up-2": "Nødhjælp roll-up, 2",
 "aid-relief-roll-up-3": "Nødhjælp roll-up, 3",
 "aid-relief-roll-up": "Nødhjælp roll-up",
 "air-roll-up": "Luftfragt roll-up",
 "alfalfa-roll-up": "Alfalfa roll-up",
 "automotive-roll-up": "Automotive roll-up",
 "customs-roll-up": "Told roll-up",
 "energy-roll-up": "Energi roll-up",
 "fashion-retail-roll-up": "Mode & detail roll-up",
 "food-additives-roll-up": "Fødevaretilsætning roll-up",
 "general-roll-up-white": "Generel roll-up, hvid",
 "general-roll-up-red": "Generel roll-up, rød",
 "general-roll-up-your-choice-1": "Generel roll-up, dit valg, 1",
 "general-roll-up-your-choice-2": "Generel roll-up, dit valg, 2",
 "government-defence-roll-up": "Stat & forsvar roll-up",
 "industrial-projects-roll-up": "Industriprojekter roll-up",
 "marine-roll-up": "Marine roll-up",
 "pharma-healthcare-roll-up": "Pharma & sundhed roll-up",
 "sustainability-roll-up": "Bæredygtighed roll-up",
 "sgl-products-roll-up-1": "SGL-produkter roll-up, 1",
 "sgl-products-roll-up-3": "SGL-produkter roll-up, 3",
 "sgl-products-roll-up-4": "SGL-produkter roll-up, 4",
 "air-sea-roll-up": "Luft-sø roll-up",
 "3d-payoff-wall-sign": "3D payoff-vægskilt",
 "acoustic-panels-120x40-cm": "Akustikpaneler, 120x40 cm",
 "acoustic-panels-120x60-cm": "Akustikpaneler, 120x60 cm",
 "acoustic-panels-60x60-cm": "Akustikpaneler, 60x60 cm",
 "3d-logo-wall-mounted": "3D-logo, vægmonteret",
 "acoustic-panel-asia-map-180x100-cm": "Akustikpanel, Asienkort, 180x100 cm",
 "acoustic-panel-europe-map-110x80-cm": "Akustikpanel, Europakort, 110x80 cm",
 "acoustic-panels-110x180-cm": "Akustikpaneler, 110x180 cm",
 "acoustic-panels-180x110-cm": "Akustikpaneler, 180x110 cm",
 "acoustic-panel-world-map-180x100-cm": "Akustikpanel, verdenskort, 180x100 cm",
 "wallpaper-sgl-red": "Tapet, SGL rød",
 "notebooks-our-promise": "Notesbøger, Our Promise",
 "a4-office-paper-500-sheets": "A4 kontorpapir, 500 ark",
 "high-quality-a4-paper": "A4 papir i høj kvalitet",
 "packaging-tape": "Pakketape",
 "paper-flag": "Papirflag",
 "key-strap-red": "Nøglesnor, rød",
 "hi-vis-vest-yellow": "Refleksvest, gul",
 "fineliner-pen": "Fineliner",
 "ballpoint-pens-white": "Kuglepenne, hvide",
 "mouse-pad-city": "Musemåtte, by",
 "mouse-pad-world-map": "Musemåtte, verdenskort",
 "mouse-pad-containers": "Musemåtte, containere",
 "pallet-notepad": "Palleblok",
 "prodir-pen-white": "Prodir kuglepen, hvid",
 "wireless-charging-pad-10w": "Trådløs oplader, 10W",
 "business-card-standard": "Visitkort, standard",
 "business-card-chinese": "Visitkort, kinesisk",
 "business-card-plastic": "Visitkort, plastik",
 "company-flyer": "Virksomhedsflyer",
 "did-you-know-flyer-cambodia": "Vidste du-flyer, Cambodja",
 "did-you-know-flyer-indonesia": "Vidste du-flyer, Indonesien",
 "did-you-know-flyer-myanmar": "Vidste du-flyer, Myanmar",
 "did-you-know-flyer-netherlands": "Vidste du-flyer, Holland",
 "did-you-know-flyer-norway": "Vidste du-flyer, Norge",
 "did-you-know-flyer-singapore": "Vidste du-flyer, Singapore",
 "did-you-know-flyer-south-africa": "Vidste du-flyer, Sydafrika",
 "did-you-know-flyer-vietnam": "Vidste du-flyer, Vietnam",
 "did-you-know-flyer-colombia": "Vidste du-flyer, Colombia",
 "did-you-know-flyer-china": "Vidste du-flyer, Kina",
 "did-you-know-flyer-spain": "Vidste du-flyer, Spanien",
 "did-you-know-flyer-brazil": "Vidste du-flyer, Brasilien",
 "did-you-know-flyer-turkiye": "Vidste du-flyer, Tyrkiet",
 "did-you-know-flyer-india": "Vidste du-flyer, Indien",
 "did-you-know-flyer-egypt": "Vidste du-flyer, Egypten",
 "did-you-know-flyer-uk": "Vidste du-flyer, Storbritannien",
 "did-you-know-flyer-tanzania": "Vidste du-flyer, Tanzania",
 "did-you-know-flyer-italy": "Vidste du-flyer, Italien",
 "did-you-know-flyer-thailand": "Vidste du-flyer, Thailand",
 "did-you-know-flyer-bangladesh": "Vidste du-flyer, Bangladesh",
 "us-one-pager": "USA one-pager",
 "did-you-know-flyer-france": "Vidste du-flyer, Frankrig",
 "china-tir-trucking-flyer": "Kina TIR vejtransport-flyer",
 "did-you-know-flyer-philippines": "Vidste du-flyer, Filippinerne",
 "did-you-know-flyer-spain-spanish": "Vidste du-flyer, Spanien (spansk)",
 "did-you-know-flyer-new-zealand": "Vidste du-flyer, New Zealand",
 "did-you-know-flyer-malaysia": "Vidste du-flyer, Malaysia",
 "did-you-know-flyer-laos": "Vidste du-flyer, Laos",
 "did-you-know-flyer-sri-lanka": "Vidste du-flyer, Sri Lanka",
 "did-you-know-flyer-usa": "Vidste du-flyer, USA",
 "did-you-know-flyer-hungary": "Vidste du-flyer, Ungarn",
 "did-you-know-flyer-uae": "Vidste du-flyer, UAE",
 "did-you-know-flyer-romania": "Vidste du-flyer, Rumænien",
 "did-you-know-flyer-kenya": "Vidste du-flyer, Kenya",
 "did-you-know-flyer-japan": "Vidste du-flyer, Japan",
 "did-you-know-flyer-denmark": "Vidste du-flyer, Danmark",
 "did-you-know-flyer-finland": "Vidste du-flyer, Finland",
 "did-you-know-flyer-australia": "Vidste du-flyer, Australien",
 "did-you-know-flyer-poland": "Vidste du-flyer, Polen",
 "did-you-know-flyer-south-korea": "Vidste du-flyer, Sydkorea",
 "did-you-know-flyer-argentina": "Vidste du-flyer, Argentina",
 "it-flyer": "IT-flyer",
 "local-flyer": "Lokal flyer",
 "parcel-express-flyer": "Pakke & express-flyer",
 "rail-lcl-fcl-asia-to-germany-flyer-english": "Jernbane LCL/FCL Asien–Tyskland flyer, engelsk",
 "rail-lcl-fcl-asia-to-germany-flyer-german": "Jernbane LCL/FCL Asien–Tyskland flyer, tysk",
 "sea-air-deferred-crd-flyer": "Sø-luft deferred CRD-flyer",
 "sea-air-flyer": "Sø-luft-flyer",
 "sea-air-flyer-sgl": "Sø-luft-flyer, SGL",
 "sea-air-solution-flyer": "Sø-luft løsning-flyer",
 "sea-air-asia-to-europe-flyer": "Sø-luft Asien–Europa flyer",
 "air-sea-eu-to-australia-flyer": "Luft-sø EU–Australien flyer",
 "customs-flyer": "Told-flyer",
 "sea-air-asia-to-europe-via-dubai-flyer": "Sø-luft Asien–Europa via Dubai flyer",
 "fulfilment-distribution-flyer": "Fulfilment & distribution flyer",
 "sea-air-usa-to-australia-flyer": "Sø-luft USA–Australien flyer",
 "printed-material-flyer": "Tryksags-flyer",
 "airfreight-china-to-europe-flyer": "Luftfragt Kina–Europa flyer",
 "letterhead": "Brevpapir",
 "envelope-c4": "Kuvert, C4",
 "envelope-c5": "Kuvert, C5",
 "pallet-sticker": "Palleklistermærke",
 "ocean-biofuel-flyer": "Havfragt biobrændstof-flyer",
 "low-carbon-logistics-flyer-asia": "Lavemissions-logistik flyer, Asien",
 "sustainable-aviation-fuel-flyer": "Bæredygtigt flybrændstof-flyer",
 "sweden-trade-documentation-flyer": "Sverige handelsdokumentation flyer",
 "cbam-trifold-flyer": "CBAM trifold-flyer",
 "cargo-insurance-flyer": "Fragtforsikring-flyer",
 "control-tower-flyer": "Control tower-flyer",
 "dangerous-goods-flyer-lithium-batteries": "Farligt gods flyer, lithiumbatterier",
 "aid-relief-trifold-flyer": "Nødhjælp trifold-flyer",
 "agl-pebble-beach-event-flyer": "AGL Pebble Beach event-flyer",
 "government-defence-trifold-flyer": "Stat & forsvar trifold-flyer",
 "pharma-flyer": "Pharma-flyer",
 "adas-flyer": "ADAS-flyer",
 "atb-neo-flyer": "ATB neo-flyer",
 "multiple-transport-platform-flyer": "Multi-transportplatform flyer",
 "agl-flyer": "AGL-flyer",
 "gats-granada-testing-center-flyer": "GATS Granada testcenter-flyer",
 "gats-two-pager": "GATS two-pager",
 "marine-logistics-flyer": "Marine logistik-flyer",
 "fairs-events-two-pager": "Messer & events two-pager",
 "government-defence-flyer": "Stat & forsvar-flyer",
 "renewable-energy-flyer": "Vedvarende energi-flyer"
};

/* ---------- Keywords: only the words of the active language are searchable ----------
   Words that only exist in Danish are listed here; every other keyword counts as English.
   SHARED words (brand terms, same in both languages) work in both languages. */
const DA_ONLY = new Set(['akustikplade','bagage','bagagemærke','bil','bordflag','brasilien','brevpapir','chokolade','dame','danmark','desinfektion','drikkeflaske','egypten','england','filippinerne','firma','fod','frankrig','golfbolde','holland','håndklæde','håndsprit','indien','isskraber','italien','karameller','kina','kinesisk','klistermærke','kontorpapir','kop','kort','kuffertbånd','kuglepen','kuvert','køletaske','mundbind','musemåtte','norge','notesblok','notesbog','nål','nøglesnor','oplader','pakketape','palleblok','papir','papirflag','plastik','polen','pose','refleksvest','rumænien','skjorte','slik','spanien','sportstaske','stang','sydafrika','sydkorea','tapet','taske','telefon','termo','termokop','toilettaske','trøje','tyrkiet','ungarn','vandflaske','vinduesklistermærke','visitkort']);
const SHARED = new Set(['banner','beachflag','brochure','flyer','golf','logo','polo','rollup','tee','usa','usb','tshirt','totebag','thermos','flag','land','sticker','saf']);

if (typeof PRODUCTS !== 'undefined') {
  PRODUCTS.forEach(p => {
    const toks = (p.keywords || '').split(/\s+/).filter(Boolean);
    p.name_en = p.name;
    if (LANG === 'da') {
      p.name = PRODUCT_DA[p.id] || p.name;
      p.keywords = toks.filter(w => DA_ONLY.has(w) || SHARED.has(w)).join(' ');
    } else {
      p.keywords = toks.filter(w => !DA_ONLY.has(w)).join(' ');
    }
  });
}

/* ---------- Language switcher (flag dropdown in the header) ---------- */
function setLang(code) {
  try { localStorage.setItem('sgl_lang', code); } catch {}
  location.reload();
}
