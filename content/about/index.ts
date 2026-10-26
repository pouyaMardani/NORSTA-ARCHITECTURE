/**
 * The About section's second mode: the before/after showcase.
 *
 * ── WHAT LIVES HERE, AND WHY IT IS ONE FILE ────────────────────────────────
 * The About block is a single, small presentation: two or three comparisons and
 * the handful of micro-labels they print. So it is one module rather than the
 * four-file shape a full domain (`content/projects`, `content/samples`) takes —
 * `config`, `records`, `index` and `types` exist there because those libraries
 * have public APIs, filters and detail routes. Here there is one consumer
 * (`components/About.tsx`) and one list, so splitting it would only add files
 * to walk through. If this ever grows a route of its own, it adopts that shape.
 *
 * ── HONESTY ABOUT THE PAIRS ────────────────────────────────────────────────
 * The repository ships no verified before/after photography: every still in
 * `public/images` is finished work, and pairing two of them into a "before" and
 * an "after" would be a claim about a transformation nobody photographed. So
 * each sample carries `placeholder: true` and the frame prints «تصویر موقت»
 * beside it — the badge `content/products` and `content/samples` already use for
 * their own stand-ins — and the section closes with a note that says so in full.
 *
 * Replacing a pair is then one edit per side: point `src` at the real original
 * and the real finished shot, write their `alt` texts, and drop
 * `placeholder: true`. Nothing else changes — the frame, the slider, the labels
 * and the note all follow the flag. The `alt` texts below are the ones this
 * project already publishes for these photographs and describe what each still
 * shows; they deliberately do not assert that a still is somebody's "before".
 *
 * ── WHY THE PHOTOGRAPHS COME FROM `projects/config` AND NOT `projects` ─────
 * The pool is named once in `content/projects/config.ts`, so no path is spelled
 * twice and swapping a photograph stays a one-line edit. It is imported from
 * that leaf file rather than from the domain's own index on purpose: `About` is
 * a client component, and the index re-exports every project record — twelve
 * projects and their three-paragraph descriptions — which would ride into the
 * browser bundle for the sake of eight image paths. This is the same reasoning
 * that repeats `toPersianDigits` in each domain instead of sharing one helper.
 */

import { PROJECT_IMAGES } from "@/content/projects/config";

/** One side of a comparison. */
export type AboutComparisonSide = {
  /** Path under `public/`, as published. */
  src: string;
  /** What the photograph shows — never a claim about when it was taken. */
  alt: string;
};

/** One selectable sample: a space, photographed twice. */
export type AboutShowcaseSample = {
  /** Stable key for the selector. Never printed. */
  id: string;
  /** The name its button prints. */
  name: string;
  /** The original space, on the inline-start side of the frame. */
  before: AboutComparisonSide;
  /** The same space after the work, on the inline-end side of the frame. */
  after: AboutComparisonSide;
  /**
   * `true` while either side is a stand-in for photography the studio has not
   * published. The frame prints its badge and the section prints its note from
   * this flag, so the caveat can never be forgotten by hand.
   */
  placeholder: boolean;
};

/** Every micro-label the two modes print. */
export type AboutShowcaseCopy = {
  /** Eyebrow above the showcase's heading. */
  eyebrow: string;
  /** The showcase's heading. */
  title: string;
  /** One paragraph under the heading. */
  lede: string;
  /** Accessible name of the group of sample buttons. */
  samplesLabel: string;
  /** Label of the original side of the frame. */
  before: string;
  /** Label of the finished side of the frame. */
  after: string;
  /** Accessible name of the divider control. */
  sliderLabel: string;
  /** Printed after the percentage the divider reads, e.g. «۵۰٪ پیش از اجرا». */
  valueSuffix: string;
  /** How the divider is moved, printed under the frame. */
  hint: string;
  /** Badge printed on a comparison whose photography is a stand-in. */
  placeholder: string;
  /** The full disclosure under the frame while a stand-in is shown. */
  placeholderNote: string;
  /** Accessible name of the two mode arrows, by direction. */
  nav: { next: string; prev: string };
  /** The name of each mode, used to say where an arrow leads. */
  modes: { studio: string; compare: string };
};

export type AboutShowcase = {
  copy: AboutShowcaseCopy;
  /**
   * Two or three comparisons. Authored, and never empty: the selector has no
   * sensible state without one, so an empty list is a build-time mistake rather
   * than something the interface should paper over with an invented sample.
   */
  samples: AboutShowcaseSample[];
};

export const ABOUT_SHOWCASE: AboutShowcase = {
  copy: {
    eyebrow: "گزیدهی اجرا",
    title: "قبل و بعد",
    lede:
      "هر نمونه دو تصویر از یک فضاست: حالت اولیهی آن و همان نما پس از اجرا. خط جداکننده را بکشید تا تفاوت سطحها را ببینید.",
    samplesLabel: "نمونههای اجرا",
    before: "قبل اجرا",
    after: "بعد اجرا",
    sliderLabel: "جابهجایی خط مقایسهی قبل و بعد",
    valueSuffix: "پیش از اجرا",
    hint: "خط جداکننده را بکشید یا با کلیدهای جهتدار جابهجا کنید.",
    placeholder: "تصویر موقت",
    placeholderNote:
      "عکسهای این بخش جانشین نمایشیاند: آرشیو استودیو تصویری از «قبل» ثبت نکرده بود، پس هیچیک از این جفتها پیش و پسِ یک اجرای واقعی نیستند. این نمونهها تنها کارکرد مقایسه را نشان میدهند و با عکسهای واقعی جایگزین میشوند.",
    nav: { next: "نمای بعدی", prev: "نمای قبلی" },
    modes: { studio: "نمای استودیو", compare: "مقایسهی قبل و بعد" },
  },

  samples: [
    {
      id: "stone-stair",
      name: "پلکان سنگی",
      before: PROJECT_IMAGES.archDetail,
      after: PROJECT_IMAGES.stairs,
      placeholder: true,
    },
    {
      id: "stone-interior",
      name: "فضای داخلی سنگی",
      before: PROJECT_IMAGES.teaPavilionDetail,
      after: PROJECT_IMAGES.courtyard,
      placeholder: true,
    },
    {
      id: "outer-volume",
      name: "حجم بیرونی",
      before: PROJECT_IMAGES.teaPavilion,
      after: PROJECT_IMAGES.culturalCenter,
      placeholder: true,
    },
  ],
};

/** Latin digits → Persian digits. Repeated per domain, as the other domains do. */
const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** The sample's number on its button, two-up and in Persian digits: ۰۱, ۰۲, ... */
export function formatSampleNumber(index: number): string {
  return toPersianDigits(String(index + 1).padStart(2, "0"));
}

/**
 * What the divider reads at `value` percent, e.g. «۵۰٪ پیش از اجرا».
 *
 * The number is the share of the frame the *original* side occupies, measured
 * from the inline-start edge — the side whose label stands first in the RTL
 * reading order of this block.
 */
export function formatCompareValue(
  value: number,
  suffix: string = ABOUT_SHOWCASE.copy.valueSuffix,
): string {
  return `${toPersianDigits(Math.round(value))}٪ ${suffix}`;
}
