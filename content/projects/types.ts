/**
 * The projects' data model.
 *
 * One shape feeds everything the project section renders: the continuous
 * horizontal track on the home page, the project page at `/projects/<slug>` and
 * the related-projects row under it. Nothing about a project is declared outside
 * its `ProjectDTO` record, so adding, removing or re-ordering a project is a
 * single edit in `content/projects/records.ts`.
 *
 * Copy is stored as data, never as markup: `description` is an array of
 * paragraphs and the page lays them out. A record therefore stays plain,
 * editable Persian text with no styling decisions inside it.
 */

/** A photograph plus the alt text that describes what it actually shows. */
export type ProjectImage = {
  src: string;
  alt: string;
  /**
   * Caption for the shot — a short description of the photograph itself, not a
   * claim about the project. Used under the image on a project page and as the
   * lightbox caption.
   */
  caption?: string;
};

/**
 * The studio's project categories — also the type of every record's `category`.
 *
 * This tuple is the single source of truth: `ProjectCategory` is derived from
 * it, so a typo in a record fails the type-check instead of quietly creating a
 * category nobody claims. Add a category by adding one line here.
 */
export const PROJECT_CATEGORIES = ["مسکونی", "اداری", "فرهنگی", "پاویون"] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/**
 * A complete project.
 *
 * `id` and `slug` are the two identities: `id` is the stable key used by React
 * and by re-ordering, `slug` is the public URL segment (`/projects/<slug>`).
 */
export type ProjectDTO = {
  /** Stable numeric key — free to change order without touching routes. */
  id: number;
  /** URL segment: English keywords, kebab-case, no Persian, never re-used. */
  slug: string;
  /** Display title (Persian). */
  title: string;
  /** Must be one of `PROJECT_CATEGORIES` in this file. */
  category: ProjectCategory;
  /**
   * Where the project stands, written the way the studio writes it. Omit the
   * field entirely rather than guessing: the page only prints the rows it has.
   */
  location?: string;
  /** One or two sentences: the gallery card's line and the page's lede. */
  shortDescription: string;
  /** Full description, one string per paragraph, rendered in order. */
  description: string[];
  /** The still the gallery card and the project page hero use. */
  coverImage: ProjectImage;
  /** The page's own gallery, in order. May be empty. */
  galleryImages: ProjectImage[];
  /**
   * Completion, always `YYYY-MM-DD` (Gregorian) when the day is known, or a
   * bare `YYYY` when only the year is. The page formats the full date for
   * Persian readers and prints a year as-is. Omit when unknown.
   */
  completedAt?: string;
  /** Materials, one entry each. Omitted when unknown rather than invented. */
  materials?: string[];
  /** Show this project in the home-page gallery. */
  featured: boolean;
  /** `<title>` for the project page. The brand suffix is added by the layout. */
  seoTitle: string;
  /** `<meta name="description">`, roughly 120–165 characters. */
  seoDescription: string;
};
