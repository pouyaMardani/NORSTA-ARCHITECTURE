"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import ProjectCard from "./ProjectCard";
import type { ProjectDTO } from "@/content/projects";
import { toPersianDigits } from "@/content/projects";

/**
 * The home-page project gallery.
 *
 * Two modes, chosen by width — never by pointer type:
 *
 * ── Wide screens: one horizontal track that drifts from right to left,
 *    continuously and without a seam. The project list is rendered `copies`
 *    times inside a single flex track, and the track is animated by exactly
 *    *one* copy's width, so copy n+1 sits where copy n started and the
 *    restart is invisible. `--mrq-copies` and `--mrq-duration` are the only
 *    knobs the stylesheet needs. Motion pauses while the pointer is over the
 *    gallery, while anything inside it has focus, while it is being pressed,
 *    and while it is off screen. `prefers-reduced-motion` gets the static
 *    variant — one copy, no animation, a scrollable row (see `globals.css`).
 *
 * ── Narrow screens (≤860px, every pointer): a native horizontal scroller
 *    with scroll-snap. This is the fix for the mobile bug the old code had:
 *    on a touchscreen the viewport was `overflow:hidden` and the only way to
 *    move the row was a hand-rolled PointerEvent drag — but `touch-action:
 *    pan-y` lets the browser reclaim any gesture with a vertical component
 *    (`pointercancel`), so an ordinary diagonal swipe ended the drag at once
 *    and the row snapped back, feeling dead. The ≤860px native-scroller CSS
 *    also only applied to `pointer:fine`, so a touch phone never got it at
 *    all. A native scroller is handled by the browser itself: touch, trackpad
 *    and keyboard all work, there is no drag state to go stale, and there is
 *    no second coordinate for the drift to fight with. Only one copy is
 *    rendered in this mode, so there is no seam to hide.
 *
 * The bright ivory edge fades (`.mrq-edge`) are gone: they painted a light
 * halo over the left and right plates. The row now ends cleanly at the
 * section gutter, and the previous / next controls below it say the row
 * continues.
 *
 * The observer is disconnected on unmount. The pause timeout is cleared on
 * unmount too.
 */

/** Track width travelled per second. Deliberately slow: this is a drift. */
const PX_PER_SECOND = 16;
/** Clamps, so an unusually wide or narrow track still reads as a calm drift. */
const MIN_SECONDS = 80;
const MAX_SECONDS = 480;
/** Copies rendered before measurement — enough for a seamless loop on its own. */
const FALLBACK_COPIES = 2;
/** Upper bound, so a very wide viewport can never flood the DOM. */
const MAX_COPIES = 6;
/** How long the drift stays paused after a previous / next tap on desktop. */
const PAUSE_AFTER_STEP_MS = 2500;

type ProjectMarqueeProps = {
  /** The projects to show, in the order they should travel. */
  projects: ProjectDTO[];
  /** Accessible name of the gallery. */
  label: string;
  /** Short hint shown under the gallery, telling visitors how to browse it. */
  hint: string;
  /** Labels of the previous / next controls. */
  previousLabel: string;
  nextLabel: string;
};

export default function ProjectMarquee({
  projects,
  label,
  hint,
  previousLabel,
  nextLabel,
}: ProjectMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [copies, setCopies] = useState(FALLBACK_COPIES);
  const [seconds, setSeconds] = useState(MIN_SECONDS);
  const [pressed, setPressed] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [phase, setPhase] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  /** One copy's width in pixels — the only distance a loop may ever travel. */
  const stepRef = useRef(0);
  const pauseTimeoutRef = useRef<number | null>(null);

  /** Narrow mode follows the same 860px step as the stylesheet. */
  useEffect(() => {
    const query = window.matchMedia("(max-width: 860px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Measure one copy and derive the two knobs from it. The step (the distance
   * between the first card of two neighbouring copies) is read straight off the
   * layout, so gaps, margins and card widths are all accounted for without the
   * script knowing any of them. Narrow mode renders one copy and never drifts,
   * so there is nothing to measure there.
   */
  useEffect(() => {
    if (narrow) {
      setCopies(1);
      return;
    }
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const measure = () => {
      const items = track.children;
      if (items.length <= projects.length) return;

      const first = items[0] as HTMLElement;
      const nextCopy = items[projects.length] as HTMLElement;
      const step = nextCopy.offsetLeft - first.offsetLeft;
      if (step <= 0) return;

      const needed = Math.ceil(root.clientWidth / step) + 1;
      stepRef.current = step;
      setCopies(Math.min(Math.max(FALLBACK_COPIES, needed), MAX_COPIES));
      setSeconds(Math.min(Math.max(step / PX_PER_SECOND, MIN_SECONDS), MAX_SECONDS));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    // A late font or image swap changes card widths; one extra pass settles it.
    const settle = window.setTimeout(measure, 800);

    return () => {
      observer.disconnect();
      window.clearTimeout(settle);
    };
  }, [projects.length, narrow]);

  /** Nothing should drift while the gallery is off screen. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setOnScreen(entry.isIntersecting)),
      { rootMargin: "240px 0px" }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  /** In narrow mode, track which card is most visible, for the counter. */
  useEffect(() => {
    if (!narrow) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = Number((entry.target as HTMLElement).dataset.index ?? 0);
            setCurrentIndex(index);
          }
        }
      },
      { root: viewport, threshold: [0.6] }
    );
    for (const item of track.children) {
      if ((item as HTMLElement).dataset.copy === "0") observer.observe(item);
    }
    return () => observer.disconnect();
  }, [narrow, projects.length]);

  /** Width of one card plus its trailing gap, in pixels. */
  const cardStep = () => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return 0;
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement;
    return second.offsetLeft - first.offsetLeft;
  };

  /**
   * Move the gallery by one card.
   *
   * Narrow mode scrolls the native viewport, so the browser owns the motion.
   * Wide mode shifts the drift's phase by one card's share of a step and
   * pauses the drift briefly, so the new position is actually seen instead
   * of being carried away at once.
   */
  const stepBy = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    const width = cardStep();
    if (!viewport || width <= 0) return;

    if (narrow) {
      const rtl = getComputedStyle(viewport).direction === "rtl";
      // Forward is left in this right-to-left page.
      const delta = direction * (rtl ? -1 : 1) * width;
      viewport.scrollBy({ left: delta, behavior: "smooth" });
      return;
    }

    const step = stepRef.current;
    if (step <= 0) return;
    const fraction = width / step;
    setPhase((prev) => {
      const next = (prev + direction * fraction) % 1;
      return next < 0 ? next + 1 : next;
    });
    setPressed(true);
    if (pauseTimeoutRef.current !== null) {
      window.clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = window.setTimeout(() => setPressed(false), PAUSE_AFTER_STEP_MS);
  };

  const effectiveCopies = narrow ? 1 : copies;

  const style = {
    "--mrq-copies": String(effectiveCopies),
    /* A time, not a bare number: the stylesheet reads this as a duration, and a
       number there would invalidate the declaration. */
    "--mrq-duration": `${Math.round(seconds)}s`,
    /* The drift is linear, so this fraction of a cycle is where the row starts. */
    "--mrq-phase": String(phase),
  } as CSSProperties;

  const paused = !onScreen || pressed;

  return (
    <div
      className="mrq"
      id="work-gallery"
      ref={rootRef}
      data-paused={paused ? "true" : undefined}
      data-reveal="fade-up"
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      <div
        className="mrq-viewport"
        ref={viewportRef}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        <ul className="mrq-track" ref={trackRef} style={style} aria-label={label}>
          {Array.from({ length: effectiveCopies }, (_, copy) =>
            projects.map((project, index) => (
              <li
                className="mrq-item"
                key={`${copy}-${project.id}`}
                data-copy={copy}
                data-index={index}
                aria-hidden={copy > 0 || undefined}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  className="mrq-card"
                  decorative={copy > 0}
                />
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="mrq-controls">
        <p className="mrq-hint">{hint}</p>
        <div className="mrq-nav">
          <span className="mrq-count" aria-live="polite">
            {toPersianDigits(currentIndex + 1)} از {toPersianDigits(projects.length)}
          </span>
          <button
            type="button"
            className="mrq-nav-btn"
            aria-label={previousLabel}
            disabled={narrow && currentIndex <= 0}
            onClick={() => stepBy(-1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            className="mrq-nav-btn"
            aria-label={nextLabel}
            disabled={narrow && currentIndex >= projects.length - 1}
            onClick={() => stepBy(1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
