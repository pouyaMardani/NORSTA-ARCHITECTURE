"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import ProjectCard from "./ProjectCard";
import type { ProjectDTO } from "@/content/projects";

/**
 * The home-page project gallery: one horizontal track that drifts from right to
 * left, continuously and without a seam.
 *
 * How the loop works
 * ──────────────────
 * The project list is rendered `copies` times inside a single flex track, and
 * the track is animated by exactly *one* copy's width. Copy n+1 therefore sits
 * where copy n started, so the moment the animation restarts is
 * indistinguishable from the frame before it: no jump, no gap at either end.
 * `copies` is measured, never guessed — the effect works out how many copies it
 * takes to cover the viewport (so a very wide screen renders more, a phone the
 * minimum) and re-measures on resize. The *data* is never duplicated: only the
 * rendered track is, and every extra copy is hidden from assistive technology
 * and skipped by the tab order.
 *
 * `--mrq-copies` and `--mrq-duration` are the only knobs the stylesheet needs:
 * the shift is `-100% / copies` and the duration comes from the track's own
 * width, so the drift stays at one constant, very calm speed however many
 * projects there are. Without JavaScript the server-rendered markup still
 * carries two copies and the stylesheet's fallbacks keep the loop seamless.
 *
 * Motion pauses while the pointer is over the gallery, while anything inside it
 * has focus, while it is being pressed, and while it is off screen. The
 * observer is disconnected on unmount. `prefers-reduced-motion` gets the static
 * variant — one copy, no animation, a scrollable row (see `globals.css`).
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

type ProjectMarqueeProps = {
  /** The projects to show, in the order they should travel. */
  projects: ProjectDTO[];
  /** Accessible name of the gallery. */
  label: string;
};

export default function ProjectMarquee({ projects, label }: ProjectMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [copies, setCopies] = useState(FALLBACK_COPIES);
  const [seconds, setSeconds] = useState(MIN_SECONDS);
  const [pressed, setPressed] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  /**
   * Measure one copy and derive the two knobs from it. The step (the distance
   * between the first card of two neighbouring copies) is read straight off the
   * layout, so gaps, margins and card widths are all accounted for without the
   * script knowing any of them.
   */
  useEffect(() => {
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
  }, [projects.length]);

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

  const style = {
    "--mrq-copies": String(copies),
    /* A time, not a bare number: the stylesheet reads this as a duration, and a
       number there would invalidate the declaration. */
    "--mrq-duration": `${Math.round(seconds)}s`,
  } as CSSProperties;

  const paused = !onScreen || pressed;

  return (
    <div
      className="mrq"
      ref={rootRef}
      data-paused={paused ? "true" : undefined}
      data-reveal="fade-up"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      <div className="mrq-viewport">
        <ul className="mrq-track" ref={trackRef} style={style} aria-label={label}>
          {Array.from({ length: copies }, (_, copy) =>
            projects.map((project, index) => (
              <li
                className="mrq-item"
                key={`${copy}-${project.id}`}
                data-copy={copy}
                /* Counts within the copy, never across the track: the rhythm of
                   alternating plates is therefore identical on both sides of the
                   seam. */
                data-slot={index % 2}
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

      {/* Edge fades: they say the row continues, in the section's own ground. */}
      <span className="mrq-edge mrq-edge-start" aria-hidden="true" />
      <span className="mrq-edge mrq-edge-end" aria-hidden="true" />
    </div>
  );
}
