/**
 * Shared academy configuration.
 *
 * Everything that is *not* specific to one lesson lives here: the photograph
 * pool, the instructor's record, the complete collection's description and its
 * configurable learning outcomes, the section copy and the micro-labels the
 * cards and the lesson page print. Edit this file to re-brand the academy; edit
 * `records.ts` to change what it teaches.
 */

import { SITE_INSTAGRAM_URL } from "@/lib/site";

import type {
  AcademyCopy,
  AcademyImage,
  AcademyInstructorDTO,
  AcademyLabels,
  TrainingCollectionDTO,
} from "./types";

/**
 * The photograph pool.
 *
 * This repository ships no dedicated academy photography, so — exactly as the
 * magazine and the project gallery do — the academy names the studio's own
 * stills once here and every record points at an entry instead of repeating a
 * path. That is why no record can point at a missing file, and why changing a
 * photograph is a one-line edit that updates everything using it.
 *
 * The alt texts are the ones this project already publishes for these
 * photographs (`content/projects/config.ts`), kept verbatim: they describe what
 * each still actually shows. Swap the `src` for approved academy photography
 * when it exists — no styling change is needed, because every plate crops its
 * source with `object-fit:cover` inside a fixed aspect box.
 */
export const ACADEMY_IMAGES = {
  /** A wide interior — the landing page's dominant hero photograph. */
  courtyard: {
    src: "/images/about-courtyard.png",
    alt: "فضای داخلی سنگی با نور طبیعی و دیوارهای مادهای",
    caption: "فضای داخلی سنگی",
  },
  /** The material detail the academy is about. */
  microcementDetail: {
    src: "/images/project-minimal-residence.png",
    alt: "جزئیات اجرای میکروسمنت در یک فضای داخلی",
    caption: "جزئیات اجرای میکروسمنت",
  },
  /** Architectural surface texture — the layered detail in a composition. */
  archDetail: {
    src: "/images/services-arch.png",
    alt: "جزئیات معماری و بافت سطوح نما",
    caption: "بافت سطوح نما",
  },
  /** Tools-and-materials register: a wooden pavilion's joinery and grain. */
  materials: {
    src: "/images/proj4.png",
    alt: "جزئیات مصالح و سطح یک پاویون چوبی",
    caption: "جزئیات مصالح",
  },
  /** Substrate register: plain concrete surfaces before any finish. */
  substrate: {
    src: "/images/project-corporate-headquarters.png",
    alt: "نمای بیرونی ساختمان اداری با سطوح بتنی",
    caption: "سطوح بتنی نما",
  },
  /** A finished volume — the collection's lead image. */
  culturalCenter: {
    src: "/images/project-cultural-center.png",
    alt: "حجم سفید مرکز فرهنگی در برابر آسمان",
    caption: "حجم سفید در برابر آسمان",
  },
  /** A second volume for the collection's collage. */
  pavilion: {
    src: "/images/proj3.png",
    alt: "پاویون چای با سطوح صاف و بازشوهای کشیده",
    caption: "سطوح صاف پاویون",
  },
  /** Light stone steps — used as the instructor block's material plate. */
  stairs: {
    src: "/images/contact-stairs.png",
    alt: "پلکان سنگی روشن در کنار درخت زیتون",
    caption: "پلکان سنگی",
  },
  /** A calm exterior, for the composition's smaller counterweight. */
  villa: {
    src: "/images/hero-villa.png",
    alt: "ویلایی با سطوح ساده و پنجرههای بزرگ",
    caption: "سطوح سادهی ویلا",
  },
} satisfies Record<string, AcademyImage>;

/**
 * ⚠ EDITABLE — the instructor.
 *
 * `name` and `credit` are the only facts the academy claims about her, and they
 * are the ones the brief supplies. Nothing else is asserted: there is no
 * biography, no certification, no award and no year count here, because none has
 * been supplied and inventing one would break Norsta's own rules.
 *
 * `image` is therefore a material photograph of the studio's own work rather
 * than a portrait — the block is composed from the photograph, the name and the
 * type. Replace the `src` with an approved portrait when one exists; the plate
 * crops whatever it is given into the same silhouette.
 */
export const ACADEMY_INSTRUCTOR: AcademyInstructorDTO = {
  name: "افسانه مردانی",
  role: "مدرس آکادمی میکروسمنت نورستا",
  credit: "با آموزشهای افسانه مردانی",
  image: ACADEMY_IMAGES.stairs,
  intro: [
    "آموزشهای آکادمی نورستا با افسانه مردانی همراه است؛ کسی که مسیر یادگیری را گامبهگام پیش میبرد: از شناخت متریال و ابزارها تا آمادهسازی زیرکار و رسیدن به یک سطح تمامشده.",
    "لحن این آموزشها کارگاهی است، نه تبلیغاتی. هر درس روی تصمیمهایی تمرکز دارد که در اجرا واقعاً به کار میآیند و نتیجهی کار را تغییر میدهند.",
  ],
  focus: [
    "شناخت میکروسمنت و رفتار آن روی سطح",
    "ابزار، متریال و ترتیب مراحل اجرا",
    "آمادهسازی زیرکار و کنترل پیش از شروع",
  ],
};

/**
 * ⚠ EDITABLE — the complete training collection.
 *
 * `outcomes` is the editable heart of the section: add, re-order or remove an
 * entry and the list on `/academy` follows, with no component change. Nothing
 * here states a price, a discount, a guarantee, a lesson count, a certificate or
 * a course length, because none of those has been supplied.
 *
 * `instagramUrl` is where the purchase enquiry goes: the studio's own profile,
 * read from `lib/site.ts` rather than written out here, so the showcase on the
 * home page, the contact block and the `Organization` node cannot drift away
 * from the academy. Point it at a dedicated academy account in `lib/site.ts` if
 * one is ever created; nothing else has to change.
 */
export const TRAINING_COLLECTION: TrainingCollectionDTO = {
  name: "مجموعهی کامل آموزش میکروسمنت",
  eyebrow: "دورهی کامل",
  title: "مسیر کامل یادگیری میکروسمنت",
  description: [
    "مجموعهی کامل، همان مسیری را که درسهای رایگان آغاز کردهاند ادامه میدهد و تا اجرای یک سطح تمامشده پیش میرود: از انتخاب و آمادهسازی زیرکار تا لایهبندی، پرداخت، انتخاب سیلر و نگهداری سطح.",
    "تمرکز این مجموعه بر تصمیمهای عملی کارگاه است؛ همان تصمیمهایی که تفاوت میان یک سطح معمولی و یک سطح ماندگار را میسازند.",
  ],
  outcomes: [
    "شناخت خانوادههای میکروسمنت و تفاوت میان سیستمها",
    "آمادهسازی زیرکار و کنترل شرایط پیش از اجرا",
    "ابزار، لایهبندی و ترتیب درست مراحل",
    "پرداخت، انتخاب سیلر و نگهداری سطح",
  ],
  ctaLabel: "دریافت اطلاعات خرید",
  ctaNote:
    "خرید مجموعهی کامل از طریق دایرکت اینستاگرام نورستا انجام میشود؛ پرسشهای شما دربارهی محتوا، شرایط و نحوهی دسترسی همانجا پاسخ داده میشود.",
  instagramUrl: SITE_INSTAGRAM_URL,
  images: [ACADEMY_IMAGES.culturalCenter, ACADEMY_IMAGES.microcementDetail],
};

/** The academy's own editorial copy. ⚠ EDITABLE — all of it is plain text. */
export const ACADEMY_COPY: AcademyCopy = {
  name: "آکادمی میکروسمنت نورستا",
  eyebrow: "آکادمی میکروسمنت",
  titleLines: ["از شناخت متریال", "تا خلق سطوح ماندگار"],
  lede: "با آموزشهای تخصصی میکروسمنت، با متریال، ابزارها و اصول اجرای سطوح دکوراتیو آشنا شوید و مسیر یادگیری خود را با Norsta آغاز کنید.",
  ctaPrimary: "شروع تماشای درسهای رایگان",
  ctaSecondary: "دریافت اطلاعات خرید",
  lessonsTitle: "سه درس آغازین، رایگان",
  lessonsIntro:
    "پیش از ورود به مجموعهی کامل، مسیر را با سه درس آغازین بشناسید: از چیستی میکروسمنت تا ابزار و متریال و آمادهسازی زیرکار. هر سه درس برای همه آزاد است.",
  instructorEyebrow: "مدرس آکادمی",
  promoEyebrow: "آکادمی نورستا",
  promoTitle: "میکروسمنت را حرفهای یاد بگیرید",
  promoBody:
    "آکادمی نورستا مسیر یادگیری میکروسمنت را گامبهگام پیش میبرد؛ از شناخت متریال و ابزارها تا آمادهسازی زیرکار و اجرای سطحهای دکوراتیو.",
  promoCtaLabel: "ورود به آکادمی",
  promoNote: "سه درس آغازین رایگان است.",
};

/** Micro-labels. ⚠ EDITABLE — kept together so the wording stays consistent. */
export const ACADEMY_LABELS: AcademyLabels = {
  free: "رایگان",
  lesson: "درس",
  view: "مشاهده آموزش",
  minutes: "دقیقه",
  sequence: "مسیر یادگیری",
  outline: "در این درس میبینید",
  related: "درسهای دیگر",
  previous: "درس قبلی",
  next: "درس بعدی",
  back: "بازگشت به آکادمی",
  videoSoonTitle: "ویدیوی این درس بهزودی در دسترس قرار میگیرد",
  videoSoonBody:
    "محتوای تصویری این درس در حال آمادهسازی است. تا آن زمان میتوانید فهرست آنچه در این درس میبینید و درسهای دیگر آکادمی را مرور کنید.",
  instructorBy: "مدرس",
  purchaseNoteLabel: "نحوهی خرید",
  notFoundTitle: "این درس پیدا نشد",
  notFoundLede:
    "نشانیای که باز کردهاید به درسی در آکادمی نورستا اشاره نمیکند؛ ممکن است جابهجا شده باشد یا هنوز منتشر نشده باشد.",
  notFoundAction: "بازگشت به آکادمی",
};

/** The academy's configuration, as one object for components that need it all. */
export const ACADEMY_CONFIG: {
  instructor: AcademyInstructorDTO;
  collection: TrainingCollectionDTO;
  copy: AcademyCopy;
  labels: AcademyLabels;
  /** Used wherever a cover is missing, so the UI can never render a broken box. */
  placeholderImage: AcademyImage;
  /** Where every purchase enquiry goes. Kept here so no component hard-codes it. */
  instagramUrl: string;
} = {
  instructor: ACADEMY_INSTRUCTOR,
  collection: TRAINING_COLLECTION,
  copy: ACADEMY_COPY,
  labels: ACADEMY_LABELS,
  placeholderImage: ACADEMY_IMAGES.courtyard,
  instagramUrl: TRAINING_COLLECTION.instagramUrl,
};
