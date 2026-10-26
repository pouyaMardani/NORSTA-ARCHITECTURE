"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

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
 * has focus, while it is being pressed, and while it is off screen. On a touch
 * screen the row is dragged by hand rather than scrolled, and the drag is folded
 * into the loop (see `onPointerDown`) so the two motions share one coordinate.
 * The observer is disconnected on unmount. `prefers-reduced-motion` gets the
 * static variant — one copy, no animation, a scrollable row (see `globals.css`).
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

  /** One copy's width in pixels — the only distance a loop may ever travel. */
  const stepRef = useRef(0);
  /** The offset the hand is holding the row at right now, in pixels. */
  const holdRef = useRef(0);
  /** True while a hand owns the row, so a second finger is ignored. */
  const draggingRef = useRef(false);
  const [phase, setPhase] = useState(0);

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

  /**
   * ── THE HAND'S OWN LOOP ────────────────────────────────────────────────────
   * On a touchscreen the row is dragged rather than scrolled, and the drag and
   * the drift share one coordinate: the offset is folded into a single step, so
   * the seam can never be on screen.
   *
   * The native scroller this replaces is what broke the loop. The drift shifts
   * the whole track by one copy's width, and a row that had *also* been scrolled
   * by hand could be pushed past its own last copy — with the minimum number of
   * copies rendered, the far end of the scroll range plus a full step of drift
   * lands the visible window beyond the track's last frame, and a gap opens at
   * the row's edge. One mechanism, one coordinate, no gap.
   *
   * The hand-over at the end of a drag is a phase rather than a jump: the drift
   * is linear, so the fraction of a step the row was left at is exactly the
   * negative delay the animation needs to carry on from there.
   */

  /** Fold an offset into one step, half-open at the top, so the seam stays hidden. */
  const foldShift = (value: number) => {
    const step = stepRef.current;
    if (step <= 0) return 0;
    const folded = ((value % step) + step) % step;
    return folded === 0 ? 0 : folded - step;
  };

  /** Where the track sits right now — read off the running animation itself. */
  const currentShift = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const matrix = getComputedStyle(track).transform;
    if (matrix === "none") return 0;
    return foldShift(new DOMMatrixReadOnly(matrix).m41);
  };

  /**
   * A mouse keeps the older behaviour: pressing the row holds the drift while
   * the hand is down, and nothing is dragged — the plates inside are links, and
   * a click that had been pulled sideways should not open one.
   *
   * A touch or a pen does drag, and nothing is re-rendered for it: the gesture
   * writes the track's transform straight to the element — the same property the
   * animation writes — and React is asked only once, on release, for the phase
   * the loop should carry on from. The pointer is deliberately *not* captured:
   * a captured pointer makes the browser post the click to the capturing
   * element, and a plain tap on a plate must still open its project.
   */
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setPressed(true);
      return;
    }
    const root = rootRef.current;
    const track = trackRef.current;
    if (
      !root ||
      !track ||
      draggingRef.current ||
      stepRef.current <= 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const startX = event.clientX;
    const startShift = currentShift();
    draggingRef.current = true;
    holdRef.current = startShift;
    root.setAttribute("data-drag", "true");
    track.style.transform = `translate3d(${startShift}px, 0, 0)`;

    const onMove = (move: globalThis.PointerEvent) => {
      holdRef.current = foldShift(startShift + (move.clientX - startX));
      track.style.transform = `translate3d(${holdRef.current}px, 0, 0)`;
    };

    /* The listeners live on the window, not on the row: a finger that wanders
       off it — or a gesture the page claims back for a vertical pan — must still
       end the drag, or the row would be left frozen with the drift switched off. */
    const finish = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      draggingRef.current = false;
      root.removeAttribute("data-drag");
      track.style.transform = "";
      const step = stepRef.current;
      setPhase(step > 0 ? Math.min(1, Math.max(0, -holdRef.current / step)) : 0);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
  };

  const style = {
    "--mrq-copies": String(copies),
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
      ref={rootRef}
      data-paused={paused ? "true" : undefined}
      data-reveal="fade-up"
      onPointerDown={onPointerDown}
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
