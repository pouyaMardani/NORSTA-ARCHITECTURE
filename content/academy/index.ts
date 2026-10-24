/**
 * The academy's public API.
 *
 * Components and routes import from here — never from `records.ts` directly — so
 * the data model stays swappable and no screen has to know how ordering,
 * filtering or number formatting is implemented.
 */

import { ACADEMY_CONFIG } from "./config";
import { LESSONS } from "./records";
import type { LessonAccess, LessonDTO, LessonVideoDTO } from "./types";

export {
  ACADEMY_CONFIG,
  ACADEMY_COPY,
  ACADEMY_IMAGES,
  ACADEMY_INSTRUCTOR,
  ACADEMY_LABELS,
  TRAINING_COLLECTION,
} from "./config";
export { LESSONS } from "./records";
export type {
  AcademyCopy,
  AcademyImage,
  AcademyInstructorDTO,
  AcademyLabels,
  LessonAccess,
  LessonDTO,
  LessonVideoDTO,
  TrainingCollectionDTO,
} from "./types";

/**
 * Every lesson, in the learning sequence.
 *
 * `order` is the sorting authority, and `id` only breaks ties, so two lessons
 * that were given the same position can never re-order themselves between
 * renders. `records.ts` is the single source this list is built from.
 */
export function getAllLessons(): LessonDTO[] {
  return [...LESSONS].sort((a, b) => a.order - b.order || a.id - b.id);
}

/** The introductory lessons — the ones the landing page leads with. */
export function getFreeLessons(): LessonDTO[] {
  return getAllLessons().filter((lesson) => lesson.access === "free");
}

/** Everything behind a future licensed workflow. Empty in this version. */
export function getLessonsByAccess(access: LessonAccess): LessonDTO[] {
  return getAllLessons().filter((lesson) => lesson.access === access);
}

export function getLessonBySlug(slug: string): LessonDTO | undefined {
  return LESSONS.find((lesson) => lesson.slug === slug);
}

export function getAllLessonSlugs(): string[] {
  return LESSONS.map((lesson) => lesson.slug);
}

/**
 * A few other lessons for the foot of a lesson page.
 *
 * Same access level first (a free lesson sends the reader to the rest of the
 * free set), then the remainder in sequence order. The lesson itself is never
 * included.
 */
export function getRelatedLessons(lesson: LessonDTO, limit = 3): LessonDTO[] {
  const others = getAllLessons().filter((item) => item.id !== lesson.id);
  const sameAccess = others.filter((item) => item.access === lesson.access);
  const rest = others.filter((item) => item.access !== lesson.access);
  return [...sameAccess, ...rest].slice(0, limit);
}

/**
 * Where a lesson sits in the sequence, and what its neighbours are.
 *
 * Both ends are nullable rather than wrapped around: the first lesson has no
 * "previous" and the last has no "next", so the page prints one control instead
 * of a link that loops back on itself.
 */
export function getLessonSequence(lesson: LessonDTO): {
  index: number;
  total: number;
  previous: LessonDTO | null;
  next: LessonDTO | null;
} {
  const all = getAllLessons();
  const index = all.findIndex((item) => item.id === lesson.id);
  return {
    index,
    total: all.length,
    previous: index > 0 ? all[index - 1] : null,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : null,
  };
}

/**
 * The video a lesson should actually play, or `undefined`.
 *
 * A record's `video` is checked rather than trusted: an entry that was left
 * half-filled (an empty string, a relative embed address, a non-https URL) is
 * reported as *absent* instead of being handed to the markup. That keeps the
 * contract the pages rely on honest — `undefined` always means "show the
 * placeholder", never "render a player that cannot play".
 */
export function resolveLessonVideo(lesson: LessonDTO): LessonVideoDTO | undefined {
  const video = lesson.video;
  if (!video) return undefined;

  if (video.kind === "file") {
    const src = video.src?.trim();
    // Either a local path this site serves or an absolute URL.
    if (!src || !(src.startsWith("/") || /^https?:\/\//i.test(src))) return undefined;
    return { ...video, src };
  }

  const src = video.src?.trim();
  if (!src || !/^https:\/\//i.test(src)) return undefined;
  return { ...video, src };
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/**
 * Latin digits → Persian digits.
 *
 * The magazine and the project gallery each carry their own copy of these three
 * lines. It is repeated here for the same reason it is repeated there: the
 * lesson card is imported by pages that must not pull another content module
 * into their bundle for the sake of one character map.
 */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** The lesson number, two-up and in Persian digits: ۰۱, ۰۲, ۰۳. */
export function formatLessonNumber(order: number): string {
  return toPersianDigits(String(order).padStart(2, "0"));
}

/** The mounted label on a card, e.g. «درس ۰۱». */
export function lessonNumberLabel(lesson: LessonDTO): string {
  return `${ACADEMY_CONFIG.labels.lesson} ${formatLessonNumber(lesson.order)}`;
}

/**
 * A lesson's runtime, e.g. «۱۲ دقیقه» — or `undefined` when the record carries
 * no duration, so no card invents one.
 */
export function formatLessonDuration(minutes: number | undefined): string | undefined {
  if (typeof minutes !== "number" || !Number.isFinite(minutes) || minutes <= 0) {
    return undefined;
  }
  return `${toPersianDigits(Math.round(minutes))} ${ACADEMY_CONFIG.labels.minutes}`;
}
