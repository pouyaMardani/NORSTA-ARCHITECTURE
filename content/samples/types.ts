/**
 * The microcement samples' data model.
 *
 * One `SampleDTO` describes one framed sample of the material gallery: what it is
 * called, which finish family it belongs to, which photograph shows it and how
 * its frame is built. The wall, the label under each frame and the zoom viewer
 * all read this one shape, so a sample is never described twice and the gallery
 * never declares a sample of its own.
 *
 * Copy stays data: `description` is plain Persian prose and the components lay
 * it out — no typography, spacing or colour decision lives in a record.
 *
 * ── HONESTY ────────────────────────────────────────────────────────────────
 * A record names a *look*, never a specification. `finish` and `color` are
 * descriptive labels for the studio's own library; nothing here claims
 * durability, thickness, coverage, water resistance or any other technical
 * property, because the studio has not supplied any. Replace the labels with the
 * real product names whenever they exist.
 *
 * ── PLACEHOLDERS ───────────────────────────────────────────────────────────
 * The studio has not published close-ups of its samples yet, so the starter
 * records point at plates marked `placeholder: true` (see `config.ts`). The flag
 * travels with the image, so the gallery can label a temporary plate as such and
 * stop labelling it the moment a real photograph is dropped in.
 */

/** A photograph plus the alt text that describes what it actually shows. */
export type SampleImage = {
  /** Path under `public/` (or a remote URL). One edit here re-points one frame. */
  src: string;
  /** Intrinsic pixel size, so every frame reserves its box before the image lands. */
  width: number;
  height: number;
  alt: string;
  /**
   * True while this plate is a stand-in for a photograph that does not exist yet.
   * The gallery prints «تصویر موقت» for it in the viewer. Set it to `false` (or
   * drop the field) as soon as the real photograph replaces the placeholder.
   */
  placeholder?: boolean;
};

/**
 * The finish families — also the type of every record's `category`.
 *
 * The tuple is the single source of truth: `SampleCategory` is derived from it,
 * so a typo in a record fails the type-check instead of quietly inventing a
 * family nobody claims. The gallery's filter row is built from the categories
 * records actually use, so this list may safely be longer than what is on show.
 */
export const SAMPLE_CATEGORIES = ["مات", "نیمه‌صیقلی", "صیقلی", "پتینه"] as const;

export type SampleCategory = (typeof SAMPLE_CATEGORIES)[number];

/** The wood the frame is made of. Three natural tones, nothing exotic. */
export const SAMPLE_WOODS = ["oak", "walnut", "smoked"] as const;

export type SampleWood = (typeof SAMPLE_WOODS)[number];

/**
 * How deeply the frame is built. The mount is the inner lip between the wood and
 * the photograph: `slim` is the library's default, `wide` reads as a larger
 * picture, and `double` adds a second, narrower step for the quietest samples.
 */
export const SAMPLE_MOUNTS = ["slim", "wide", "double"] as const;

export type SampleMount = (typeof SAMPLE_MOUNTS)[number];

/**
 * A complete sample.
 *
 * `id` and `slug` are the two identities: `id` is the stable React key, `slug` is
 * the English keyword used in filenames and labels. `sortOrder` is what puts the
 * wall in order — one sample is re-ordered by changing its number, and the grid
 * re-flows on its own.
 */
export type SampleDTO = {
  /** Stable numeric key — free to change order without touching anything else. */
  id: number;
  /** English, kebab-case, never re-used. Also the placeholder's filename. */
  slug: string;
  /** Display name (Persian). */
  name: string;
  /** Must be one of `SAMPLE_CATEGORIES` in this file. */
  category: SampleCategory;
  /** The specific finish, e.g. «مات مخملی». Omitted rather than invented. */
  finish?: string;
  /** The colour's name, e.g. «بادامی گرم». */
  color?: string;
  /** The same colour as a swatch chip in the label (`#rrggbb`). */
  colorHex?: string;
  /** One or two sentences about how the surface reads. No technical claims. */
  description?: string;
  /** The photograph inside the frame. */
  image: SampleImage;
  /** Highlight this sample in the gallery's opening row. */
  featured?: boolean;
  /** Gallery order, ascending. Spaced by tens so a sample can be slotted in. */
  sortOrder: number;
  /** Frame wood. Defaults to oak when omitted. */
  wood?: SampleWood;
  /** Frame depth. Defaults to slim when omitted. */
  mount?: SampleMount;
};
