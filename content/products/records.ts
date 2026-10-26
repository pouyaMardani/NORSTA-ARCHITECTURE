/**
 * The catalogue itself.
 *
 * ── WHAT THIS FILE IS ──────────────────────────────────────────────────────
 * A *starter* catalogue: eight records that hold the shelves, the grid and the
 * filter row exactly as a full catalogue will, so the page's structure is real
 * and only its contents are provisional.
 *
 * ── WHAT IT DELIBERATELY DOES NOT SAY ──────────────────────────────────────
 * No record names a price, a pack size, a stock level, a delivery term or a
 * technical property. None of them has been supplied by the studio, and every
 * one of them is something a customer could hold the studio to — so the records
 * name the *item* and stop there. `description` says what the thing is, never
 * how well it performs.
 *
 * ── HOW TO REPLACE A RECORD ────────────────────────────────────────────────
 *   1. Correct `name` and `description` to the studio's own words.
 *   2. Point `image.src` at the real photograph, then correct `image.width`,
 *      `image.height` and `image.alt`, and drop `image.placeholder`.
 *   3. Add whatever commercial fields are actually known to
 *      `content/products/types.ts` *and* to `components/ProductCard.tsx` — a
 *      field added here alone would be silently ignored by the page.
 *
 * Deleting a record closes its gap; adding one grows its shelf and is counted on
 * its filter chip automatically. Re-ordering is one `sortOrder` edit.
 *
 * ── THE PLACEHOLDERS ───────────────────────────────────────────────────────
 * Every record below starts out pointing at a plate drawn by
 * `scripts/make-product-plates.mjs` — the tinted surface in the record's own
 * `tintHex`, marked `TEMPORARY PLATE`. A card prints «تصویر موقت» over it, so a
 * stand-in is never presented as a photograph of a real product. Regenerate
 * them all with `node scripts/make-product-plates.mjs`.
 */

import { placeholderImage } from "./config";

import type { ProductDTO } from "./types";

export const PRODUCTS: ProductDTO[] = [
  /* ---------------------------------------------------------- materials --- */
  {
    id: 1,
    slug: "microcement-base-powder",
    name: "پودر پایهی میکروسمنت",
    category: "materials",
    description: "پودری که لایهی زیرین سطح با آن ساخته میشود؛ بستری یکدست برای رویه.",
    image: placeholderImage(
      "microcement-base-powder",
      "تصویر موقت پودر پایهی میکروسمنت؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#cfc0a8",
    sortOrder: 10,
  },
  {
    id: 2,
    slug: "microcement-topcoat-powder",
    name: "پودر رویهی میکروسمنت",
    category: "materials",
    description: "پودر رویه که بافت و رنگ نهایی سطح از آن ساخته میشود.",
    image: placeholderImage(
      "microcement-topcoat-powder",
      "تصویر موقت پودر رویهی میکروسمنت؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#c2b096",
    sortOrder: 20,
  },

  /* -------------------------------------------------------------- tools --- */
  {
    id: 3,
    slug: "stainless-trowel",
    name: "مالهی فولادی",
    category: "tools",
    description: "مالهی فولادی برای کشیدن و فشردن لایههای میکروسمنت روی سطح.",
    image: placeholderImage(
      "stainless-trowel",
      "تصویر موقت مالهی فولادی؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#8f8d88",
    sortOrder: 10,
  },
  {
    id: 4,
    slug: "finishing-spatula",
    name: "کاردک پرداخت",
    category: "tools",
    description: "کاردک باریک برای پرداخت گوشهها، لبهها و جاهایی که ماله نمیرسد.",
    image: placeholderImage(
      "finishing-spatula",
      "تصویر موقت کاردک پرداخت؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#a09d97",
    sortOrder: 20,
  },

  /* ------------------------------------------------------- starter kits --- */
  {
    id: 5,
    slug: "practice-kit-basic",
    name: "پک تمرین پایه",
    category: "starter-kits",
    description: "بستهی تمرینی برای آشنایی با متریال و ابزار، پیش از اجرای واقعی روی سطح.",
    image: placeholderImage(
      "practice-kit-basic",
      "تصویر موقت پک تمرین پایه؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#c9a978",
    sortOrder: 10,
  },
  {
    id: 6,
    slug: "practice-kit-colour",
    name: "پک تمرین رنگ",
    category: "starter-kits",
    description: "بستهی تمرینی برای آزمودن رنگها و بافتها روی پنل نمونه، پیش از انتخاب نهایی.",
    image: placeholderImage(
      "practice-kit-colour",
      "تصویر موقت پک تمرین رنگ؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#bf9a6a",
    sortOrder: 20,
  },

  /* ------------------------------------------------------------ samples --- */
  {
    id: 7,
    slug: "sample-board-colours",
    name: "پنل نمونهی رنگ",
    category: "samples",
    description: "پنل نمونه برای دیدن رنگها در نور همان فضایی که قرار است اجرا شود.",
    image: placeholderImage(
      "sample-board-colours",
      "تصویر موقت پنل نمونهی رنگ؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#d8cbb6",
    sortOrder: 10,
  },
  {
    id: 8,
    slug: "sample-board-textures",
    name: "پنل نمونهی بافت",
    category: "samples",
    description: "پنل نمونه برای مقایسهی بافت و پرداخت سطحها در کنار یکدیگر.",
    image: placeholderImage(
      "sample-board-textures",
      "تصویر موقت پنل نمونهی بافت؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#b8a68d",
    sortOrder: 20,
  },
];
