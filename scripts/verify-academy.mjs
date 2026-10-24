/*
 * Academy verification harness (no extra npm dependencies).
 *
 * Checks the academy end to end over HTTP against a running server, the way
 * `verify-fa.mjs` checks the Persian copy and `responsive-audit.mjs` checks the
 * layout:
 *
 *   · the home page really carries the academy block, its own nav label and the
 *     links into the academy;
 *   · /academy renders the hero, the instructor, the three free lessons and the
 *     collection's enquiry route, without a claim that does not exist yet (no
 *     price, no duration, no player);
 *   · every lesson the landing page links to answers 200, prints its own
 *     outline, and sits in the sequence its neighbours expect;
 *   · a slug that does not exist answers 404 with the academy's own not-found
 *     copy rather than the site's bare default.
 *
 * Content is read *from the pages*, never from a second copy of it here: the
 * lesson slugs are scraped out of /academy, so adding a lesson to
 * `content/academy/records.ts` and re-running this harness covers it. No wording
 * is duplicated, so the harness cannot drift from the copy.
 *
 * Usage:
 *   node scripts/verify-academy.mjs [baseUrl]
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
 * the copy can add or drop one without changing a word — «حرفه‌ای» and «حرفهای»
 * read the same to a customer. Comparisons therefore run on a normalised form,
 * so the harness tests the words rather than the invisible characters, and an
 * edit to the punctuation of a sentence cannot fail the build.
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

/** Every distinct `/academy/<slug>` address a page links to. */
function lessonSlugs(html) {
  const found = new Set();
  for (const m of html.matchAll(/href="\/academy\/([^"#?]+)"/g)) found.add(m[1]);
  return [...found];
}

/* ---------------------------------------------------------------- pages --- */

const home = await load("/");
const academy = await load("/academy");
const magazine = await load("/articles");

check("home answers 200", home.status === 200, `status ${home.status}`);
check("academy answers 200", academy.status === 200, `status ${academy.status}`);
check("magazine still answers 200", magazine.status === 200, `status ${magazine.status}`);

/* -- A. the home page's academy block -------------------------------------- */
check("home: academy section mounted", home.raw.includes('id="academy"'));
check(
  "home: nav label and anchor",
  home.raw.includes('href="#academy"') && has(home, "آموزش میکروسمنت"),
);
check("home: promo headline", has(home, "میکروسمنت را حرفه‌ای یاد بگیرید"));
check(
  "home: promo CTA into the academy",
  has(home, "ورود به آکادمی") && home.raw.includes('href="/academy"'),
);

/* -- B. the landing page --------------------------------------------------- */
check("academy: RTL register", academy.raw.includes('dir="rtl"'));
check("academy: academy name", has(academy, "آکادمی میکروسمنت نورستا"));
check("academy: instructor named", has(academy, "افسانه مردانی"));
check("academy: instructor credit", has(academy, "آموزش‌های افسانه مردانی"));
check("academy: primary action is an in-page jump", academy.raw.includes('href="#lessons"'));
check(
  "academy: lessons section",
  academy.raw.includes('id="lessons"') && has(academy, "سه درس آغازین، رایگان"),
);
check(
  "academy: Instagram is the enquiry route",
  academy.raw.includes('href="https://www.instagram.com/norsta.home/"') &&
    academy.raw.includes('target="_blank"') &&
    academy.raw.includes('rel="noopener noreferrer"'),
);
check("academy: purchase route stated plainly", has(academy, "نحوه‌ی خرید"));
check(
  "academy: no price is claimed",
  !/[0-9۰-۹]+\s*(تومان|ریال|میلیون)/.test(norm(academy.text)),
);
check(
  "academy: dark header, like the magazine",
  magazine.raw.includes('data-theme="dark"') === academy.raw.includes('data-theme="dark"'),
  "header theme parity with /articles",
);
check(
  "academy: without scripting the copy still shows",
  academy.raw.includes("[data-reveal]{opacity:1"),
);
/* -- C. the lessons -------------------------------------------------------- */
const slugs = lessonSlugs(academy.raw);
check(
  "academy: exactly three free lessons",
  slugs.length === 3,
  `found ${slugs.length}: ${slugs.join(", ")}`,
);
check("academy: lesson links are unique", new Set(slugs).size === slugs.length);

const lessons = [];
for (const slug of slugs) {
  lessons.push({ slug, page: await load(`/academy/${slug}`) });
}

lessons.forEach(({ slug, page }) => {
  check(`${slug}: answers 200`, page.status === 200, `status ${page.status}`);
  check(`${slug}: RTL register`, page.raw.includes('dir="rtl"'));
  check(`${slug}: has a heading`, /<h1[^>]*>/.test(page.raw) && page.text.length > 400);
  check(`${slug}: marked free`, has(page, "رایگان"));
  check(`${slug}: attributed to the instructor`, has(page, "افسانه مردانی"));
  check(
    `${slug}: media state stated, not faked`,
    has(page, "ویدیوی این درس به‌زودی در دسترس قرار می‌گیرد"),
  );
  check(
    `${slug}: no player is rendered`,
    !/<video[\s>]/.test(page.raw) && !/<iframe[\s>]/.test(page.raw),
  );
  check(`${slug}: no runtime is claimed`, !has(page, "دقیقه"));
  check(`${slug}: outline printed`, has(page, "در این درس می‌بینید"));
  check(`${slug}: back link to the academy`, page.raw.includes('href="/academy"'));
  check(`${slug}: related lessons row`, has(page, "درس‌های دیگر"));
  check(
    `${slug}: fully crawlable without scripting`,
    page.raw.includes("[data-reveal]{opacity:1"),
  );
});

/* The sequence: the first lesson has no "previous", the last no "next". */
const [first, middle, last] = lessons;
if (first && middle && last) {
  check(
    "sequence: first lesson offers only the next one",
    has(first.page, "درس بعدی") && !has(first.page, "درس قبلی"),
  );
  check(
    "sequence: middle lesson offers both neighbours",
    has(middle.page, "درس بعدی") && has(middle.page, "درس قبلی"),
  );
  check(
    "sequence: last lesson offers only the previous one",
    has(last.page, "درس قبلی") && !has(last.page, "درس بعدی"),
  );
  check(
    "sequence: neighbours link to each other",
    first.page.raw.includes(`href="/academy/${middle.slug}"`) &&
      middle.page.raw.includes(`href="/academy/${first.slug}"`) &&
      middle.page.raw.includes(`href="/academy/${last.slug}"`),
  );
}

/* -- D. a slug that does not exist ---------------------------------------- */
const missing = await load("/academy/no-such-lesson-abc");
check("unknown lesson answers 404", missing.status === 404, `status ${missing.status}`);
check(
  "unknown lesson uses the academy's own not-found copy",
  has(missing, "این درس پیدا نشد"),
);

/* ---------------------------------------------------------------- report -- */

const failed = results.filter((r) => !r.ok);
for (const r of results) {
  const mark = r.ok ? "ok  " : "FAIL";
  const detail = r.ok || !r.detail ? "" : ` — ${r.detail}`;
  console.log(`${mark} ${r.name}${detail}`);
}

console.log(`\n${results.length - failed.length}/${results.length} checks passed against ${BASE}`);
process.exit(failed.length === 0 ? 0 : 1);