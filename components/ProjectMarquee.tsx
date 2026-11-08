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
 *    rendered in this mode, so there is no seam to hide. The drift does not
 *    reach a phone, so narrow mode advances one card at a time on its own
 *    instead — every 4.5 seconds, pausing for six seconds after a hand
 *    touches the row, while the gallery is off screen, and entirely for
 *    `prefers-reduced-motion`.
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
/** How often the row advances by itself on a narrow screen. */
const AUTO_ADVANCE_MS = 4500;
/** How long after a hand on the row the auto-advance stays paused. */
const RESUME_AFTER_MS = 6000;

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
  /** Mirrors `currentIndex` for the auto-advance timer, so it never reads stale. */
  const currentIndexRef = useRef(0);
  /** Last time a hand touched the row (finger, button or key), in ms. */
  const lastInteractionRef = useRef(0);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

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

  /** In narrow mode, track which card is most visible, for the counter.
      The entry with the highest ratio wins: taking the last entry in the
      batch could name the card that is leaving instead of the one that has
      snapped into place. */
  useEffect(() => {
    if (!narrow) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        }
        if (best) {
          setCurrentIndex(Number((best.target as HTMLElement).dataset.index ?? 0));
        }
      },
      { root: viewport, threshold: [0.5, 0.6, 0.8, 1] }
    );
    for (const item of track.children) {
      if ((item as HTMLElement).dataset.copy === "0") observer.observe(item);
    }
    return () => observer.disconnect();
  }, [narrow, projects.length]);

  /**
   * Auto-advance on a narrow screen: the desktop drift never reaches a phone,
   * so the row advances one card at a time on its own. It stops while the
   * gallery is off screen, while the tab is hidden, for six seconds after a
   * hand touches the row, and entirely for `prefers-reduced-motion` — the
   * row is never moved under a reader who asked for less motion. The timer
   * only reads the interaction timestamp, never the scroll position, so an
   * auto-advance never mistakes its own smooth scroll for a hand.
   */
  useEffect(() => {
    if (!narrow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.hidden || !onScreen) return;
      if (Date.now() - lastInteractionRef.current < RESUME_AFTER_MS) return;
      const track = trackRef.current;
      if (!track) return;
      const next = (currentIndexRef.current + 1) % projects.length;
      const item = track.children[next] as HTMLElement | undefined;
      item?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      setCurrentIndex(next);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [narrow, onScreen, projects.length]);

  /** A hand on the row pauses the auto-advance; a scroll caused by the
      auto-advance itself does not, because it never fires these handlers. */
  const noteInteraction = () => {
    lastInteractionRef.current = Date.now();
  };

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
   * Narrow mode scrolls the target card itself into view. That is deliberate:
   * `scrollBy({left})` is not portable in a right-to-left row — Chrome and
   * Firefox count `scrollLeft` down from 0 while Safari counts it down from
   * the maximum, so the same signed delta moves the row in opposite
   * directions on different phones, which is exactly how the two buttons
   * ended up swapped. `scrollIntoView` has no sign to get wrong.
   * Wide mode shifts the drift's phase by one card's share of a step and
   * pauses the drift briefly, so the new position is actually seen instead
   * of being carried away at once.
   */
  const stepBy = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    noteInteraction();

    if (narrow) {
      const target = Math.min(
        Math.max(currentIndex + direction, 0),
        projects.length - 1
      );
      const item = track.children[target] as HTMLElement | undefined;
      item?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      setCurrentIndex(target);
      return;
    }

    const width = cardStep();
    const step = stepRef.current;
    if (width <= 0 || step <= 0) return;
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
        onPointerDown={noteInteraction}
        onTouchStart={noteInteraction}
        onWheel={noteInteraction}
        onKeyDown={noteInteraction}
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
          {/* The counter is three flex items, not one bidi string: a plain
              "۳ از ۴" string lets the bidi algorithm put the numbers on the
              wrong sides, so it read as "۴ از ۳". Flex in a right-to-left
              row lays the items out in DOM order — current, "از", total —
              which reads correctly in every browser. */}
          <span className="mrq-count" dir="rtl" aria-live="polite">
            <span className="mrq-count-num">{toPersianDigits(currentIndex + 1)}</span>
            <span className="mrq-count-sep" aria-hidden="true">
              از
            </span>
            <span className="mrq-count-num">{toPersianDigits(projects.length)}</span>
          </span>
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
