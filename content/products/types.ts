/**
 * The product catalogue's data model.
 *
 * One `ProductDTO` describes one item the studio offers — a bag of powder, a
 * trowel, a practice kit, a sample panel — and the category it belongs to. The
 * home page's showcase, the catalogue at `/products`, its filter row and every
 * card read this one shape, so a product is never described twice and no
 * component declares a product of its own.
 *
 * Copy stays data: `description` is plain Persian prose and the components lay
 * it out — no typography, spacing or colour decision lives in a record.
 *
 * ── WHAT A RECORD DELIBERATELY DOES NOT CARRY ──────────────────────────────
 * There is no price, no pack size, no stock level, no delivery term and no
 * discount. None of them has been supplied, and the catalogue's whole ordering
 * route is a direct message — so a record must not invent a number a visitor
 * could hold the studio to. Add the fields here *and* in the card when real
 * commercial data exists; until then the absence is the accurate statement.
 *
 * ── PLACEHOLDERS ───────────────────────────────────────────────────────────
 * The studio has not photographed its stock yet, so the starter records point at
 * plates marked `placeholder: true` (see `config.ts`). The flag travels with the
 * image, so a card can label a temporary plate as such — and stops labelling it
 * the moment a real photograph is dropped in.
 */

/** A photograph plus the alt text that describes what it actually shows. */
export type ProductImage = {
  /** Path under `public/` (or a remote URL). One edit here re-points one card. */
  src: string;
  /** Intrinsic pixel size, so every card reserves its box before the image lands. */
  width: number;
  height: number;
  alt: string;
  /**
   * True while this plate is a stand-in for a photograph that does not exist yet.
   * The card prints «تصویر موقت» for it. Set it to `false` (or drop the field) as
   * soon as the real photograph replaces the placeholder.
   */
  placeholder?: boolean;
};

/**
 * The catalogue's category ids — also the type of every record's `category`, and
 * the value that travels in the URL (`/products?category=<id>`).
 *
 * The tuple is the single source of truth: `ProductCategoryId` is derived from
 * it, so a typo in a record or in a link fails the type-check instead of quietly
 * creating a category nobody claims. Order is the canonical order of the filter
 * row.
 *
 * IDs are English and kebab-case on purpose: a query parameter is an opaque
 * identifier, and a Persian value would arrive percent-encoded in every address
 * bar and every share. The human-facing name lives in `label` / `title`.
 */
export const PRODUCT_CATEGORY_IDS = [
  "materials",
  "tools",
  "starter-kits",
  "samples",
] as const;

export type ProductCategoryId = (typeof PRODUCT_CATEGORY_IDS)[number];

/**
 * One category, as the catalogue presents it.
 *
 * `label` is the short form — it has to fit inside a filter chip and under a
 * card's title — while `title` is the full name the section and the hero print.
 * Both are the studio's own words for the same shelf, never two different ones.
 */
export type ProductCategory = {
  /** Stable URL value. Must be one of `PRODUCT_CATEGORY_IDS`. */
  id: ProductCategoryId;
  /** Short Persian name: filter chip, card tag. */
  label: string;
  /** Full Persian name: the showcase card's heading, printed in a heading. */
  title: string;
  /** One sentence: what belongs on this shelf. */
  description: string;
  /** The composition the showcase card and the hero plate show. */
  image: ProductImage;
  /** The category's own surface tone (`#rrggbb`), used for the plate and the swatch. */
  tintHex: string;
};

/**
 * A complete product.
 *
 * `id` and `slug` are the two identities: `id` is the stable React key, `slug` is
 * the English keyword used in the placeholder's filename. `sortOrder` is what
 * puts a category's shelf in order — one product is moved by changing its number,
 * and the grid re-flows on its own.
 */
export type ProductDTO = {
  /** Stable numeric key — free to change order without touching anything else. */
  id: number;
  /** English, kebab-case, never re-used. Also the placeholder's filename. */
  slug: string;
  /** Display name (Persian). */
  name: string;
  /** Must be one of `PRODUCT_CATEGORY_IDS` in this file. */
  category: ProductCategoryId;
  /** One or two sentences about what the item *is*. No technical claims. */
  description: string;
  /** The photograph on the card. */
  image: ProductImage;
  /** The item's own surface tone (`#rrggbb`), used for the plate and the swatch. */
  tintHex: string;
  /** Catalogue order within its category, ascending. Spaced by tens. */
  sortOrder: number;
  /**
   * Where an enquiry about *this* item goes. Omitted means the studio's Instagram
   * profile (see `PRODUCT_CONFIG.instagramUrl`), which is where every enquiry is
   * handled today — until a per-item link exists, the profile is the honest
   * destination and the customer names the item in the message.
   */
  inquiryUrl?: string;
};
