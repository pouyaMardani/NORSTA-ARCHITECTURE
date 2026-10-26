/**
 * Shared project configuration.
 *
 * Everything that is *not* specific to one project lives here: the pool of
 * photographs, the section's own Persian copy and the micro-labels the gallery
 * and the project pages print. Edit this file to re-brand the section; edit
 * `records.ts` to change what it shows.
 */

import type { ProjectImage } from "./types";

/**
 * The photograph pool.
 *
 * The repository ships one image per project (plus the studio's own material
 * and interior stills), so the pool below names them once and every record
 * points at an entry instead of repeating a path. That is why no record can
 * point at a missing file, and why changing a photograph is a one-line edit
 * here that updates every project using it.
 *
 * The alt texts are the ones this project already published for these
 * photographs, kept verbatim: they describe what each still shows.
 */
export const PROJECT_IMAGES = {
  residence: {
    src: "/images/project-minimal-residence.png",
    alt: "جزئیات اجرای میکروسمنت در یک فضای داخلی",
    caption: "سطح یکدست داخلی",
  },
  headquarters: {
    src: "/images/project-corporate-headquarters.png",
    alt: "نمای بیرونی ساختمان اداری با سطوح بتنی",
    caption: "سطوح بتنی نما",
  },
  culturalCenter: {
    src: "/images/project-cultural-center.png",
    alt: "حجم سفید مرکز فرهنگی در برابر آسمان",
    caption: "حجم سفید در برابر آسمان",
  },
  teaPavilion: {
    src: "/images/proj3.png",
    alt: "پاویون چای با سطوح صاف و بازشو‌های کشیده",
    caption: "بازشو‌های کشیده",
  },
  teaPavilionDetail: {
    src: "/images/proj4.png",
    alt: "جزئیات مصالح و سطح یک پاویون چوبی",
    caption: "جزئیات مصالح چوب",
  },
  courtyard: {
    src: "/images/about-courtyard.png",
    alt: "فضای داخلی سنگی با نور طبیعی و دیوار‌های ماده‌ای",
    caption: "فضای داخلی سنگی",
  },
  stairs: {
    src: "/images/after.png",
    alt: "پلکان سنگی روشن در کنار درخت زیتون",
    caption: "پلکان سنگی",
  },
  archDetail: {
    src: "/images/befor.png",
    alt: "جزئیات معماری و بافت سطوح نما",
    caption: "جزئیات سطوح نما",
  },
  villa: {
    src: "/images/hero-villa.png",
    alt: "ویلایی با سطوح ساده و پنجره‌های بزرگ",
    caption: "سطوح سادهی ویلا",
  },
} satisfies Record<string, ProjectImage>;

/** The section's own copy (the home-page gallery and the pages' titles). */
export type ProjectSectionCopy = {
  /** Used as the `<title>` segment for every `/projects` route. */
  name: string;
  /** Page title under the eyebrow. */
  title: string;
  /** Eyebrow before the title; the project count is printed in front of it. */
  eyebrow: string;
  /** Accessible name of the home-page gallery. */
  galleryLabel: string;
  /**
   * The section's introduction, one entry per line. The line breaks are part of
   * the design, so they travel with the copy instead of living in a component.
   */
  introLines: string[];
};

/** Micro-labels used by the gallery, the project page and its not-found body. */
export type ProjectLabels = {
  back: string;
  gallery: string;
  related: string;
  location: string;
  completedAt: string;
  materials: string;
  /** Tooltip/label of a gallery shot's zoom control. */
  zoom: string;
  /** Label of the arrow that jumps back into the home-page gallery. */
  jumpToGallery: string;
  notFoundTitle: string;
  notFoundLede: string;
  notFoundAction: string;
};

export const PROJECT_CONFIG: {
  placeholderImage: ProjectImage;
  section: ProjectSectionCopy;
  labels: ProjectLabels;
} = {
  /** Used wherever a still is missing, so the UI can never render a broken box. */
  placeholderImage: PROJECT_IMAGES.courtyard,

  section: {
    name: "پروژه‌های نورستا",
    title: "پروژه‌های اخیر",
    eyebrow: "پروژه‌ی منتخب",
    galleryLabel: "گالری پروژه‌های نورستا",
    introLines: [
      "گزیده‌ای کوچک از پروژه‌های اجرا‌شده؛",
      "پژوهش‌هایی در جرم، آستانه و نور که از",
      "جست‌و‌جوی پیوسته‌ی استودیو برای فرمی آرام برآمده‌اند.",
    ],
  },

  labels: {
    back: "بازگشت به صفحه اصلی",
    gallery: "گالری پروژه",
    related: "پروژه‌های دیگر",
    location: "موقعیت",
    completedAt: "پایان کار",
    materials: "مصالح",
    zoom: "بزرگ‌نمایی تصویر",
    jumpToGallery: "پرش به پروژه‌ها",
    notFoundTitle: "این پروژه پیدا نشد",
    notFoundLede:
      "نشانی‌ای که باز کرده‌اید به پروژه‌ای در گالری نورستا اشاره نمی‌کند؛ ممکن است جابه‌جا شده باشد یا هنوز منتشر نشده باشد.",
    notFoundAction: "بازگشت به گالری پروژه‌ها",
  },
};
