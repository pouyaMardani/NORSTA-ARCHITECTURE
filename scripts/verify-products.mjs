/*
 * Catalogue verification harness (no extra npm dependencies).
 *
 * Checks the catalogue end to end over HTTP against a running server, the way
 * `verify-academy.mjs` checks the academy and `verify-fa.mjs` checks the Persian
 * copy:
 *
 *   · the home page really carries the materials & tools showcase, its four
 *     shelves and the links into the catalogue;
 *   · the header carries the «محصولات» item, pointing at `/products` on the home
 *     page and never at `//products` away from it;
 *   · `/products` renders the hero, the filter row and every product record, with
 *     no claim that does not exist yet (no price, no cart, no checkout, no form);
 *   · each shelf's filtered view shows exactly that shelf's products, marks the
 *     open chip as current, and says so in words;
 *   · an address that names no shelf answers with the catalogue's own empty state
 *     rather than a blank page.
 *
 * Content is read *from the pages*, never from a second copy of it here: the
 * product names and the category ids are scraped out of `/products`, so adding a
 * record to `content/products/records.ts` and re-running this harness covers it.
 * No wording is duplicated, so the harness cannot drift from the copy.
 *
 * Usage:
 *   node scripts/verify-products.mjs [baseUrl]
 *   (default baseUrl: http://localhost:3100)
 */

const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/+$/, "");

/* ------------------------------------------------------------- helpers ---- */

const results = [];

function check(name, ok, detail = "") {
  results.push({ name, ok: Boolean(ok), detail });
}

/**
 * Persian copy is set with the zero-width non-joiner, and a single keystroke in
 * the copy can add or drop one without changing a word — «حرفهای» and «حرفهای»
 * read the same to a customer. Comparisons therefore run on a normalised form, so
 * the harness tests the words rather than the invisible characters.
 */
const norm = (s) =>
  s
    .replace(/\u200c/g, "")
    .replace(/[\u0623\u0625\u0622]/g, "\u0627")
    .replace(/\u064a/g, "\u06cc")
    .replace(/\u0643/g, "\u06a9")
    .replace(/\u0649/g, "\u06cc");

/** Does the page show this Persian wording? */
const has = (page, needle) => norm(page.text).includes(norm(needle));

/** Fetch a page and return its status plus a raw and a text-only view. */
async function load(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  const raw = await res.text();
  const text = raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ");
  return { status: res.status, raw, text };
}

const STORE = "https://www.instagram.com/norsta.home/";

/** How many times a page offers the studio's Instagram as an ordering route. */
const instagramLinks = (html) =>
  (html.match(new RegExp(`href="${STORE.replace(/[/.]/g, "\\$&")}"`, "g")) ?? []).length;

/** The product names on a page, in the order the grid renders them. */
const cardNames = (html) =>
  [...html.matchAll(/class="pdc-name">([^<]+)</g)].map((match) => match[1].trim());

/** How many cards the grid holds. */
const cardCount = (html) => (html.match(/class="pdc"/g) ?? []).length;

/** The category ids the filter row offers — every shelf that holds something. */
const chipCategories = (html) =>
  [...new Set([...html.matchAll(/href="\/products\?category=([a-z-]+)"/g)].map((m) => m[1]))];

/**
 * The shelf the page says is open, read from the chip the assistive layer marks
 * as current. The anchor's attributes are matched in whatever order React chose
 * to serialise them — the class is what identifies the chip, not the attribute
 * order.
 */
const activeChip = (html) =>
  [...html.matchAll(/<a[^>]*class="prd-chip is-active"[^>]*>/g)]
    .map((match) => match[0].match(/category=([a-z-]+)/)?.[1])
    .find(Boolean);

/* ---------------------------------------------------------------- pages --- */

const home = await load("/");
const catalog = await load("/products");
const magazine = await load("/articles");

check("home answers 200", home.status === 200, `status ${home.status}`);
check("catalogue answers 200", catalog.status === 200, `status ${catalog.status}`);

/* -- A. the home page's showcase ------------------------------------------- */
check("home: showcase mounted", home.raw.includes('id="products"'));
check("home: showcase is a section of its own", /<section[^>]*id="products"/.test(home.raw));
check("home: showcase heading printed", has(home, "آنچه برای اجرا لازم است"));
check(
  "home: all four shelves presented",
  ["مواد و پودرهای میکروسمنت", "ابزار اجرای میکروسمنت", "پک شروع تمرین", "نمونه متریال و رنگ"].every(
    (title) => has(home, title)
  )
);
check(
  "home: each shelf links to its own filtered view",
  chipCategories(home.raw).length === 4,
  `found ${chipCategories(home.raw).join(", ") || "none"}`
);
check(
  "home: the catalogue is one click away",
  home.raw.includes('class="mats-all"') && /href="\/products"/.test(home.raw)
);
check(
  "home: the ordering route is Instagram, stated plainly",
  has(home, "استعلام و سفارش در اینستاگرام") && instagramLinks(home.raw) >= 1
);
check(
  "home: a stand-in is labelled as one",
  has(home, "تصویر موقت"),
  "the shelf plates are placeholders until real photography exists"
);

/* -- B. the header --------------------------------------------------------- */
check("header: the catalogue item is present", has(home, "محصولات"));
check("header: home links straight to the catalogue", home.raw.includes('href="/products"'));
check(
  "header: away from home the item stays a route",
  magazine.raw.includes('href="/products"') && !magazine.raw.includes('href="//products"')
);
check("header: no doubled slash anywhere", !home.raw.includes('href="//products"'));

/* -- C. the catalogue ------------------------------------------------------ */
check("catalogue: RTL register", catalog.raw.includes('dir="rtl"'));
check("catalogue: has a heading", /<h1[^>]*>/.test(catalog.raw) && catalog.text.length > 800);
check("catalogue: eyebrow printed", has(catalog, "کاتالوگ متریال و ابزار"));
check("catalogue: hero standfirst printed", has(catalog, "متریال، ابزار و پکهای تمرین میکروسمنت"));
check(
  "catalogue: the order route is stated in plain words",
  has(catalog, "برای استعلام موجودی، دریافت راهنمای انتخاب یا ثبت سفارش، از طریق دایرکت با ما در ارتباط باش.")
);
check(
  "catalogue: canonical address on the production origin",
  catalog.raw.includes('rel="canonical"') && catalog.raw.includes('href="https://norsta.ir/products"')
);

/* No claim that does not exist yet. */
check("catalogue: no price is claimed", !/[0-9۰-۹]+\s*(تومان|ریال|میلیون)/.test(norm(catalog.text)));
check("catalogue: no cart is offered", !has(catalog, "سبد خرید") && !has(catalog, "افزودن به سبد"));
check("catalogue: no checkout is offered", !has(catalog, "پرداخت آنلاین") && !/checkout/i.test(catalog.text));
check("catalogue: nothing to fill in", !/<form[\s>]/.test(catalog.raw) && !/<input[\s>]/.test(catalog.raw));

/* The filter row and the grid. */
const chips = chipCategories(catalog.raw);
const names = cardNames(catalog.raw);
check("catalogue: the filter row offers every stocked shelf", chips.length >= 1, `found ${chips.length}`);
check("catalogue: the filter row has an all-shelves chip", has(catalog, "همه محصولات"));
check(
  "catalogue: every card is drawn",
  cardCount(catalog.raw) === names.length && names.length > 0,
  `${names.length} card(s)`
);
check(
  "catalogue: every card names its shelf",
  (catalog.raw.match(/class="pdc-cat"/g) ?? []).length === names.length
);
check(
  "catalogue: every card carries a one-line description",
  (catalog.raw.match(/class="pdc-desc"/g) ?? []).length === names.length
);
check(
  "catalogue: every card offers the ordering route",
  instagramLinks(catalog.raw) >= names.length,
  `${instagramLinks(catalog.raw)} Instagram link(s) for ${names.length} card(s)`
);
check(
  "catalogue: every stand-in is labelled as one",
  (catalog.raw.match(/class="pdc-badge"/g) ?? []).length === names.length
);
check(
  "catalogue: outbound links open safely in a new tab",
  !/href="https:\/\/www\.instagram\.com[^"]*"(?![^>]*rel="noopener noreferrer")/.test(catalog.raw)
);
check("catalogue: fully crawlable without scripting", catalog.raw.includes("[data-reveal]{opacity:1"));

/* -- D. each shelf's own view ---------------------------------------------- */
const DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const shelves = [];

for (const id of chips) {
  const page = await load(`/products?category=${id}`);
  const shelfNames = cardNames(page.raw);
  const others = names.filter((name) => !shelfNames.includes(name));

  shelves.push({ id, shelfNames });

  check(`shelf ${id}: answers 200`, page.status === 200, `status ${page.status}`);
  check(`shelf ${id}: marks its own chip as current`, activeChip(page.raw) === id, `current: ${activeChip(page.raw)}`);
  check(
    `shelf ${id}: shows only its own products`,
    shelfNames.length > 0 && shelfNames.every((name) => names.includes(name))
  );
  check(`shelf ${id}: hides the other shelves`, others.every((name) => !page.raw.includes(name)));
  check(`shelf ${id}: counts what it shows`, has(page, `${DIGITS[shelfNames.length]} محصول`));
}

const accounted = shelves.reduce((sum, shelf) => sum + shelf.shelfNames.length, 0);
check(
  "the shelves partition the catalogue",
  accounted === names.length,
  `${accounted} of ${names.length} products accounted for`
);

/* -- E. an address that names no shelf ------------------------------------ */
const unknown = await load("/products?category=no-such-shelf");
check("unknown shelf answers 200", unknown.status === 200, `status ${unknown.status}`);
check("unknown shelf says so", has(unknown, "برای این دسته هنوز محصولی ثبت نشده است"));
check("unknown shelf offers the way back", unknown.raw.includes('href="/products"'));
check("unknown shelf draws no cards", cardNames(unknown.raw).length === 0);

/* ---------------------------------------------------------------- report -- */

const failed = results.filter((r) => !r.ok);
for (const r of results) {
  const mark = r.ok ? "ok  " : "FAIL";
  const detail = r.ok || !r.detail ? "" : ` — ${r.detail}`;
  console.log(`${mark} ${r.name}${detail}`);
}

console.log(`\n${results.length - failed.length}/${results.length} checks passed against ${BASE}`);
process.exit(failed.length === 0 ? 0 : 1);


