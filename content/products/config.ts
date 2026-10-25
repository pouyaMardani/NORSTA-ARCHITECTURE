/**
 * Shared catalogue configuration.
 *
 * Everything that is not specific to one product lives here: where the temporary
 * plates live, how a product image is built, the four shelves of the catalogue,
 * where an enquiry goes, and the Persian copy the home-page showcase and the
 * `/products` page print. Edit this file to re-brand the catalogue; edit
 * `records.ts` to change what is on the shelves.
 */

import { PRODUCT_CATEGORY_IDS } from "./types";

import type { ProductCategory, ProductCategoryId, ProductImage } from "./types";

/**
 * The studio's Instagram profile.
 *
 * The catalogue's only ordering route: every enquiry, every availability
 * question and every order is arranged in a direct message here. It is the same
 * destination the site's Instagram section and the academy already use, kept in
 * one place so it can never drift between them.
 */
export const INSTAGRAM_URL = "https://www.instagram.com/norsta.home/";

/** The site's production origin, used for the page's canonical address. */
export const SITE_ORIGIN = "https://norsta.ir";

/** Directory of the temporary plates, relative to `public/`. */
export const PRODUCT_PLACEHOLDER_DIR = "/images/products";

/**
 * The temporary plates.
 *
 * Every record in `records.ts` — and every category above it — starts out
 * pointing at one of these: a tinted plate carrying the item's own name and the
 * words `TEMPORARY PLATE`, so a stand-in can never be mistaken for a photograph
 * of the real product. They are ordinary PNG files in
 * `public/images/products/`, drawn by `scripts/make-product-plates.mjs`.
 *
 * Two sizes, because the two uses are different: a category plate fills a wide
 * editorial card on the home page, a product plate fills a card in the grid.
 * Both are 4/3 — the proportion every card is cut for.
 *
 * Replacing one is a single edit in `records.ts` — point `image.src` at the real
 * photograph, correct `width`/`height` and `alt`, and drop `placeholder: true`.
 * Nothing else has to change: the card, the badge and the filter all follow.
 */
export const PRODUCT_PLATE_SIZES = {
  category: { width: 1600, height: 1200 },
  product: { width: 1200, height: 900 },
} as const;

/**
 * Builds the image entry for a product's temporary plate.
 *
 * `slug` matches the record it belongs to, so the plate's file name and the
 * product's identity stay in step, and `alt` describes what the plate shows — a
 * temporary surface, never a claim about the product.
 */
export function placeholderImage(
  slug: string,
  alt: string,
  size: { width: number; height: number } = PRODUCT_PLATE_SIZES.product
): ProductImage {
  return {
    src: `${PRODUCT_PLACEHOLDER_DIR}/placeholder-${slug}.png`,
    width: size.width,
    height: size.height,
    alt,
    placeholder: true,
  };
}

/** The same, for one of the four shelves. `id` is the category's own id. */
function categoryImage(id: ProductCategoryId, alt: string): ProductImage {
  return {
    src: `${PRODUCT_PLACEHOLDER_DIR}/category-${id}.png`,
    width: PRODUCT_PLATE_SIZES.category.width,
    height: PRODUCT_PLATE_SIZES.category.height,
    alt,
    placeholder: true,
  };
}

/**
 * The four shelves of the catalogue, in the order the filter row and the
 * home-page showcase present them.
 *
 * A category is a shelf, not a product: each one names what belongs on it and
 * nothing about a specific item. Every record's `category` must be one of these
 * ids, so this array is also what makes a mistyped record fail the type-check.
 */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "materials",
    label: "مواد و پودرها",
    title: "مواد و پودرهای میکروسمنت",
    description:
      "پایه، پودر و افزودنیهایی که لایهی میکروسمنت از آنها ساخته میشود؛ همان چیزی که بستر و رویهی سطح را میسازد.",
    image: categoryImage(
      "materials",
      "تصویر موقت دستهی مواد و پودرهای میکروسمنت؛ جایگزین عکس واقعی محصولات"
    ),
    tintHex: "#cfc0a8",
  },
  {
    id: "tools",
    label: "ابزار اجرا",
    title: "ابزار اجرای میکروسمنت",
    description:
      "ماله، کاردک و ابزار پرداختی که با آنها لایه کشیده، فشرده و در نهایت یکدست میشود.",
    image: categoryImage(
      "tools",
      "تصویر موقت دستهی ابزار اجرای میکروسمنت؛ جایگزین عکس واقعی محصولات"
    ),
    tintHex: "#8f8d88",
  },
  {
    id: "starter-kits",
    label: "پک تمرین",
    title: "پک شروع تمرین",
    description:
      "بستههای تمرینی برای آشنایی با متریال و ابزار پیش از اجرای واقعی؛ برای کسانی که میخواهند اول روی پنل آزمون کنند.",
    image: categoryImage(
      "starter-kits",
      "تصویر موقت دستهی پکهای شروع تمرین؛ جایگزین عکس واقعی محصولات"
    ),
    tintHex: "#c9a978",
  },
  {
    id: "samples",
    label: "نمونه و رنگ",
    title: "نمونه متریال و رنگ",
    description:
      "پنلهای نمونه برای دیدن رنگ، بافت و پرداخت در نور محل پروژه؛ پیش از آنکه تصمیم نهایی گرفته شود.",
    image: categoryImage(
      "samples",
      "تصویر موقت دستهی نمونه متریال و رنگ؛ جایگزین عکس واقعی محصولات"
    ),
    tintHex: "#d8cbb6",
  },
];

/** Guard: the array above must cover `PRODUCT_CATEGORY_IDS` exactly once each. */
export const PRODUCT_CATEGORY_ORDER: ProductCategoryId[] = [...PRODUCT_CATEGORY_IDS];

/* ------------------------------------------------------------------ copy ---- */

/**
 * The home page's showcase copy.
 *
 * `intro` is one entry per line: the line breaks are part of the design, so they
 * travel with the copy instead of living in a component.
 */
export type ProductSectionCopy = {
  /** Used as the section's accessible name. */
  name: string;
  /** Eyebrow before the title. */
  eyebrow: string;
  /** The heading itself. Kept short: it is set at display size, on one line. */
  title: string;
  /** Label of the Latin material words printed as an ornament beside the heading. */
  latinNote: string;
  /** Editorial introduction, one entry per line. */
  intro: string[];
  /** Label of the link from a shelf card into that shelf's filtered view. */
  browseLabel: string;
  /** Label of the link from the showcase to the whole catalogue. */
  ctaLabel: string;
  /** The showcase's own Instagram button. */
  instagramCtaLabel: string;
  /** The plain sentence beside that button. */
  instagramNote: string;
};

/** The `/products` page's copy. */
export type ProductPageCopy = {
  /** Part of the document title and of every caption on the page. */
  name: string;
  /** Eyebrow above the hero heading. */
  eyebrow: string;
  /** Hero heading, one entry per masked line. */
  titleLines: string[];
  /** The hero's standfirst. */
  lede: string;
  /** The order route, stated plainly under the hero's actions. */
  orderNote: string;
  /** Eyebrow above the catalogue's filter row. */
  catalogEyebrow: string;
  /** `<title>` for `/products`. */
  seoTitle: string;
  /** `<meta name="description">`, roughly 120–165 characters. */
  seoDescription: string;
  /** The closing band that offers help choosing. */
  helpEyebrow: string;
  helpTitle: string;
  helpBody: string;
};

/** Micro-labels used by the cards, the filter row and the empty state. */
export type ProductLabels = {
  /** Accessible name of the filter row. */
  filterLabel: string;
  /** The chip that shows everything. */
  filterAll: string;
  /** The noun a count is printed with: «۸ محصول». */
  countUnit: string;
  /** Printed while a plate is still a stand-in. */
  placeholder: string;
  /** The full enquiry label, used where there is room for a sentence. */
  inquiry: string;
  /** The same action, short enough for a card's footer. */
  inquiryShort: string;
  /** Row label of a card's category. */
  category: string;
  /** Shown when a shelf holds nothing. */
  empty: string;
  emptyReset: string;
};

export const PRODUCT_CONFIG: {
  instagramUrl: string;
  siteOrigin: string;
  categories: ProductCategory[];
  section: ProductSectionCopy;
  page: ProductPageCopy;
  labels: ProductLabels;
} = {
  instagramUrl: INSTAGRAM_URL,
  siteOrigin: SITE_ORIGIN,
  categories: PRODUCT_CATEGORIES,

  section: {
    name: "متریال و ابزار نورستا",
    eyebrow: "متریال و ابزار",
    title: "آنچه برای اجرا لازم است",
    latinNote: "MICROCEMENT MATERIALS & TOOLS",
    intro: [
      "متریال، ابزار و پکهای تمرین میکروسمنت؛",
      "چیزهایی که پیش از اجرا لازم میشوند و در",
      "گفتوگوی مستقیم انتخاب و سفارش داده میشوند.",
    ],
    browseLabel: "دیدن این دسته",
    ctaLabel: "مشاهده محصولات",
    instagramCtaLabel: "استعلام و سفارش در اینستاگرام",
    instagramNote:
      "موجودی و ثبت سفارش از طریق دایرکت اینستاگرام انجام میشود؛ در پیام، نام محصول را بنویسید.",
  },

  page: {
    name: "محصولات نورستا",
    eyebrow: "کاتالوگ متریال و ابزار",
    titleLines: ["متریال و ابزار", "اجرای میکروسمنت"],
    lede: "متریال، ابزار و پکهای تمرین میکروسمنت؛ آنچه برای اجرای یک سطح یکدست لازم است.",
    orderNote:
      "برای استعلام موجودی، دریافت راهنمای انتخاب یا ثبت سفارش، از طریق دایرکت با ما در ارتباط باش.",
    catalogEyebrow: "فهرست محصولات",
    seoTitle: "محصولات نورستا — متریال و ابزار میکروسمنت",
    seoDescription:
      "متریال، ابزار و پکهای تمرین میکروسمنت نورستا؛ کاتالوگی برای انتخاب متریال و ابزار اجرا و ثبت سفارش از طریق اینستاگرام.",
    helpEyebrow: "راهنمای انتخاب",
    helpTitle: "در انتخاب متریال کمک میخواهید؟",
    helpBody:
      "اگر مطمئن نیستید کدام متریال یا ابزار برای سطح شما مناسب است، پیش از سفارش پیام بدهید؛ در گفتوگو گزینهها را با هم مرور میکنیم و بعد سفارش را ثبت میکنیم.",
  },

  labels: {
    filterLabel: "دستهبندی محصولات",
    filterAll: "همه محصولات",
    countUnit: "محصول",
    placeholder: "تصویر موقت",
    inquiry: "استعلام و سفارش در اینستاگرام",
    inquiryShort: "استعلام و سفارش",
    category: "دسته",
    empty: "برای این دسته هنوز محصولی ثبت نشده است.",
    emptyReset: "نمایش همهی محصولات",
  },
};
