/**
 * The catalogue's public API.
 *
 * Components and routes import from here — never from `records.ts` directly — so
 * the data model stays swappable and no screen has to know how products are
 * grouped, ordered or counted, or how a category becomes a URL.
 */

/* Only what this module actually calls is imported here; everything else is
   re-exported straight from `./config` below, so nothing unused is bound. */
import {
  INSTAGRAM_URL,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_ORDER,
  PRODUCT_CONFIG,
} from "./config";
import { PRODUCTS } from "./records";
import { PRODUCT_CATEGORY_IDS } from "./types";

import type { ProductCategory, ProductCategoryId, ProductDTO } from "./types";

export {
  INSTAGRAM_URL,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_ORDER,
  PRODUCT_CONFIG,
  PRODUCT_PLACEHOLDER_DIR,
  PRODUCT_PLATE_SIZES,
  SITE_ORIGIN,
  placeholderImage,
} from "./config";
export { PRODUCTS } from "./records";
export { PRODUCT_CATEGORY_IDS } from "./types";
export type { ProductCategory, ProductCategoryId, ProductDTO, ProductImage } from "./types";
export type { ProductLabels, ProductPageCopy, ProductSectionCopy } from "./config";

/**
 * Where each shelf sits in the canonical order, derived from the id tuple rather
 * than written out again — so the order is declared exactly once.
 */
const CATEGORY_RANK: Record<ProductCategoryId, number> = Object.fromEntries(
  PRODUCT_CATEGORY_IDS.map((id, index) => [id, index])
) as Record<ProductCategoryId, number>;

/**
 * Every product, grouped by shelf in the canonical category order and, inside a
 * shelf, by `sortOrder`.
 *
 * The grouping is the page's arrangement, not the records file's: a record moved
 * across shelves re-files itself, and `id` only breaks ties so the order is
 * stable for two products that share a `sortOrder`.
 */
export function getAllProducts(): ProductDTO[] {
  return [...PRODUCTS].sort(
    (a, b) => CATEGORY_RANK[a.category] - CATEGORY_RANK[b.category] || a.sortOrder - b.sortOrder || a.id - b.id
  );
}

/** One shelf, by id. Every declared id has an entry, so this always answers. */
export function getCategory(id: ProductCategoryId): ProductCategory {
  const category = PRODUCT_CATEGORIES.find((item) => item.id === id);
  if (!category) throw new Error(`unknown product category "${id}"`);
  return category;
}

/** That shelf's name as a filter chip and a card tag print it. */
export function getCategoryLabel(id: ProductCategoryId): string {
  return getCategory(id).label;
}

/**
 * The shelves the filter row offers: the declared order, minus any shelf that
 * holds nothing.
 *
 * Derived, never hardcoded — a category with no products would otherwise be a
 * chip that leads to an empty grid. The home page's showcase is not built from
 * this: it presents all four shelves, because there it is a composition rather
 * than a filter.
 */
export function getProductCategories(products: ProductDTO[] = PRODUCTS): ProductCategory[] {
  const used = new Set(products.map((product) => product.category));
  return PRODUCT_CATEGORY_ORDER.filter((id) => used.has(id)).map(getCategory);
}

/** How many products each shelf holds — the number printed on a filter chip. */
export function getCategoryCounts(): Array<{ category: ProductCategory; count: number }> {
  return getProductCategories().map((category) => ({
    category,
    count: PRODUCTS.filter((product) => product.category === category.id).length,
  }));
}

/** One shelf's products, in catalogue order. */
export function getProductsByCategory(id: ProductCategoryId): ProductDTO[] {
  return getAllProducts().filter((product) => product.category === id);
}

/**
 * Narrows an unknown URL parameter to a real, non-empty category.
 *
 * An empty shelf is not a category a visitor can reach, so a link to one is
 * treated as unknown — which is what lets the page say so rather than render an
 * empty grid.
 */
export function parseProductCategory(value: string | undefined): ProductCategoryId | undefined {
  if (!value) return undefined;
  return getProductCategories().find((category) => category.id === value)?.id;
}

/** The address of a filtered view, or of the whole catalogue for `null`. */
export function getCatalogHref(category: ProductCategoryId | null): string {
  return category ? `/products?category=${category}` : "/products";
}

/**
 * Where an enquiry about a product goes.
 *
 * The record may name its own destination; otherwise it is the studio's
 * Instagram profile, which is where every enquiry is handled today. The customer
 * names the item in the message, which is why the cards print the label they do.
 */
export function getProductInquiryUrl(product: ProductDTO): string {
  return product.inquiryUrl ?? INSTAGRAM_URL;
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/**
 * Latin digits → Persian digits.
 *
 * Repeated from the library's module on purpose, exactly as that module repeats
 * it from the projects': this one is imported by a page that needs nothing else
 * from the samples' data.
 */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** The card's plate number, two-up and in Persian digits: ۰۱, ۰۲, ... */
export function formatProductNumber(index: number): string {
  return toPersianDigits(String(index + 1).padStart(2, "0"));
}

/** A count with its noun: «۸ محصول». */
export function formatProductCount(count: number): string {
  return `${toPersianDigits(count)} ${PRODUCT_CONFIG.labels.countUnit}`;
}
