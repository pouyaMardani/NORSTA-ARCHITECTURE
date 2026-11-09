/**
 * The catalogue itself.
 *
 * ── WHAT THIS FILE IS ──────────────────────────────────────────────────────
 * The studio's own products: the microcement powder, the ready-mix paste, the
 * fibreglass mesh, the universal colour, the practice kit, the two trowels and
 * the two sample boards — the items the studio actually works with and sells.
 * The names and descriptions are the studio's own words for them.
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
 * Every record below still points at a plate drawn by
 * `scripts/make-product-plates.mjs` — the tinted surface in the record's own
 * `tintHex`, marked `TEMPORARY PLATE`. A card prints «تصویر موقت» over it, so a
 * stand-in is never presented as a photograph of a real product. The products
 * are real; their photographs are not here yet. Regenerate them all with
 * `node scripts/make-product-plates.mjs`.
 */

import { placeholderImage } from "./config";

import type { ProductDTO } from "./types";

export const PRODUCTS: ProductDTO[] = [
  /* ---------------------------------------------------------- materials --- */
  {
    id: 1,
    slug: "microcement-powder",
    name: "پودر میکروسمنت",
    category: "materials",
    description:
      "پودر میکروسمنت؛ ماده‌ی اصلی ساخت سطح که با آب مخلوط و لایه‌به‌لایه کشیده می‌شود.",
    image: placeholderImage(
      "microcement-powder",
      "تصویر موقت پودر میکروسمنت؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#cfc0a8",
    sortOrder: 10,
  },
  {
    id: 2,
    slug: "microcement-paste",
    name: "میکروسمنت خمیری",
    category: "materials",
    description:
      "میکروسمنت خمیری آماده‌ی مصرف؛ بدون مخلوط‌کردن، مستقیم روی سطح کشیده می‌شود.",
    image: placeholderImage(
      "microcement-paste",
      "تصویر موقت میکروسمنت خمیری؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#c2b096",
    sortOrder: 20,
  },
  {
    id: 3,
    slug: "fiberglass-mesh",
    name: "توری فایبرگلاس",
    category: "materials",
    description:
      "توری فایبرگلاس؛ شبکه‌ی تقویتی لایه‌ی پایه که ترک بستر را مهار می‌کند.",
    image: placeholderImage(
      "fiberglass-mesh",
      "تصویر موقت توری فایبرگلاس؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#b8b0a4",
    sortOrder: 30,
  },
  {
    id: 4,
    slug: "universal-colour",
    name: "رنگ یونورسال",
    category: "materials",
    description:
      "رنگ یونورسال؛ پیگمنت مایع برای رنگ‌کردن میکروسمنت، سازگار با همه‌ی سیستم‌ها.",
    image: placeholderImage(
      "universal-colour",
      "تصویر موقت رنگ یونورسال؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#a89a7d",
    sortOrder: 40,
  },

  /* -------------------------------------------------------------- tools --- */
  {
    id: 5,
    slug: "stainless-trowel",
    name: "ماله‌ی فولادی",
    category: "tools",
    description: "ماله‌ی فولادی برای کشیدن و فشردن لایه‌های میکروسمنت روی سطح.",
    image: placeholderImage(
      "stainless-trowel",
      "تصویر موقت ماله‌ی فولادی؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#8f8d88",
    sortOrder: 10,
  },
  {
    id: 6,
    slug: "finishing-spatula",
    name: "کاردک پرداخت",
    category: "tools",
    description: "کاردک باریک برای پرداخت گوشه‌ها، لبه‌ها و جاهایی که ماله نمی‌رسد.",
    image: placeholderImage(
      "finishing-spatula",
      "تصویر موقت کاردک پرداخت؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#a09d97",
    sortOrder: 20,
  },

  /* ------------------------------------------------------- starter kits --- */
  {
    id: 7,
    slug: "practice-kit",
    name: "پک تمرین",
    category: "starter-kits",
    description:
      "پک تمرین؛ متریال و ابزار آزمودن میکروسمنت روی پنل نمونه، پیش از اجرای واقعی.",
    image: placeholderImage(
      "practice-kit",
      "تصویر موقت پک تمرین؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#c9a978",
    sortOrder: 10,
  },

  /* ------------------------------------------------------------ samples --- */
  {
    id: 8,
    slug: "sample-board-colours",
    name: "پنل نمونه‌ی رنگ",
    category: "samples",
    description: "پنل نمونه برای دیدن رنگ‌ها در نور همان فضایی که قرار است اجرا شود.",
    image: placeholderImage(
      "sample-board-colours",
      "تصویر موقت پنل نمونه‌ی رنگ؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#d8cbb6",
    sortOrder: 10,
  },
  {
    id: 9,
    slug: "sample-board-textures",
    name: "پنل نمونه‌ی بافت",
    category: "samples",
    description: "پنل نمونه برای مقایسه‌ی بافت و پرداخت سطح‌ها در کنار یکدیگر.",
    image: placeholderImage(
      "sample-board-textures",
      "تصویر موقت پنل نمونه‌ی بافت؛ جایگزین عکس واقعی محصول"
    ),
    tintHex: "#b8a68d",
    sortOrder: 20,
  },
];
