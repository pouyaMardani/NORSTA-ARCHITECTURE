/**
 * The material library's public API.
 *
 * Components import from here — never from `records.ts` directly — so the data
 * model stays swappable and no screen has to know how the wall is ordered or how
 * a counter is formatted.
 */

import { SAMPLES } from "./records";

import { SAMPLE_CATEGORIES } from "./types";

import type { SampleCategory, SampleDTO } from "./types";

export { SAMPLE_CONFIG, SAMPLE_PLACEHOLDER, placeholderImage } from "./config";
export { SAMPLES } from "./records";
export {
  SAMPLE_CATEGORIES,
  SAMPLE_MOUNTS,
  SAMPLE_WOODS,
  type SampleCategory,
  type SampleDTO,
  type SampleImage,
  type SampleMount,
  type SampleWood,
} from "./types";
export type { SampleLabels, SampleSectionCopy } from "./config";

/** Ascending `sortOrder`, without touching the array the records file exports. */
function byOrder(a: SampleDTO, b: SampleDTO): number {
  return a.sortOrder - b.sortOrder;
}

/** The whole library, in the curated order of `records.ts`. */
export function getSamples(): SampleDTO[] {
  return [...SAMPLES].sort(byOrder);
}

/**
 * The samples the wall opens with.
 *
 * Records marked `featured` come first — they are the ones the wall leads with —
 * followed by the rest in their curated order. Every sample is shown either way,
 * so the gallery can never collapse to an empty wall: `featured` only decides
 * what the eye meets first.
 */
export function getWallSamples(): SampleDTO[] {
  const featured = SAMPLES.filter((sample) => sample.featured).sort(byOrder);
  const rest = SAMPLES.filter((sample) => !sample.featured).sort(byOrder);
  return [...featured, ...rest];
}

/**
 * The finish families that are actually on the wall, in the order declared by
 * `SAMPLE_CATEGORIES`.
 *
 * Derived, never hardcoded: a family with no samples never gets a filter, and a
 * new family appears the moment a record uses it.
 */
export function getSampleCategories(samples: SampleDTO[] = SAMPLES): SampleCategory[] {
  const used = new Set(samples.map((sample) => sample.category));
  return SAMPLE_CATEGORIES.filter((category) => used.has(category));
}

/** How many samples are in each family — the number printed on a filter. */
export function countByCategory(samples: SampleDTO[]): Partial<Record<SampleCategory, number>> {
  return samples.reduce<Partial<Record<SampleCategory, number>>>((counts, sample) => {
    counts[sample.category] = (counts[sample.category] ?? 0) + 1;
    return counts;
  }, {});
}

/** The subset of samples belonging to one family, or the whole list for `null`. */
export function filterByCategory(
  samples: SampleDTO[],
  category: SampleCategory | null
): SampleDTO[] {
  return category ? samples.filter((sample) => sample.category === category) : samples;
}

/**
 * Latin digits → Persian digits.
 *
 * Repeated from the projects' module on purpose: the gallery is a client
 * component, and importing that module would pull the project pages' data into
 * the gallery's bundle for the sake of one character map.
 */
const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** The plate number, two-up and in Persian digits: ۰۱, ۰۲, … */
export function formatSampleNumber(index: number): string {
  return toPersianDigits(String(index + 1).padStart(2, "0"));
}

/** Where a sample sits in the wall, e.g. «۰۲ / ۰۸». */
export function formatSampleCounter(index: number, total: number): string {
  return `${formatSampleNumber(index)} / ${toPersianDigits(String(total).padStart(2, "0"))}`;
}

/** The zoom level as a percentage, e.g. «۱۴۰٪». */
export function formatZoomPercent(scale: number): string {
  return `${toPersianDigits(Math.round(scale * 100))}٪`;
}
