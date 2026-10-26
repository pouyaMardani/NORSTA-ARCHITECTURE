/**
 * Where this site is served from — the one fact every absolute URL in the
 * metadata is built from.
 *
 * React/Next resolves the relative paths the routes use for canonical links,
 * OpenGraph images and structured data against `metadataBase`. With no
 * `metadataBase`, Next falls back to `http://localhost:3000`, so the HTML that
 * shipped before this module existed told crawlers and social networks that the
 * studio's photographs live on the author's own machine
 * (`<meta property="og:image" content="http://localhost:3000/images/…">`).
 *
 * Because the site is fully prerendered, the origin has to be known when the
 * pages are *built*, not when they are requested. It is read, in order, from:
 *
 *   1. `NEXT_PUBLIC_SITE_URL` — the canonical production origin, which a deploy
 *      sets *before* the build (`.env.example` documents it). This is the value
 *      that makes a canonical URL claim the real, permanent address.
 *   2. `PRODUCTION_SITE_URL` — `https://norsta.ir`, the studio's own domain. It
 *      is the fallback for any build that was not handed the variable, so a
 *      production *or* preview deployment can never publish a canonical link,
 *      an `og:url`, a `twitter:image` or a JSON-LD `@id` that points at
 *      `localhost`, at a Vercel deployment hostname or at a stand-in test
 *      origin. A preview naming the real domain is the correct direction: a
 *      preview is not an address a page may claim as its own, which is why
 *      `app/robots.ts` asks every crawler to stay out of one.
 *   3. `http://localhost:3000` — and only while the development server is
 *      running (`next dev`), where the studio's own domain would make the local
 *      HTML claim an address it is not being served from. No build ever reaches
 *      this branch: `next build` sets `NODE_ENV=production`.
 *
 * See `.env.example` and `docs/SEO_PERFORMANCE_AUDIT.md` → "Deploy checklist".
 */

/** The studio's domain — what a production build has to canonicalise to. */
export const PRODUCTION_SITE_URL = "https://norsta.ir";

export const SITE_URL: string = (() => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "development") return "http://localhost:3000";

  return PRODUCTION_SITE_URL;
})();

/**
 * The site's own title and summary.
 *
 * They live here, rather than in the root layout alone, because the home page's
 * share card has to repeat them: a page that states its own `openGraph` object
 * replaces the layout's wholesale, and one source for both keeps the document
 * title and the card from drifting apart.
 */
export const SITE_TITLE = "NORSTA HOME";
export const SITE_TAGLINE =
  "معماری‌ای که با سکوت، وزن و گذرِ آرام نور در فضا شکل می‌گیرد.";

/**
 * The mark as the design spells it: Latin, all caps, no suffix. The Persian
 * name of the studio is written at the head of each section instead (`مجله
 * نورستا`, `پروژههای نورستا`), so nothing here has to guess at a translation.
 */
export const SITE_NAME = "NORSTA";

/**
 * The studio's own Instagram account — the one channel this site can point a
 * visitor at, and where a purchase enquiry for the training collection goes.
 *
 * The handle is named once, here, because four places use it: the Instagram
 * showcase on the home page, the contact block, the academy's collection config
 * and the `Organization` node's `sameAs`. A handle that drifts between them is a
 * link to somebody else's profile, so none of them spells it out again.
 */
export const SITE_INSTAGRAM_HANDLE = "norsta.home";
export const SITE_INSTAGRAM_URL = `https://www.instagram.com/${SITE_INSTAGRAM_HANDLE}/`;

/** The language the whole site is written in, in the tag forms the standards ask for. */
export const SITE_LANGUAGE = "fa";
export const SITE_LANGUAGE_TAG = "fa-IR";
/** `hreflang`/OpenGraph spell the same language with an underscore. */
export const SITE_LOCALE = "fa_IR";

/**
 * A site-relative path as an absolute URL.
 *
 * `metadataBase` already absolutes the metadata Next emits, but structured data
 * is hand-written JSON that nothing rewrites, so it asks for its URLs here.
 */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
