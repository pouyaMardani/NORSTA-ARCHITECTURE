"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  PROJECT_CATEGORIES,
  formatProjectDate,
  formatProjectNumber,
  getAllProjects,
  toPersianDigits,
  type ProjectCategory,
} from "@/content/projects";

/**
 * The Works gallery — the interactive half of `/microcement/works`.
 *
 * Jetton's `portfolio-grid.html`, rebuilt with Norsta's own ten projects:
 * the same ten items in two arrangements, switched in place. GRID is the
 * staggered checkerboard (two columns, the second dropping down, items
 * alternating in size so no two neighbours align); LIST is a full-width
 * table whose rows invert on hover. The CATEGORIES button slides open a
 * panel of the category names as very large words; picking one filters both
 * views and re-numbers the items.
 *
 * The data never leaves this file: the projects come from the same records
 * the home page and `/projects/<slug>` render, and the filter counts are
 * computed from them, so a new project or category appears here the moment
 * it appears in `content/projects/records.ts`.
 */
type View = "grid" | "list";
type CategoryFilter = "همه" | ProjectCategory;

export default function WorksGallery() {
  const [view, setView] = useState<View>("grid");
  const [category, setCategory] = useState<CategoryFilter>("همه");
  const [panelOpen, setPanelOpen] = useState(false);

  const projects = useMemo(() => getAllProjects(), []);

  const filtered = useMemo(
    () =>
      category === "همه"
        ? projects
        : projects.filter((project) => project.category === category),
    [projects, category],
  );

  const countFor = (filter: CategoryFilter): number =>
    filter === "همه"
      ? projects.length
      : projects.filter((project) => project.category === filter).length;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="mc-works-hero">
        <h1 className="mc-display">
          <span className="mc-line">آثار</span>
          <span className="mc-line">میکروسمنت</span>
        </h1>
        <div className="mc-works-hero-side">
          <p className="mc-mono">پروژه‌ها — نمونه‌کارها</p>
          <p className="mc-mono">
            گزیده‌ی پروژه‌ها — هر پروژه، هر فضا، یک رویکرد: ایده‌ی محکم، اجرای
            صادقانه و سطحی که فریاد نمی‌زند.
          </p>
        </div>
      </header>

      {/* ── Strip: one small labelled thumbnail per project ──────────── */}
      <div className="mc-strip">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/microcement/works/${project.slug}`}
          >
            <Image
              src={project.coverImage.src}
              alt={project.coverImage.alt}
              width={120}
              height={150}
            />
            <span>{project.title}</span>
          </Link>
        ))}
      </div>

      {/* ── Toolbar: scroll hint · categories · grid/list toggle ─────── */}
      <div className="mc-works-toolbar">
        <span className="mc-mono">↓ اسکرول کنید</span>

        <button
          type="button"
          className="mc-cat-btn"
          aria-expanded={panelOpen}
          onClick={() => setPanelOpen((open) => !open)}
        >
          <span className="mc-mono">
            {panelOpen ? "× بستن" : "دسته‌بندی‌ها"}
          </span>
          <span className="mc-caret" aria-hidden="true">
            ⌄
          </span>
        </button>

        <div className="mc-toggle" role="group" aria-label="نمای گالری">
          <button
            type="button"
            aria-label="نمای شبکه"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <rect x="1" y="1" width="8" height="8" fill="currentColor" />
              <rect x="11" y="1" width="8" height="8" fill="currentColor" />
              <rect x="1" y="11" width="8" height="8" fill="currentColor" />
              <rect x="11" y="11" width="8" height="8" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="نمای فهرست"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <rect x="1" y="3" width="18" height="2" fill="currentColor" />
              <rect x="1" y="9" width="18" height="2" fill="currentColor" />
              <rect x="1" y="15" width="18" height="2" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Categories panel: the names as very large words ──────────── */}
      <div
        className="mc-filter-panel"
        data-open={panelOpen ? "true" : "false"}
      >
        <div className="mc-filter-words">
          {(["همه", ...PROJECT_CATEGORIES] as CategoryFilter[]).map(
            (filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={category === filter}
                onClick={() => setCategory(filter)}
              >
                {filter}
                <span className="mc-count">
                  {toPersianDigits(countFor(filter))}
                </span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* ── The ten items, in whichever arrangement is active ─────────── */}
      <div aria-live="polite">
        {filtered.length === 0 ? (
          <p className="mc-works-empty">در این دسته هنوز اثری نیست.</p>
        ) : view === "grid" ? (
          <div className="mc-grid mc-grid-anim" key={`${view}-${category}`}>
            {filtered.map((project) => (
              <article className="mc-card" key={project.slug}>
                <Link href={`/microcement/works/${project.slug}`}>
                  <h2 className="mc-card-title">{project.title}</h2>
                  <div className="mc-card-media">
                    <Image
                      src={project.coverImage.src}
                      alt={project.coverImage.alt}
                      fill
                      sizes="(max-width: 680px) 100vw, 50vw"
                    />
                  </div>
                  <div className="mc-card-cap">
                    <span className="mc-card-cat">{project.category}</span>
                    {project.completedAt ? (
                      <span>{formatProjectDate(project.completedAt)}</span>
                    ) : null}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mc-list" key={`${view}-${category}`}>
            {filtered.map((project, index) => (
              <Link
                key={project.slug}
                href={`/microcement/works/${project.slug}`}
                className="mc-list-row"
              >
                <span className="mc-list-num">
                  {formatProjectNumber(index)}
                </span>
                <span className="mc-list-title">{project.title}</span>
                <span className="mc-list-cat">{project.category}</span>
                {project.completedAt ? (
                  <span className="mc-list-year">
                    {formatProjectDate(project.completedAt)}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
