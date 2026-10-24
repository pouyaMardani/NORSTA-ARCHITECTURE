/**
 * The magazine's data model.
 *
 * One shape feeds everything the magazine renders: the three cards on the home
 * page, the archive grid at `/articles` and the article page at
 * `/articles/<slug>`. Nothing about an article is declared outside its
 * `ArticleDTO` record, so adding, removing or re-ordering an article is a single
 * edit in `content/articles/records.ts`.
 *
 * Article bodies are stored as *data*, never as markup: a record holds an array
 * of `ArticleBlock`s, and `components/ArticleBody.tsx` renders exactly that
 * vocabulary. Records therefore stay plain, editable Persian text.
 */

/** A photograph plus the alt text that describes what it actually shows. */
export type ArticleImage = {
  src: string;
  alt: string;
  /** Optional caption, rendered under an inline image in the body. */
  caption?: string;
};

/**
 * One block of an article body. The union is closed on purpose: the renderer
 * handles every member and nothing else, so no block can be silently dropped.
 */
export type ArticleBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "quote"; text: string; source?: string }
  | { kind: "image"; image: ArticleImage };

/** Who the piece is by. See `ARTICLE_CONFIG.defaultAuthor`. */
export type ArticleAuthor = {
  name: string;
  /** Optional role line, e.g. the studio's technical desk. */
  role?: string;
};

/**
 * The magazine's section list — also the type of every record's `category`.
 *
 * This tuple is the single source of truth: `ArticleCategory` is derived from
 * it, so a typo in a record's category fails the type-check instead of quietly
 * creating a category with one article and no filter chip. Add a new section by
 * adding one line here; the archive filter follows automatically.
 */
export const ARTICLE_CATEGORIES = [
  "میکروسمنت",
  "مقایسه",
  "کاربردها",
  "اجرا",
  "پتینه",
  "نگهداری",
  "هزینه",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

/**
 * A complete article.
 *
 * `id` and `slug` are the two identities: `id` is the stable key used by React
 * and by re-ordering, `slug` is the public URL segment (`/articles/<slug>`).
 */
export type ArticleDTO = {
  /** Stable numeric key — free to change order without touching routes. */
  id: number;
  /** URL segment: English keywords, kebab-case, no Persian, never re-used. */
  slug: string;
  /** Display title (Persian). */
  title: string;
  /** One- or two-sentence summary used by the cards and as the body's lede. */
  excerpt: string;
  category: ArticleCategory;
  author: ArticleAuthor;
  /**
   * Publication date, always `YYYY-MM-DD` (Gregorian, UTC). The archive sorts on
   * this string and the UI formats it for Persian readers.
   */
  publishedAt: string;
  /** Estimated reading time in minutes. Shown as-is. */
  readingTime: number;
  coverImage: ArticleImage;
  /** `<title>` for the article page. The brand suffix is added by the layout. */
  seoTitle: string;
  /** `<meta name="description">`, roughly 120–165 characters. */
  seoDescription: string;
  /** Body blocks, in order. See `ArticleBlock`. */
  content: ArticleBlock[];
  /** Show this article in the three-card section on the home page. */
  featured?: boolean;
};
