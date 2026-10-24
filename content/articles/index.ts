/**
 * The magazine's public API.
 *
 * Components and routes import from here — never from `records.ts` directly —
 * so the data model stays swappable and no screen has to know how sorting,
 * filtering or date formatting is implemented.
 */

import { ARTICLE_CATEGORIES, type ArticleCategory, type ArticleDTO } from "./types";
import { ARTICLE_CONFIG } from "./config";
import { ARTICLES } from "./records";

export { ARTICLE_CONFIG, ARTICLE_IMAGES } from "./config";
export { ARTICLES } from "./records";
export { ARTICLE_CATEGORIES, type ArticleBlock, type ArticleCategory, type ArticleDTO, type ArticleImage } from "./types";

/**
 * Every article, newest first.
 *
 * `publishedAt` is an ISO date, so a plain string comparison is already
 * chronological; `id` only breaks ties, which keeps the order stable when two
 * pieces share a date.
 */
export function getAllArticles(): ArticleDTO[] {
  return [...ARTICLES].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id - a.id
  );
}

/**
 * The three cards on the home page.
 *
 * Records marked `featured` win, in the order they appear in `records.ts`; if
 * fewer than `limit` are marked, the newest remaining articles fill the gap so
 * the section can never collapse to an empty row.
 */
export function getFeaturedArticles(limit = 3): ArticleDTO[] {
  const featured = ARTICLES.filter((article) => article.featured);
  if (featured.length >= limit) return featured.slice(0, limit);

  const fill = getAllArticles().filter(
    (article) => !featured.some((picked) => picked.id === article.id)
  );
  return [...featured, ...fill].slice(0, limit);
}

export function getArticleBySlug(slug: string): ArticleDTO | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return ARTICLES.map((article) => article.slug);
}

/**
 * A few other articles for the foot of a piece.
 *
 * Same-category neighbours come first (they answer the same question), then the
 * rest of the magazine, newest first. The article itself is never included.
 */
export function getRelatedArticles(article: ArticleDTO, limit = 3): ArticleDTO[] {
  const others = getAllArticles().filter((item) => item.id !== article.id);
  const sameCategory = others.filter((item) => item.category === article.category);
  const rest = others.filter((item) => item.category !== article.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

/** Categories that actually have articles, in the canonical order. */
export function getCategories(): ArticleCategory[] {
  return ARTICLE_CATEGORIES.filter((category) =>
    ARTICLES.some((article) => article.category === category)
  );
}

/** How many articles each category holds, for the archive filter chips. */
export function getCategoryCounts(): Array<{ category: ArticleCategory; count: number }> {
  return getCategories().map((category) => ({
    category,
    count: ARTICLES.filter((article) => article.category === category).length,
  }));
}

/** Every article in one category, newest first. */
export function getArticlesByCategory(category: ArticleCategory): ArticleDTO[] {
  return getAllArticles().filter((article) => article.category === category);
}

/** Narrows an unknown URL parameter to a real category. */
export function parseCategory(value: string | undefined): ArticleCategory | undefined {
  if (!value) return undefined;
  return getCategories().find((category) => category === value);
}

/**
 * Persian calendar, formatted on the server so the markup is identical on every
 * request. `fa-IR` resolves to the Persian (Solar Hijri) calendar with Persian
 * digits; if a runtime ships without that locale data it falls back to the raw
 * ISO date instead of failing.
 */
const DATE_FORMATTER = new Intl.DateTimeFormat("fa-IR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatArticleDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    return DATE_FORMATTER.format(date);
  } catch {
    return iso;
  }
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Latin digits → Persian digits, so metadata matches the Persian dates. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** The reading-time line, e.g. «۶ دقیقه مطالعه». */
export function readingTimeLabel(minutes: number): string {
  return `${toPersianDigits(minutes)} ${ARTICLE_CONFIG.labels.readingUnit}`;
}

/** The magazine's own copy, for components that need several labels at once. */
export function getMagazineConfig() {
  return ARTICLE_CONFIG;
}
