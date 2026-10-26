/**
 * Shared sample configuration.
 *
 * Everything that is not specific to one sample lives here: where the temporary
 * plates live, how a sample image is built, the section's own Persian copy and
 * the micro-labels the frames and the zoom viewer print. Edit this file to
 * re-brand the section; edit `records.ts` to change what hangs on the wall.
 */

import type { SampleImage } from "./types";

/** Directory of the temporary plates, relative to `public/`. */
export const SAMPLE_PLACEHOLDER_DIR = "/images/samples";

/**
 * The temporary plates.
 *
 * Every record in `records.ts` starts out pointing at one of these: a tinted
 * plate that carries the sample's name and the words «تصویر موقت» (temporary
 * image), so a stand-in can never be mistaken for a photograph of the real
 * material. They are ordinary PNG files in `public/images/samples/`, 1600×2000
 * (the 4/5 the frames are cut for) and large enough to be worth zooming into.
 *
 * Replacing one is a single edit in `records.ts` — point `image.src` at the real
 * photograph, correct `width`/`height` and `alt`, and drop `placeholder: true`.
 * Nothing else has to change: the frame, the label and the viewer all follow.
 */
export const SAMPLE_PLACEHOLDER = {
  width: 1600,
  height: 2000,
} as const;

/**
 * Builds the image entry for a temporary plate.
 *
 * `slug` matches the record it belongs to, so the plate's file name and the
 * sample's identity stay in step, and `alt` describes what the plate shows —
 * a temporary surface, never a claim about the material.
 */
export function placeholderImage(slug: string, alt: string): SampleImage {
  return {
    src: `${SAMPLE_PLACEHOLDER_DIR}/placeholder-${slug}.png`,
    width: SAMPLE_PLACEHOLDER.width,
    height: SAMPLE_PLACEHOLDER.height,
    alt,
    placeholder: true,
  };
}

/**
 * The section's own copy.
 *
 * `intro` is one entry per line: the line breaks are part of the design, so they
 * travel with the copy instead of living in a component.
 */
export type SampleSectionCopy = {
  /** Used as the section's accessible name and as a `<title>` segment. */
  name: string;
  /** Eyebrow before the title; the sample count is printed in front of it. */
  eyebrow: string;
  /** The heading itself. */
  title: string;
  /** Editorial introduction, one entry per line. */
  intro: string[];
  /** Accessible name of the filter row. */
  legendLabel: string;
  /** The filter that shows everything. */
  allLabel: string;
  /** One line telling the visitor the frames can be opened. */
  hint: string;
  /** Caption of the wall, printed over the first row. Purely decorative. */
  wallNote: string;
  /** Label of the Latin material word printed beside the heading. */
  latinNote: string;
};

/** Micro-labels used by the frames, the filter row and the zoom viewer. */
export type SampleLabels = {
  /** Appended to a frame's accessible name: «… — نمایش نزدیک». */
  open: string;
  close: string;
  prev: string;
  next: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  /** Accessible name of the zoom viewer dialog. */
  viewerLabel: string;
  /** Row labels inside the viewer. */
  category: string;
  finish: string;
  color: string;
  /** Printed while a plate is still a stand-in. */
  placeholder: string;
  /** The two halves of the viewer's interaction hint. */
  hintZoom: string;
  hintPan: string;
};

export const SAMPLE_CONFIG: {
  section: SampleSectionCopy;
  labels: SampleLabels;
} = {
  section: {
    name: "گالری متریال نورستا",
    eyebrow: "نمونه",
    title: "گالری متریال نورستا",
    intro: [
      "نمونه‌های میکروسمنت استودیو، قاب‌به‌قاب روی دیوار",
      "گالری؛ پرداخت‌هایی که پیش از هر پروژه، زیر نور",
      "آزموده و برای رنگ، بافت و سایه انتخاب می‌شوند.",
    ],
    legendLabel: "پالایش نمونه‌ها بر پایه‌ی خانواده‌ی پرداخت",
    allLabel: "همه",
    hint: "برای دیدن نزدیک بافت، هر قاب را باز کنید.",
    wallNote: "دیوار متریال",
    latinNote: "MICROCEMENT LIBRARY",
  },

  labels: {
    open: "نمایش نزدیک",
    close: "بستن نمایشگر",
    prev: "قبلی",
    next: "بعدی",
    zoomIn: "بزرگ‌تر",
    zoomOut: "کوچک‌تر",
    reset: "بازگشت به اندازه‌ی اولیه",
    viewerLabel: "نمایشگر نمونه‌ی متریال",
    category: "خانواده",
    finish: "پرداخت",
    color: "رنگ",
    placeholder: "تصویر موقت",
    hintZoom: "بزرگ‌نمایی با اسکرول یا دو انگشت",
    hintPan: "جابه‌جایی با کشیدن",
  },
};
