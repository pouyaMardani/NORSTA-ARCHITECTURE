/**
 * The projects' public API.
 *
 * Components and routes import from here — never from `records.ts` directly — so
 * the data model stays swappable and no screen has to know how ordering or
 * formatting is implemented.
 */

import { PROJECTS } from "./records";
import type { ProjectDTO } from "./types";

export { PROJECT_CONFIG, PROJECT_IMAGES } from "./config";
export { PROJECTS } from "./records";
export {
  PROJECT_CATEGORIES,
  type ProjectCategory,
  type ProjectDTO,
  type ProjectImage,
} from "./types";

/** Every project, in the curated order of `records.ts`. */
export function getAllProjects(): ProjectDTO[] {
  return [...PROJECTS];
}

/**
 * The home-page gallery.
 *
 * Records marked `featured` are the ones the gallery shows; if none is marked,
 * the whole list is used, so the section can never collapse to an empty row.
 * Every project keeps its own page either way.
 */
export function getFeaturedProjects(): ProjectDTO[] {
  const featured = PROJECTS.filter((project) => project.featured);
  return featured.length ? featured : getAllProjects();
}

export function getProjectBySlug(slug: string): ProjectDTO | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return PROJECTS.map((project) => project.slug);
}

/**
 * A few other projects for the foot of a project page.
 *
 * Same-category neighbours come first (they share the programme), then the rest
 * in curated order. The project itself is never included.
 */
export function getRelatedProjects(project: ProjectDTO, limit = 3): ProjectDTO[] {
  const others = PROJECTS.filter((item) => item.id !== project.id);
  const sameCategory = others.filter((item) => item.category === project.category);
  const rest = others.filter((item) => item.category !== project.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

/**
 * Latin digits → Persian digits.
 *
 * The magazine has the same three-line helper. It is repeated here on purpose:
 * the gallery card is a client component, and importing the magazine's module
 * would pull its twelve articles into the gallery's bundle for the sake of one
 * character map.
 */
const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** The plate number, two-up and in Persian digits: ۰۱, ۰۲, … */
export function formatProjectNumber(index: number): string {
  return toPersianDigits(String(index + 1).padStart(2, "0"));
}

/** Where a shot sits in a page's own gallery, e.g. «۰۲ / ۰۴». */
export function formatProjectCounter(index: number, total: number): string {
  return `${formatProjectNumber(index)} / ${toPersianDigits(String(total).padStart(2, "0"))}`;
}

/**
 * Persian calendar — the same formatter the magazine uses, run on the server so
 * the markup is identical on every request.
 */
const DATE_FORMATTER = new Intl.DateTimeFormat("fa-IR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * A record's `completedAt`, either a bare year (`2023`) or a full ISO date.
 *
 * A year is printed as a year; a full date as «ماه سال» in the Persian
 * calendar. An unparseable value is returned as it was written rather than
 * failing the render.
 */
export function formatProjectDate(value: string): string {
  if (/^\d{4}$/.test(value)) return toPersianDigits(value);

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  try {
    return DATE_FORMATTER.format(date);
  } catch {
    return value;
  }
}
