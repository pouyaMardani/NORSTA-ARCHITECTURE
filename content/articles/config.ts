/**
 * Shared magazine configuration.
 *
 * Everything that is *not* specific to one article lives here: the byline every
 * record starts from, the pool of cover photographs, and the section's own
 * Persian copy. Edit this file to re-brand the magazine; edit
 * `records.ts` to change what it says.
 */

import type { ArticleAuthor, ArticleImage } from "./types";

/**
 * The sample-image pool.
 *
 * This repository ships no dedicated editorial photography, so the magazine
 * reuses the project's own images (`public/images/`) rather than adding a dozen
 * new files. Every entry is a local path, so no record can ever point at a
 * missing URL; a record may also point at any other local image directly.
 *
 * To replace a cover: change the `src` here (affects every article using it) or
 * in the single record in `records.ts` (affects that article only). The alt text
 * should keep describing what the photograph actually shows.
 */
export const ARTICLE_IMAGES = {
  courtyard: {
    src: "/images/about-courtyard.png",
    alt: "فضای داخلی سنگی با نور طبیعی و دیوارهای مادهای",
  },
  stairs: {
    src: "/images/contact-stairs.png",
    alt: "پلکان سنگی روشن در کنار درخت زیتون",
  },
  wetDetail: {
    src: "/images/project-minimal-residence.png",
    alt: "جزئیات اجرای میکروسمنت در یک فضای مرطوب",
  },
  headquarters: {
    src: "/images/project-corporate-headquarters.png",
    alt: "نمای بیرونی ساختمان اداری با سطوح بتنی",
  },
  culturalCenter: {
    src: "/images/project-cultural-center.png",
    alt: "حجم سفید مرکز فرهنگی در برابر آسمان",
  },
  teaPavilion: {
    src: "/images/proj3.png",
    alt: "پاویون چای با سطوح صاف و بازشوهای کشیده",
  },
  teaPavilionDetail: {
    src: "/images/proj4.png",
    alt: "جزئیات مصالح و سطح یک پاویون چوبی",
  },
  archDetail: {
    src: "/images/services-arch.png",
    alt: "جزئیات معماری و تکسچر سطوح نما",
  },
  villa: {
    src: "/images/hero-villa-poster.jpg",
    alt: "ویلایی با سطوح ساده و پنجرههای بزرگ",
  },
} satisfies Record<string, ArticleImage>;

/** Editorial copy for the magazine's chrome (Home section + archive + post). */
export type ArticleMagazineCopy = {
  /** Section heading and page title. */
  name: string;
  /** Line under the eyebrow on the home page. */
  eyebrow: string;
  /** Short standfirst shared by the home section and the archive header. */
  intro: string;
  /** Slightly longer version, used on the archive page only. */
  archiveIntro: string;
  /** Label of the link from the home section to the archive. */
  allArticlesLabel: string;
};

/** Micro-labels used by the card, the archive and the article page. */
export type ArticleLabels = {
  back: string;
  by: string;
  readingUnit: string;
  related: string;
  filterAll: string;
  filterLabel: string;
  empty: string;
  emptyReset: string;
};

export const ARTICLE_CONFIG: {
  defaultAuthor: ArticleAuthor;
  placeholderImage: ArticleImage;
  magazine: ArticleMagazineCopy;
  labels: ArticleLabels;
} = {
  /**
   * ⚠ EDITABLE — the byline all twelve records start from.
   *
   * The site's own rules forbid inventing a person (see `components/Craftsman.tsx`),
   * so the byline is the studio, not a fabricated author. Replace the name here —
   * or in a single record — when real authors exist.
   */
  defaultAuthor: {
    name: "استودیو نورستا",
    role: "دفتر فنی و اجرا",
  },

  /** Used wherever a cover is missing, so the UI can never render a broken box. */
  placeholderImage: ARTICLE_IMAGES.courtyard,

  magazine: {
    name: "مجله نورستا",
    eyebrow: "یادداشتهای مصالح و اجرا",
    intro:
      "در این یادداشتها از میکروسمنت، پتینه و سطحهای معماری مینویسیم؛ از آمادهسازی بستر و مراحل اجرا تا انتخاب رنگ، نگهداری و آنچه بر هزینهی پروژه اثر میگذارد.",
    archiveIntro:
      "مجله نورستا جای یادداشتهای فنی و کاربردی استودیو دربارهی میکروسمنت، پتینه، مصالح و اجرای سطحهای معماری است. آنچه در گفتوگو با کارفرما پرسیده میشود و آنچه در اجرا تجربه میکنیم، اینجا مینویسیم؛ بدون وعدهی اضافه و با همان قیدهایی که در کارگاه رعایت میکنیم.",
    allArticlesLabel: "مشاهده همه مقالات",
  },

  labels: {
    back: "بازگشت به مجله",
    by: "نوشتهی",
    readingUnit: "دقیقه مطالعه",
    related: "بیشتر بخوانید",
    filterAll: "همه",
    filterLabel: "موضوع",
    empty: "برای این موضوع هنوز مقالهای منتشر نشده است.",
    emptyReset: "نمایش همهی مقالات",
  },
};
