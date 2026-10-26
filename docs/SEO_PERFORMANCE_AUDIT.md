# SEO, performance and accessibility audit — Norsta

Date: 2026-10-25 · Build: `npm run build` (Next 15.5, App Router, fully prerendered)
Scope: metadata and crawlability, Core Web Vitals, structured data, technical
hygiene, accessible names and targets. No visual design, copy, layout or route
was changed; the one behavioural change (a redirect status code) is called out in
§F and is reversible with one word.

---

## A. Executive summary

The site renders well and its copy is clean, but **nothing in it spoke to a
crawler**. Before this audit the served HTML contained:

* **no canonical link on any route** — 0 of 11 measured routes;
* **no `og:*` tags at all on the home page, the magazine archive and the academy
  landing page**, and no `og:url`, `og:image` or `og:site_name` anywhere;
* **`http://localhost:3000/...` inside the share metadata of every page that did
  have an image** — the classic symptom of a missing `metadataBase`, which would
  have made every social share of a lesson or project request its preview image
  from the author's laptop;
* **no JSON-LD, no `robots.txt` and no `sitemap.xml`** — `/robots.txt` and
  `/sitemap.xml` both answered 404;
* `/projects` answered **307** (temporary) while pointing at the home page's
  gallery forever.

All five are now fixed at the source (one place per fact, generated from the same
content modules the pages render), and verified against a production build.

Performance and accessibility came out **better than expected and needed no
repair**: every image carries alt text, every route has exactly one `h1` and all
four landmarks, layout shift is effectively zero (CLS 0.002–0.006 on the home
page across runs, 0.000 elsewhere), and there is no unnamed, focusable control on
any measured route. The real weight is a **cold-cache payload of 776 KB on the
home page**,
of which the hero video is 419 KB and the three fonts are 194 KB — both are
deliberate design decisions (documented in `components/Hero.tsx` and
`app/layout.tsx`), so they are reported with numbers and left alone.

Two things needed a decision from the studio rather than from code: **the contact
block carried the reference studio's identity** (a Copenhagen address and
`studio@monolithatelier.com`, while the copy, the Instagram handle and the
package name said Norsta) — a later brand pass removed both rather than
re-pointing them (see §F3) — and **the home page, the magazine and the academy
have no share image**, because there is no 1200×630 plate in the repository to
point at.

---

## B. Scope, method and how to reproduce

Everything measured here was measured against a **production build served by
`next start`**, never the dev server, and the harness lives in the gitignored
`_ref/audit/` directory.

```powershell
npm run build                       # writes .next
npx next start -p 3100              # serve the build (a separate shell)
node _ref/audit/measure.mjs baseline-warm   # crawl + browser pass, 11 routes
node _ref/audit/seo-table.mjs  baseline-warm
node _ref/audit/img-table.mjs  baseline-warm
node _ref/audit/verify.mjs                  # metadata assertions, live server
node scripts/probe.mjs http://127.0.0.1:3100/ 1280 900 _ref/audit/probe-net.js --settle=6000
```

The harness is two passes per route:

1. **`fetch()` of the raw HTML** — what a crawler that does not run JavaScript
   receives: title, description, canonical, robots, `og:*`, `twitter:*`, JSON-LD,
   heading counts, image `alt`s, preloads, response headers.
2. **A real Chromium over CDP** (`scripts/lib/cdp.mjs`) — LCP, FCP, CLS, TTFB,
   long tasks, request count and transfer by type, per-image loading audit,
   accessible names, landmark coverage, console errors.

### Measurement caveats (read these before quoting a number)

* **One cold run per route, in a fixed order.** The browser profile is thrown away
  between runs, so the *first* route measured (`/`) is cold-cached and every later
  route benefits from a warm cache. Route-to-route comparisons are therefore only
  meaningful against the same order in the other run — which is what the baseline
  and "after" runs use.
* **Deltas under ~300 ms are noise.** These are single samples taken on a Windows
  workstation while other commands were running against the same local server;
  TTFB on the same URL moved between 33 ms and 198 ms across runs.
* **`measure.mjs`'s `byType` buckets group by the browser's *initiator* type** —
  the three WOFF2 files are initiated by CSS, so they land in the `css` bucket.
  The authoritative per-resource breakdown comes from `probe-net.js`, which reads
  the browser's own Resource Timing entries.
* Image `naturalWidth`, `aboveFold` and the `lazyAboveFold` count are read *after*
  the reveal system has run, so they describe the settled page.
* Server responses are compressed with gzip by `next start`; a deployment behind a
  CDN will usually negotiate brotli and be somewhat smaller than the transfer
  numbers quoted below.

## C. Findings

`S` = severity, `Status` = what this audit did about it.

| # | S | Finding (evidence) | Status |
|---|:-:|--------------------|--------|
| F1 | **P0** | **`metadataBase` unset, so every absolute URL in the share metadata pointed at `http://localhost:3000`.** Served HTML on `/projects/minimal-residence` and `/academy/what-is-microcement` carried `<meta property="og:image" content="http://localhost:3000/images/project-minimal-residence.png">`, `twitter:image` the same, and no `og:url` at all. | **Fixed** — `lib/site.ts` + `metadataBase` in `app/layout.tsx`; verified with `NEXT_PUBLIC_SITE_URL` set: 0 localhost strings in the HTML of all 11 routes. |
| F2 | **P0** | **No canonical link on any route** (`0/11`). Duplicate-host, `www`/non-`www`, trailing-slash and `?category=` variants had nothing telling a search engine which address is the page. | **Fixed** — canonical per route; the archive canonicalises the filtered views to `/articles`; the 404 deliberately has none. |
| F3 | **P1** | **No `og:*` tags at all on `/`, `/articles` and `/academy`** (0 tags), and no `og:url`, `og:site_name` or `og:locale` anywhere in the site. Article pages carried only `og:title`, `og:description`, `og:type` and `article:published_time` — **no `og:image`** — so the magazine's shares showed a bare link. | **Fixed** — 6 `og:*` tags on index pages, 8 on every article / lesson / project page (including `og:image` + `og:image:alt`). |
| F4 | **P1** | **No JSON-LD anywhere** (0 blocks on all 11 routes): no publisher identity, no `WebSite`, no `Article`, no `LearningResource`, no `CreativeWork`. | **Fixed** — `Organization` + `WebSite` site-wide, plus one page node per article / lesson / project (see §F). |
| F5 | **P1** | **`/robots.txt` and `/sitemap.xml` both answered 404.** A crawler had no declared entry point and no sitemap. | **Fixed** — `app/robots.ts` (allow all; `Disallow: /` on Vercel previews) and `app/sitemap.ts` (generated from the content modules — 22 URLs when this was written, 23 since §F6). |
| F6 | **P1** | **`twitter:card=summary` was emitted on article pages even though a cover image existed**, which renders a small square card instead of the wide one. | **Fixed** — `summary_large_image` wherever an image exists, `summary` where none does. |
| F7 | **P2** | **`/projects` answered 307** (temporary) although the relocation to the home page's gallery is permanent — a temporary hop invites crawlers to keep the segment in the index. | **Fixed** (behavioural, one word: `redirect` → `permanentRedirect`, now 308 — revert by restoring the import). |
| F8 | **P2** | **There is no `app/not-found.tsx` at the root**, so the site's 404 is Next's default: an English `404: This page could not be found.` body with no header, footer, `main` landmark or `dir`. The three segments each have a styled 404 and the three detail pages know a missing slug. The response already carries `404` + `noindex`, so this is a brand/UX gap rather than an indexing one. | **Reported** — a new page is a design and copy decision; sketch in §H. |
| F9 | **P2** | **The magazine archive cannot be edge-cached.** `/articles` is rendered on demand (`cache-control: private, no-cache, no-store`) because it reads `searchParams` for `?category=`, so its TTFB is server-bound and no CDN can absorb a spike; the other routes are prerendered (`s-maxage=31536000`). | **Reported** — the fix (client-side filtering, or a per-category prerender) is a behaviour change. |
| F10 | **P2** | **`x-powered-by: Next.js` on every response, and no `X-Content-Type-Options`, `Referrer-Policy` or `X-Frame-Options`.** | **Fixed** — `poweredByHeader: false` plus three header rules in `next.config.ts`; verified on HTML, hashed assets and `/sitemap.xml`. |
| F11 | **P2** | **The visible contact block still names the reference studio**: `خیابان بردگید 47، 1260 کپنهاگ، دانمارک` linking to `maps.google.com/?q=Bredgade+47…` and a `mailto:studio@monolithatelier.com`; `package.json` is still named `monolith-atelier`. Everything else (copy, titles, `instagram.com/norsta.home`) says Norsta. | **Fixed** (2026-10-25 brand pass, §F3) — the address, the Google Maps link and the `mailto:` were removed rather than re-pointed, and the contact block now names the studio's own Instagram account (`@norsta.home`), the route the showcase and the academy already use. `package.json` and `package-lock.json` are now `norsta`. The structured data states **no** address, telephone or e-mail, because none has been supplied. |
| F12 | **P2** | **The home page, the magazine archive and the academy landing page have no share image.** No 1200×630 plate exists in `public/images/`, and the stills that do are 0.6–6.2 MB PNGs (`hero-villa.png` is 6.2 MB), which a social crawler should not be sent. | **Reported** — the wiring is ready: one `images: […]` entry per section layout (§H). |
| F13 | **P2** | **The mobile navigation needs JavaScript to open.** `.nav-links` is `opacity:0; visibility:hidden; pointer-events:none` until `.nav[data-menu-open="true"]`, an attribute only `components/SiteInteractions.tsx` sets; the served markup carries no fallback. (The reveal system, by contrast, ships `<noscript>` rules per segment.) | **Reported** — a no-JS menu is a design decision; the reference behaves the same way. |
| F14 | **P3** | **`NOTES.md` §4 describes a hero poster that no longer exists** ("the poster attribute points at `hero-villa-poster.jpg`"), while `components/Hero.tsx` deliberately ships **no** poster and explains why. Documentation drift around an intentional decision. | **Reported** — the code is the current truth; the note needs updating. |
| F15 | **P3** | **Four document titles are short for a result page** (11–23 characters): `NORSTA HOME`, `مجله نورستا`, `آکادمی میکروسمنت نورستا`, `پروژه‌های نورستا`. Every title in the site is unique, and the twelve article titles (49–66 chars) and three lesson titles (61–66) are well sized. | **Reported** — lengthening them is a copy decision; the pattern is already in place (`%s | مجله نورستا`). |
| F16 | **P3** | No `<meta name="theme-color">`, so mobile browser chrome does not match the site's ivory/charcoal ground. | **Reported**. |
| F17 | **P3** | **The three font files are the second-heaviest thing on the page: 194 KB transfer, cold** — the self-hosted Persian variable face alone is 109 KB (weights 100–900), Cormorant Garamond 48 KB, Inter 37 KB. | **Reported** — subsetting the Persian face is an asset-pipeline change that needs a glyph-coverage decision. |
| F18 | **P3** | **One 91 KB (17 KB gzip) render-blocking stylesheet.** On a cold home-page load the HTML arrives at 33 ms but first paint waits until 788 ms: roughly 700 ms is CSS + font + script blocking. | **Reported** — splitting per route is a refactor with visual risk; out of scope here. |
| F19 | **P3** | **The hero video is the LCP element** (419 KB, `preload="auto"`, no poster) and accounts for 419 KB of the home page's 776 KB cold transfer. | **Reported** — deliberate: `Hero.tsx` explains that a poster "would have shown a second, unrelated picture for a moment first". |
| F20 | **P3** | Three of the archive's card images (and one on the academy landing page) are `loading="lazy"` while sitting in the first viewport; the LCP on those routes is text (`p.art-page-lede`, 176–200 ms), so the cost is small. | **Reported** — eager-loading a whole grid trades LCP for bandwidth; left as designed. |
| F21 | **—** | **Checked and clean**: no image anywhere lacks `alt` (0 of 28 on the home page, 0 on every other route); exactly one `h1` per route; `header`/`nav`/`main`/`footer` landmarks on every route; a `:focus-visible` rule and a `prefers-reduced-motion` rule are present; 0 console errors and 0 script errors (apart from the expected 404 fetch on a missing route); CLS ≤ 0.006. | **No action** |
| F22 | **—** | **Measured, judged correct, left alone**: no `dir` on `<html>` — deliberate (`app/layout.tsx`: "No `dir` attribute is set: the page intentionally stays LTR"), with `dir="rtl"` on each section wrapper; no `hreflang` (single-language site); the lightbox's `<img alt="">` is decorative while closed and receives its caption on open; the two sub-24 px targets on the home page are an inline address link inside a sentence and the wordmark, whose nearest neighbour is far away (both covered by the WCAG 2.5.8 inline/spacing exceptions); and the nine "unnamed controls" a naive mobile scan reports are the closed menu drawer, which `visibility:hidden` removes from the accessibility tree. | **No action** |

## D. Baseline measurements

### D1. What a crawler received (production build, before any change)

| route | title chars | desc chars | canonical | `og:*` | `twitter:*` | JSON-LD |
|---|--:|--:|:-:|--:|--:|--:|
| `/` | 11 | 61 | — | 0 | 0 | 0 |
| `/articles` | 11 | 143 | — | 0 | 0 | 0 |
| `/articles/what-is-microcement` | 61 | 137 | — | 3 | 3 (`card=summary`) | 0 |
| `/academy` | 23 | 142 | — | 0 | 0 | 0 |
| `/academy/what-is-microcement` | 66 | 134 | — | 5 | 5 (`card=summary_large_image`) | 0 |
| `/projects/minimal-residence` | 49 | 134 | — | 5 | 5 (`card=summary_large_image`) | 0 |
| `/projects` | — (307 → `/#work`) | — | — | — | — | — |
| `/definitely-missing-route` | 34 (Next's default English 404) | 61 (the home page's) | — | 0 | 0 | 0 |
| `/robots.txt`, `/sitemap.xml` | 404 | 404 | — | — | — | — |

Two details behind that table:

* the `og:image` in the five-tag pages resolved to
  `http://localhost:3000/images/<cover>.png` — a raw 651 KB PNG, unoptimised,
  because it was never routed through `next/image` (F1);
* the 404 page returned `robots: noindex`, which Next does correctly on its own.

### D2. The home page's cold load, resource by resource

From `probe-net.js` (the browser's own Resource Timing), 1280×900, empty cache:

| resource | requests | transfer | decoded |
|---|--:|--:|--:|
| hero video (`/images/hero.mp4`) | 1 | **419 KB** | 419 KB |
| fonts (Vazirmatn variable / Cormorant / Inter) | 3 | **194 KB** | 193 KB |
| JavaScript (`/_next/static/chunks/*`) | 8 | 121 KB | 392 KB |
| stylesheets | 3 | 17 KB | 89 KB |
| HTML | 1 | 20 KB | 124 KB |
| images (`/_next/image`) | 1 | 20 KB | 20 KB |
| other | 2 | 3 KB | 3 KB |
| **total** | **18** | **776 KB** | **1.1 MB** |

Timings on the same run: TTFB 33 ms · FCP 788 ms · DOMContentLoaded 784 ms ·
`load` 1348 ms · **LCP 1684 ms** (`video.hero-video`) · **CLS 0.006** ·
1 long task (147 ms).

Read together, those two rows say the home page's first paint is not waiting on
the network at all — it is waiting on ~700 ms of CSS, font and script blocking
after an HTML document that arrives in 33 ms. The LCP element is the hero video,
which is a deliberate design choice, not an accident (F19).

### D3. Core Web Vitals per route (cold profile, fixed route order)

| route | LCP | FCP | CLS | TTFB | load | requests | transfer |
|---|--:|--:|--:|--:|--:|--:|--:|
| `/` | 1684 ms (video) | 788 ms | 0.006 | 33 ms | 1348 ms | 18 | 776 KB |
| `/academy` | 140 ms | 140 ms | 0 | 22 ms | 145 ms | 21 | 143 KB |
| `/academy/what-is-microcement` | 156 ms | 156 ms | 0 | 19 ms | 157 ms | 22 | 52 KB |
| `/articles` | 200 ms | 200 ms | 0 | 50 ms | 170 ms | 28 | 74 KB |
| `/articles/what-is-microcement` | 144 ms | 144 ms | 0 | 36 ms | 91 ms | 21 | 1 KB (warm) |
| `/projects/minimal-residence` | 136 ms | 136 ms | 0 | 62 ms | 136 ms | 25 | 12 KB (warm) |
| `/definitely-missing-route` | 100 ms | 100 ms | 0 | 9 ms | 59 ms | 11 | 0 KB |
| `/` @mobile | 156 ms | 156 ms | 0 | 14 ms | 191 ms | 21 | 419 KB |
| `/academy` @mobile | 836 ms (image) | 108 ms | 0 | 13 ms | 424 ms | 20 | 215 KB |
| `/articles` @mobile | 156 ms | 156 ms | 0 | 31 ms | 81 ms | 22 | 131 KB |

Only the home page is a genuine cold start; the later routes are warm and their
numbers are correspondingly small. `/academy` on mobile is the one route where an
image was the LCP element with `loading="lazy"` and 169 KB of transfer (F20).

### D4. Accessibility and images (before)

| check | result |
|---|---|
| images without an `alt` attribute | **0** on every route |
| images with `alt=""` | 2 on the home page (the Instagram scene plate, and the lightbox's own `<img>`) — both decorative |
| `h1` per route | exactly 1 everywhere |
| landmarks | `header`, `nav`, `main`, `footer` present on every route **except** the root 404, which has none (F8) |
| unnamed controls | 0 on desktop; 9 on mobile — all nine are the closed menu drawer, out of the accessibility tree (`visibility:hidden`) |
| targets under 24 px | 1–2 per route; all are inline links in a sentence, or the wordmark with wide spacing (WCAG 2.5.8 exceptions) |
| `:focus-visible` outline rule | present (`app/globals.css`) |
| `prefers-reduced-motion` rule | present |
| console / script errors | 0 (the 404 route logs the expected failed fetch for the missing URL) |

## E. The plan this audit executed

| tier | item | outcome |
|---|---|---|
| **P0** | One origin for every absolute URL (`metadataBase`) so no share metadata points at localhost | done — `lib/site.ts`, `NEXT_PUBLIC_SITE_URL`, `.env.example` |
| **P0** | A canonical address for every indexable route | done — per route; `?category=` collapses to `/articles` |
| **P1** | Complete OpenGraph / Twitter metadata on every route | done — 6 tags on index pages, 8 on detail pages |
| **P1** | Structured data: publisher, site, article, lesson, built work | done — `lib/structured-data.ts`, `components/JsonLd.tsx` |
| **P1** | A sitemap and a robots file a crawler can act on | done — `app/sitemap.ts`, `app/robots.ts` |
| **P2** | Redirect semantics for the retired gallery index | done — 308 instead of 307 |
| **P2** | Response hygiene (`x-powered-by`, sniffing, referrer, framing) | done — `next.config.ts` |
| **P2** | Root 404, share plates for index pages, no-JS mobile menu, archive caching | **left for the studio** — each is a design, copy or behaviour decision (see §H) |
| **P3** | Titles, theme colour, font subsetting, CSS splitting, hero-video weight | **reported with numbers** — no safe code-only fix |

## F. What was changed, and why

Nothing here alters what a visitor sees. Every change is either metadata (read
only by crawlers and link previews), a response header, or a status code.

### New files

| file | what it does |
|---|---|
| `lib/site.ts` | Resolves the site's origin once — `NEXT_PUBLIC_SITE_URL`, then `http://localhost:3000` (see §F3 for the production-origin default added later) — and names the site (`NORSTA`), its language (`fa`, `fa-IR`, `fa_IR`), its title and its summary line. `absoluteUrl()` is the single door every absolute URL in the structured data goes through. |
| `lib/seo.ts` | `detailMetadata()` — the canonical + OpenGraph + Twitter block that the article, lesson and project pages had been writing three slightly different versions of. One function, so the three cannot drift. |
| `lib/structured-data.ts` | The JSON-LD builders: `Organization`, `WebSite`, and one node per article (`Article`), lesson (`LearningResource`) and project (`CreativeWork`), each cross-referencing the site by `@id`. |
| `components/JsonLd.tsx` | Renders one `application/ld+json` block, escaping `<` so the payload cannot end the script early. Server-rendered, so no JavaScript is needed to see it. |
| `app/sitemap.ts` | `/sitemap.xml` — 23 URLs generated from `content/articles`, `content/academy`, `content/projects` and `content/products`. Excludes `/projects` (a redirect) and the `?category=` views on `/articles` and `/products` (each canonicalised to its own index). |
| `app/robots.ts` | `/robots.txt` — allow everything, point at the sitemap, and `Disallow: /` when `VERCEL_ENV === "preview"` so a preview deployment never becomes a second indexed copy of the site. |
| `.env.example` | Documents the one variable a deploy has to set, and why. |

### Files edited

| file | change |
|---|---|
| `app/layout.tsx` | `metadataBase: new URL(SITE_URL)`; an `openGraph` default (`type`, `siteName`, `locale`, `url: "/"`, title, description) and a `twitter: { card: "summary" }` default; the site's `Organization` + `WebSite` JSON-LD as the first child of `<body>`. Its title and summary now read from `lib/site.ts` constants — the same strings, moved so the document title and the share card cannot drift apart. |
| `app/page.tsx` | states the home page's canonical address (`alternates: { canonical: "/" }`) and nothing else; its title, summary and card are the layout's. |
| `app/articles/layout.tsx` | canonical `/articles` (so the filtered views point at the unfiltered address), `openGraph` and `twitter` for the archive, and its summary line named once as a local constant. |
| `app/articles/[slug]/page.tsx` | `detailMetadata()` for canonical + OpenGraph (now **with** the cover image and `og:image:alt`) + `summary_large_image`; `<JsonLd>` with the article's `Article` node. |
| `app/academy/layout.tsx` | canonical `/academy`, `openGraph`, `twitter`, summary line named once. |
| `app/academy/[slug]/page.tsx` | `detailMetadata()` + `<JsonLd>` with the lesson's `LearningResource` node (including `isAccessibleForFree`, from the record's own `access` flag). |
| `app/projects/[slug]/page.tsx` | `detailMetadata()` + `<JsonLd>` with the project's `CreativeWork` node — location, completion date and materials only when the record actually carries them. |
| `app/projects/page.tsx` | `redirect` → `permanentRedirect` (307 → 308). The only behavioural change in this audit. |
| `next.config.ts` | `poweredByHeader: false`, plus `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and `X-Frame-Options: SAMEORIGIN` on every route. |
| touched `.ts`/`.tsx` files | line endings normalised to CRLF, matching how this checkout stores them. |

Two deliberate non-changes inside that work:

* **No canonical in `app/layout.tsx`.** A canonical declared on the root layout
  would apply to every route that does not override it — the fastest way to
  canonicalise an entire site to its home page. Each page states its own instead.
* **No Persian copy was retyped.** The strings that had to move (the home
  summary, the magazine's and the academy's summary lines) were moved
  programmatically and verified character-by-character — a hand-typed variant
  differing only by a zero-width non-joiner is invisible in review and would have
  silently changed copy. (`hoist-summaries.mjs` printed `identical: true`.)

### F3. Brand and origin correction (2026-10-25, after these measurements)

A later, separately requested pass corrected the site's identity. It is recorded
here because two of the findings above (F1, F11) describe the state it changed,
and because it changes what an unset `NEXT_PUBLIC_SITE_URL` now means.

| file | change |
|---|---|
| `lib/site.ts` | `PRODUCTION_SITE_URL = "https://norsta.ir"` is now the default for every build, so an unset variable can no longer put `http://localhost:3000` — or a Vercel deployment hostname, which was the previous second fallback — into a canonical link, an `og:url`, a `twitter:image` or a JSON-LD `@id`. `http://localhost:3000` is reached **only** by `next dev`. The Instagram handle and profile URL are named here too (`SITE_INSTAGRAM_HANDLE`, `SITE_INSTAGRAM_URL`). |
| `components/Contact.tsx` | The reference studio's Copenhagen address, its Google Maps link and `mailto:studio@monolithatelier.com` removed (F11); the contact line now shows `@norsta.home`, and both it and the CTA open the studio's Instagram profile. Same six elements in the same order under the same `.contact` rules: no broken link, no dead `mailto:`, no empty placeholder. |
| `components/InstagramShowcase.tsx`, `content/academy/config.ts`, `lib/structured-data.ts` | Read the account from `lib/site.ts` instead of each writing the URL out, so the showcase, the academy's purchase enquiry and the `Organization` node's `sameAs` cannot drift apart. |
| `.env.example` | Documents `NEXT_PUBLIC_SITE_URL=https://norsta.ir` and the new fallback order. |
| `package.json`, `package-lock.json` | `monolith-atelier` → `norsta`; the description names the project rather than the reference site. |
| `README.md`, `app/globals.css`, `scripts/verify-fa.mjs` | The legacy name removed from the README title and the stylesheet header; the reference studio's e-mail dropped from the localisation allow-list it had been exempted by. |

Nothing visual changed: no layout, spacing, type or interaction rule was touched,
and the only markup differences in the contact block are the glyph on its contact
line (the account's own mark, drawn at the pin's 18 px) and the `href` behind the
CTA. The origin default was verified by reading the served HTML of a build made
with the variable unset and with it set to `https://norsta.ir` — both emit
`https://norsta.ir/...` and neither emits `localhost`.

### F6. The products catalogue merged in (2026-10-26)

`origin/main` had grown a shop-style catalogue while this audit was being written —
`/products`, eight product records, shelf filters, its own plates and a
`verify-products.mjs` harness. The merge was textually clean: no conflict markers in
any file, and every change this audit made survived it. It left one real
inconsistency, though — **`app/sitemap.ts` did not know about `/products`** — and
that is the thing this section records fixing.

The catalogue declares `https://norsta.ir/products` as its canonical address
(`app/products/layout.tsx`), so the merged tree held an indexable page that no
sitemap declared, which the file's own contract forbids: it builds the list from
the same content modules the pages render, so a record cannot be missing from the
map. `/products` is now listed once, `weekly`, priority `0.8`, and the comment
above the list records the third deliberate omission: the shelf views
(`/products?category=...`) stay out because the catalogue's layout canonicalises
them onto `/products`, the same way the magazine's category views consolidate onto
`/articles`. `app/robots.ts` changed only in prose — it promised "the twenty-two
pages", a count a merge can silently falsify, and now promises "every page".

Numbers after the merge, on a default-state build of the merged tree (29 routes, no
`NEXT_PUBLIC_SITE_URL`, compiled in 10.0 s):

| check | result |
|---|---|
| `_ref/audit/verify.mjs http://127.0.0.1:3100` | **`✓ no failures`** on 12 paths — the 11 above plus `/products`, added to the sweep's list here |
| `npm run verify:products` | **58/58** |
| `npm run verify:academy` | **62/62** |
| `npm run audit:responsive` | exit 0 — 7 viewports `overflow=no`, 0 console errors, with `products` now one of the swept sections |
| `npm run audit:mfc` | exit 0 — 0 console errors, 0 bad responses |
| `npm run typecheck`, `npx eslint app components lib` | clean |
| `npm run verify:fa` | 55 files scanned (48 before), the same 3 accepted candidates |
| `/sitemap.xml` | **23 `<loc>`** (22 before), 3646 bytes, 130 lines, `https://norsta.ir/products` present, `localhost` **0** |
| `/robots.txt` | 63 bytes, 4 lines, `Sitemap: https://norsta.ir/sitemap.xml` |

Two things this section deliberately does not claim. The catalogue's canonical is
written out in `content/products/config.ts` (`SITE_ORIGIN`) instead of being read
through `lib/site.ts`, so it stays on `https://norsta.ir` even in a deployment that
points `NEXT_PUBLIC_SITE_URL` elsewhere — the catalogue author's own decision, and a
harmless one while preview deployments are disallowed in `robots.txt`, so this audit
left it alone. And the catalogue's Persian copy sits in `content/products/`, which
`verify-fa.mjs` does not walk (its scope is `app` and `components`), so that copy is
not covered by the localisation gate.

## G. Before / after

### G1. The crawler's view

| route | canonical | `og:*` tags | JSON-LD blocks | card |
|---|---|---|---|---|
| `/` | — → **`/`** | 0 → **6** | 0 → **1** | — → `summary` |
| `/articles` (and `?category=…`) | — → **`/articles`** | 0 → **6** | 0 → **1** | — → `summary` |
| `/articles/<slug>` | — → **its own URL** | 3 → **8** (with image) | 0 → **2** | `summary` → **`summary_large_image`** |
| `/academy` | — → **`/academy`** | 0 → **6** | 0 → **1** | — → `summary` |
| `/academy/<lesson>` | — → **its own URL** | 5 → **8** | 0 → **2** | `summary_large_image` |
| `/projects/<slug>` | — → **its own URL** | 5 → **8** | 0 → **2** | `summary_large_image` |
| `/projects` | — | 0 → 6 (never served; it redirects) | 0 | 308 → `/#work` |
| any 404 | — (correctly none) | 0 → 6 | 0 → 1 | `robots: noindex` |
| `/robots.txt` | 404 → **200** | — | — | — |
| `/sitemap.xml` | 404 → **200**, 22 URLs (23 since §F6) | — | — | — |

With `NEXT_PUBLIC_SITE_URL` set at build time, every URL in the block above is
emitted against that origin and **no `localhost` string appears anywhere in the
served HTML** (verified with `verify.mjs`: 0 failures). That run used the
stand-in origin `https://dev.example`, before the studio's domain was confirmed;
the mechanism is the same and the tags are the same shape, and the value a deploy
sets is now `https://norsta.ir`. Without the variable, the fallback at the time of
these measurements was Next's own `http://localhost:3000` — the same values the
baseline had. Since the brand pass (§F3) a build falls back to
`https://norsta.ir` instead, and only `next dev` reaches localhost.

### G2. Performance and accessibility

| route | HTML (raw) | LCP | FCP | CLS | TTFB | load | transfer |
|---|---|---|---|---|---|---|---|
| `/` | 124 → 127 KB | 1684 → 900 ms | 788 → 664 ms | 0.006 → 0.002 | 103 → 85 ms | 1672 → 1242 ms | 776 KB (unchanged) |
| `/academy` | 48 → 52 KB | 140 → 132 ms | — | 0 | 22 → 24 ms | — | 143 KB |
| `/academy/<lesson>` | 36 → 40 KB | 156 → 96 ms | — | 0 | 19 → 17 ms | — | 52 KB |
| `/articles` | 69 → 72 KB | 200 → 196 ms | — | 0 | 50 ms | — | 74 → 76 KB |
| `/articles/<slug>` | 45 → 51 KB | 144 → 92 ms | — | 0 | 36 → 12 ms | — | 1 KB |
| `/projects/<slug>` | 42 → 46 KB | 136 → 80 ms | — | 0 | 62 → 10 ms | — | 12 → 13 KB |
| images / a11y | — | — | — | — | — | — | every counter unchanged: same image count, same `lazyAboveFold`, 0 missing `alt`, 0 unnamed desktop controls, same small-target count |

**What is real in that table and what is not.** The only guaranteed deltas are
the ones the change explains: **+2 to +6 KB of raw HTML per route** (the JSON-LD
and the extra metadata; about +0.5 KB over the wire once gzipped) and every
metadata column in G1. **The timing differences are not attributable** — the
baseline and the "after" run are single samples on a machine that was doing other
work, and the same routes moved in both directions by up to 400 ms between runs
(`/articles` on mobile measured 156 ms, then 432 ms, then 556 ms across three
runs of identical code). The honest reading is: **performance is unchanged, and
the site was already fast on every lab metric except the home page's cold
paint**, which is dominated by the hero video, the fonts and the stylesheet
(F17–F19).

## H. Left alone, and the decisions they need

Each item below is either a design decision, a piece of studio copy, or a
measurement that is deliberately left as designed. The code notes say *where* the
change would go; none of them is a silent omission.

### H1. A root 404 (`app/not-found.tsx`) — F8

Next's default page answers correctly (404 + `noindex`) but in English, without a
header, footer or `main` landmark. The three segments already have a styled 404;
the root one only has to exist. A `not-found.tsx` cannot export `metadata`, so
the status code and the `noindex` are already as good as they can get — this is
brand and wayfinding only.

### H2. Share plates for the three index routes — F12

The wiring is done and waiting: one entry per section layout.

```ts
// app/articles/layout.tsx (and the academy home)
openGraph: { …, images: [{ url: "/images/og/articles.jpg", width: 1200, height: 630, alt: "…" }] },
```

Needed from the studio: three 1200×630 JPEGs (≤ 200 KB each, `public/images/og/`).
Pointing a crawler at `hero-villa.png` (6.2 MB) is worse than sending no image.

### H3. A mobile menu that works without JavaScript — F13

`.nav-links` is hidden until `components/SiteInteractions.tsx` sets
`data-menu-open`. The site already ships the pattern that would fix this: the
reveal system writes a `<noscript>` block per segment
(`app/globals.css`). A one-rule `noscript` fallback that lays the links out
statically would cost nothing and would make the whole site navigable with
scripting off. It changes how the header looks on a no-JS phone, which is why it
is a decision and not a patch.

### H4. The magazine archive is uncacheable — F9

`/articles` reads `searchParams` for `?category=`, so Next serves it
`private, no-cache`. Either the seven category views become prerendered routes
(they are seven fixed, known values) or the filtering moves to the client. Both
are real refactors of `app/articles/`.

### H5. Contact identity — F11 — **closed** (2026-10-25)

The reference studio's Copenhagen address, its Google Maps link and
`studio@monolithatelier.com` were removed rather than re-pointed, and the package
is `norsta` now (see §F3). What the block publishes instead is the studio's
Instagram account, which was already the site's enquiry route.

One part remains open, and only the studio can close it: **when a real street
address, telephone number or e-mail exists**, it belongs in
`components/Contact.tsx` **and** in the `Organization` node in
`lib/structured-data.ts` (`email`, `telephone`, `address`) — the two must not
disagree, or the structured data becomes a liability.

### H6. Four short titles — F15

`NORSTA HOME`, `مجله نورستا`, `آکادمی میکروسمنت نورستا`, `پروژه‌های نورستا` are
11–23 characters where a result page has room for ~60. The naming pattern is
already in place (`%s | مجله نورستا`), so a longer index title is a copy decision
the studio can make later without touching code structure.

### H7. Weight: fonts, stylesheet, hero video — F17–F19

The three have numbers attached in §C and §D (194 KB of fonts; one 91 KB
render-blocking stylesheet; a 419 KB hero video that *is* the LCP element and
419 KB of the 776 KB cold transfer). Every one of them is deliberate and
documented in the source: the Persian face ships the full weight axis, the
stylesheet holds the whole design system in one file, and `Hero.tsx` explains why
there is no poster frame. Revisiting them means deciding which glyphs, which
critical rules and which first frame the studio can give up — not a code fix.
**The next step, if it is taken, is field data, not more lab runs**: a month of
Search Console Core Web Vitals will say whether real devices see the same
paint times this machine did.

### H8. `NOTES.md` §4 — F14

It describes a `hero-villa-poster.jpg` poster attribute that `Hero.tsx` no
longer sets (deliberately). One paragraph in `NOTES.md` needs to be brought back
in line with the code.

### H9. A `theme-color` — F16

One line and one decision: `export const viewport: Viewport = { themeColor: "…" }`
in `app/layout.tsx`, so a phone's browser chrome matches the page's ground instead
of the browser's own default. It is not in this audit because the value is a brand
colour — and because the site has two grounds (the ivory sections and the hero's
dark plate), so *which* one a mobile browser should wear is a design call rather
than a metadata one. Note the export: Next takes this colour from the `viewport`
export, not from `metadata`, which is where it is usually looked for first.

### H10. Four lazy images above the fold — F20

The first viewport of `/articles`, `/academy` and `/projects/<slug>` loads some of
its card images with `loading="lazy"`; the LCP on those routes is text
(`p.art-page-lede`, 176–200 ms), so nothing is lost today and the counters were
left exactly as they were. If field data ever disagrees, the fix is Next's
`priority` on the first two or three cards in `app/articles/page.tsx` and the
academy landing page — not on the whole grid, which would trade a stable LCP for
bandwidth.

## I. Verification and reproducibility

### I1. The repository's own harnesses, re-run after the changes

| harness | result |
|---|---|
| `npm run verify:fa` | 55 source files scanned under `app`, `components`: **3 candidates, all pre-existing** and all in files this audit never touched (`Hero.tsx` "Scroll", `InstagramShowcase.tsx` "NORSTA به دنیای…", `PageTransition.tsx` "Norsta"). The new files add none. (55 files is the count after §F6 merged the catalogue in; it was 48 before. Note the gate's scope: it walks `app` and `components` only, so Persian copy held in `content/` is outside what it can see.) |
| `npm run verify:academy` | **62/62 checks passed** against the build on `:3100` — including "no player is rendered", "no runtime is claimed", "fully crawlable without scripting" and "unknown lesson answers 404 with the academy's own not-found copy". |
| `npm run verify:products` | **58/58 checks passed** against the same build — the header item and the link behind it, the hero, the filter row, every record in `content/products/records.ts`, the catalogue's canonical `https://norsta.ir/products`, and the unknown-shelf fallback. This harness arrived with the merge recorded in §F6. |
| `npm run audit:mfc` | 0 console errors, 0 bad responses; at both viewports the wall opened the viewer, zoomed to the 6× ceiling and clamped, stepped back, reset to 1×, kept Tab inside the dialog, closed on Escape with focus returned, and re-flowed on a finish filter. |
| `npm run audit:responsive` | 7 viewports (320 / 375 / 390 / 430 / 768 / 1280 / 1440): **no horizontal overflow anywhere** (`docScrollWidth === viewport`), 0 console errors, and open → Escape → close verified on the four phone widths. |
| `npm run typecheck` | clean (`tsc --noEmit`). |
| `npx eslint app components lib` | clean. |
| `node _ref/audit/line-endings.mjs` | the new/edited files are CRLF with **0 stray LF** — the endings this checkout uses (15 files in the final run of 2026-10-26, §I5). |

That is the "no visual change" claim, tested by something other than the claim.
Every row was re-run on **2026-10-26** against the default build of the final tree
(the build §I5 ends on, with no `NEXT_PUBLIC_SITE_URL` set) and produced the same
results; the raw outputs are the `*-default-final` files listed in §I5.

### I2. The metadata sweep, and the one thing it proves

`node _ref/audit/verify.mjs http://localhost:3100` walked all 11 paths and printed
**`✓ no failures`** on a build made with the origin set. Read off that run:

* a canonical on every HTML route that should have one — and none on `/projects`
  (a 308 body) or the 404, which is correct;
* `/articles?category=میکروسمنت` canonicalising to `/articles`, i.e. the filtered
  views are not duplicate pages;
* **6 `og:*` + 3 `twitter:*`** on `/`, `/articles`, `/academy`, the redirect body
  and the 404; **8 `og:*` + 5 `twitter:*`** (`card=summary_large_image`, image
  plus `og:image:alt`) on the article, lesson and project pages;
* JSON-LD that parses on every route: 1 block (`Organization` + `WebSite`) on the
  index pages, 2 on the three detail pages (adding `Article` /
  `LearningResource` / `CreativeWork`);
* `/robots.txt` → 200, four lines: `User-Agent: *` · `Allow: /` · blank ·
  `Sitemap: https://dev.example/sitemap.xml` (that run's stand-in origin; the same
  file now writes `Sitemap: https://norsta.ir/sitemap.xml`);
* `/sitemap.xml` → 200, 3646 bytes, 130 lines, first `<loc>` the origin itself
  (3582 bytes and 125 lines before §F6 added the catalogue's entry).

The same sweep against **the same build with `NEXT_PUBLIC_SITE_URL` unset** prints
**`✗ 24 failure(s)`**, and every one of them is the localhost check
(`localhost leaked into the HTML`, `localhost in og:url`, `… og:image`,
`… twitter:image`). That is the honest shape of this fix: the code is correct, and
one environment variable is what turns it from correct to true. The deploy
checklist below exists because of it.

**One correction, added 2026-10-26.** That paragraph describes the pre-§F3 build it
was swept against, not the code as it now stands. `lib/site.ts` falls back to
`https://norsta.ir` for *every* build, so an unset variable can no longer produce
those 24 failures: the same sweep, re-run against a build made with no variable set,
prints **`✓ no failures`** (`_ref/audit/verify-default-final.txt`) and finds
`localhost` **0** times in every emitted route — `/` carries
`canonical https://norsta.ir`, `og:url https://norsta.ir`,
`og:image https://norsta.ir/images/...` and the JSON-LD `@id`
`https://norsta.ir/#organization`. `_ref/verify-default-build.txt` and the two
`probe-default-*.txt` files are kept as the record of what a missing `metadataBase`
did to a build, not as a description of the current one. `http://localhost:3000` is
now reachable only under `next dev`, and §I4's first step is a convenience (it makes
the origin explicit) rather than the thing standing between the site and a localhost
canonical.

### I3. Commands, start to finish

```powershell
npm install

# 1. build with the origin the site will actually live at (PowerShell shown)
$env:NEXT_PUBLIC_SITE_URL = 'https://norsta.ir'
npm run build

# 2. serve the production build (never while a build is running)
npx next start -p 3100

# 3. read the origin off the served HTML, then run the full sweep
node _ref/audit/probe-origin.mjs http://localhost:3100 /
node _ref/audit/verify.mjs     http://localhost:3100      # expect: ✓ no failures

# 4. the repository's own harnesses, against the same server
node scripts/verify-academy.mjs  http://localhost:3100    # 62/62
node scripts/responsive-audit.mjs http://localhost:3100   # 7 viewports, no overflow
node scripts/mfc-audit.mjs                                # viewer / zoom / tab trap
node scripts/verify-fa.mjs                                # 3 accepted candidates

# 5. static gates
npm run typecheck
npx eslint app components lib
node _ref/audit/line-endings.mjs
```

Two habits worth keeping: **never run `next start` while `npm run build` is
running** (the served output changes under the server), and remember that `.next`
is gitignored — the build that was measured here is not part of the deliverable,
so the numbers above are only reproducible after a fresh build.

A third habit, about the build rather than the server: `next/font/google` **downloads
the two Latin faces while the build runs**, so `npm run build` needs a route to
`fonts.googleapis.com` — a reachability the served site does not need, because the
files are then self-hosted from `/_next/static/media`. During the final verification
(2026-10-26) one build failed with
`TypeError: Cannot read properties of null (reading '1')` inside
`@next/font/dist/google/loader.js:122`; that line reads the file extension off the
font URL Google's CSS named, so the response it had just parsed carried a `src`
without one (`format('truetype')`-era CSS, which Google serves to a request it does
not recognise). It did not reproduce: the re-run compiled in 18.1 s, and every probe
of that CSS since has returned `.woff2` URLs. A build that must not depend on a
third party at all would need these two faces self-hosted through `next/font/local`,
the way Vazirmatn already is — a change to the asset pipeline, not to the pages.

### I4. Deploy checklist

1. **Set `NEXT_PUBLIC_SITE_URL=https://norsta.ir` in the production environment
   before the build.** It is baked into the prerendered HTML; setting it
   afterwards changes nothing until the next build. Since §F3 an unset variable
   falls back to that same origin rather than to localhost, so this is less
   dangerous than it was — but it is still the difference between the configured
   value and a safety net, so set it.
2. **Confirm the deployed HTML**: `curl -s https://<origin>/ | grep -c localhost`
   must be `0`, and `og:url` must carry the real origin. (§D1's table is what this
   looks like when step 1 is skipped.)
3. **Purge the CDN** after the first deploy. The HTML is served
   `s-maxage=31536000`, so a shared cache will happily keep the old HTML — and the
   old HTML is the one with localhost in it.
4. **Check `https://norsta.ir/robots.txt` and `/sitemap.xml`** on the real origin
   (the sitemap was prerendered with the build-time origin too).
5. **Submit the sitemap** in Search Console and run one article, one lesson and
   one project URL through the Rich Results test.
6. **Re-scrape one article and one project** through the Facebook / X / LinkedIn
   debuggers to see the card and the cover image as they will actually appear.
7. **Re-measure after ~4 weeks of field data.** The number to watch is the home
   page's LCP (hero video + fonts + one stylesheet); §H7 explains why more lab
   runs before that would only re-measure this machine.
8. **Nothing else here needs a deploy step.** No content, route, URL or visual
   change was made, so there is no redirect map to publish and nothing for the
   studio to re-check by eye.

### I5. Evidence files

Everything below is gitignored scratch material under `_ref/`; the audit tooling
lives in `_ref/audit/` and is re-runnable at any time.

| file | what it shows |
|---|---|
| `_ref/build-baseline.txt`, `_ref/build-after.txt` | the route table of the first build and of the changed one (route count, JS weight unchanged) |
| `_ref/baseline-warm.json`, `_ref/after.json` | per-route measurements behind §D and §G |
| `_ref/before-after.txt`, `_ref/after-table.txt`, `_ref/*-report.txt` | the comparisons the tables were built from |
| `_ref/verify-default-build.txt` | the sweep against a build with no origin set: 24 localhost failures |
| `_ref/verify-env-build.txt` | the sweep against the origin-set build: `✓ no failures`, route by route |
| `_ref/probe-default-home.txt`, `_ref/probe-default-article.txt` | the served canonical / `og:url` / `og:image` when no origin is configured (`http://localhost:3000/...`) |
| `_ref/probe-env-home.txt`, `_ref/probe-env-article.txt` | the same tags when it is (`https://dev.example/...`) |
| `_ref/resp-report.json`, `_ref/mfc-audit.json` | the responsive and material-library harnesses' raw results |
| `_ref/verify-fa.txt`, `_ref/verify-academy.txt` | the localisation scan (48 files, 3 accepted candidates) and the academy harness (62/62) |
| `_ref/build-final.txt`, `_ref/build-env.txt` | the two builds this audit's numbers come from |
| `_ref/build-default-final.txt` | the build of 2026-10-26 with **no** origin variable set: 28 routes, compiled in 18.1 s — the tree's default state, and the build every `*-default-final` file below was measured against |
| `_ref/audit/verify-default-final.txt` | the metadata sweep against *that* build: `✓ no failures` — the exact opposite of `_ref/verify-default-build.txt`, which is why §I2 carries a correction |
| `_ref/audit/verify-academy-default-final.txt` | `verify-academy` on that build: **62/62** |
| `_ref/audit/responsive-default-final.txt`, `_ref/audit/mfc-default-final.txt` | the responsive (7 viewports, `overflow=no`, 0 console errors) and material-library (0 console errors, 0 bad responses) audits on that build |
| `_ref/audit/verify-merged-final.txt, verify-products-merged-final.txt, verify-academy-merged-final.txt` | the same three harnesses on the **merged** tree of §F6: sweep `✓ no failures` over 12 paths, products 58/58, academy 62/62 |
| `_ref/audit/responsive-merged-final.txt`, `_ref/audit/mfc-merged-final.txt` | the two browser audits on that merged build: both exit 0, 0 console errors |
| `_ref/audit/probe-origin.mjs` | the two-line probe used above, added by this audit |
| `_ref/audit/measure.mjs`, `seo-table.mjs`, `img-table.mjs` | the measurement passes that produced §D |
| `_ref/audit/verify.mjs`, `compare.mjs`, `headers.mjs` | the metadata sweep, the before/after diff and the header check |
| `_ref/audit/line-endings.mjs` | the CRLF gate quoted in §I1 |

After the final sweep the server was stopped and ports 3100 and 3000 are free;
`.next` was rebuilt once more with no environment variable set, so the working
copy is back in its default state.

That closing state was reproduced once more, end to end, on **2026-10-26** on the
final tree: `.next` deleted and rebuilt with no variable set (28 routes,
`BUILD_ID` `QDVyXVLkQZj2Aq8aVdGs-`), then served with `npx next start -p 3100` and
measured — sweep `✓ no failures`, `verify-academy` 62/62, `responsive-audit`
7 viewports `overflow=no` with 0 console errors, `mfc-audit` 0 console errors and
0 bad responses, `typecheck` and `eslint app components lib` clean, `verify-fa`
48 files with the same three accepted candidates, and `line-endings` 15 files CRLF
with 0 stray LF. The server was stopped afterwards: nothing listens on 3100 or 3000,
and `.next` is the default-state build again.

### I6. One more gate: the working tree itself

This report claims that nothing visual changed, so the tree was read as well:
`git status --porcelain` lists exactly the files in §F, nothing else. That check
did surface one unrelated working-tree change — `public/images/instagram-scene.png`
had been re-encoded to a JPEG kept under the `.png` name (579 KB against the
committed 1.6 MB PNG), which is the kind of thing a `Content-Type: image/png`
response renders by sniffing rather than by right. It was **reverted to the
committed file**, and the version as found was kept at
`_ref/instagram-scene.workingcopy.jpg` in case it was a deliberate experiment.

---

**In one line.** The site was already sound — no `alt` omissions, no duplicate
`h1`, no layout shift, no accessibility blockers, and a fast response — and the
things that were missing were missing quietly: the origin, the canonical, the
share card, the structured data, the sitemap, and a 308. Those are now in place
and verified against a production build, with the remaining items listed,
numbered and handed to the studio as decisions rather than left as surprises.
