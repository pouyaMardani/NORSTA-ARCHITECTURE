"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { formatSampleCounter, formatZoomPercent } from "@/content/samples";

import type { SampleDTO, SampleLabels } from "@/content/samples";
import type { PointerEvent as ReactPointerEvent } from "react";

type Props = {
  /** The wall as it is currently filtered — prev/next walk exactly this list. */
  samples: SampleDTO[];
  index: number;
  labels: SampleLabels;
  onNavigate: (index: number) => void;
  onClose: () => void;
};

/** `scale` is relative to "the whole plate is visible", which is 1. */
type View = { scale: number; x: number; y: number };

type Pointer = { x: number; y: number };
type Pinch = {
  distance: number;
  scale: number;
  x: number;
  y: number;
  midX: number;
  midY: number;
};
type Pan = { x: number; y: number; px: number; py: number };

const MIN_SCALE = 1;
/** Six times the fit — enough to read the grain, not so much that it turns to mush. */
const MAX_SCALE = 6;
const STEP = 1.6;
const TAP_SCALE = 2.5;
/** A double tap is two presses inside this window and this radius. */
const TAP_MS = 320;
const TAP_SLOP = 10;
/** Everything a keyboard can reach inside the dialog. */
const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** A plate that fills its frame's 4/5 opening again, dead centre. */
const FIT: View = { scale: 1, x: 0, y: 0 };

const clampScale = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

/** The box the image really occupies inside the stage, letterboxing included. */
function fittedBox(stage: DOMRect, ratio: number) {
  let width = stage.width;
  let height = width / ratio;
  if (height > stage.height) {
    height = stage.height;
    width = height * ratio;
  }
  return { width, height };
}

/**
 * Keep the plate inside its own stage.
 *
 * At `scale` 1 the plate already fits the stage, so both limits are 0 and panning
 * is not possible at all — which is why the drag cursor only appears once the
 * visitor has zoomed in.
 */
function clampView(view: View, stage: DOMRect, ratio: number): View {
  const box = fittedBox(stage, ratio);
  const limitX = Math.max(0, (box.width * view.scale - box.width) / 2);
  const limitY = Math.max(0, (box.height * view.scale - box.height) / 2);
  return {
    scale: view.scale,
    x: Math.min(limitX, Math.max(-limitX, view.x)),
    y: Math.min(limitY, Math.max(-limitY, view.y)),
  };
}

/** Zoom towards a point, so what is under the finger or the cursor stays there. */
function zoomAt(view: View, scale: number, px: number, py: number): View {
  const next = clampScale(scale);
  if (next === view.scale) return view;
  const qx = (px - view.x) / view.scale;
  const qy = (py - view.y) / view.scale;
  return { scale: next, x: px - next * qx, y: py - next * qy };
}

const distanceBetween = (a: Pointer, b: Pointer) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * The deep-zoom viewer.
 *
 * ── THE FOUR WAYS IN ───────────────────────────────────────────────────────
 * 1. Scroll wheel or trackpad pinch — zooms towards the cursor (or the pinch's
 *    midpoint), so the part of the surface the visitor is pointing at is the part
 *    that grows.
 * 2. A single finger or a held mouse button — drags the plate once it is larger
 *    than the stage. At `1×` there is nothing to drag, so the gesture does nothing
 *    rather than sliding the plate out of its frame.
 * 3. Two fingers — pinch to zoom while sliding, anchored on the midpoint.
 * 4. Double tap / double click — jumps to 2.5× at that point, and back to `1×` if
 *    the plate is already zoomed.
 *
 * Plus the toolbar's own zoom out / zoom in / reset, and the keyboard's `+`, `-`
 * and `0`. Every one of them ends in the same `zoomAt` + `clampView` pair, so no
 * gesture can leave the plate off-centre or past its limits.
 *
 * ── WHY A NATIVE WHEEL LISTENER ────────────────────────────────────────────
 * React registers `wheel` as a passive listener, so `preventDefault` there is
 * ignored and the page would scroll behind the dialog. The listener below is
 * attached by hand with `{ passive: false }` for that reason alone.
 *
 * ── HONESTY ABOUT DETAIL ───────────────────────────────────────────────────
 * The zoom percentage is measured against the fit size, so «۶۰۰٪» means six times
 * the plate — not six times the native pixels. While a record still points at a
 * temporary plate, the viewer says «تصویر موقت» beside it, so no one reads detail
 * into a stand-in that was never photographed.
 */
export default function SampleViewer({ samples, index, labels, onNavigate, onClose }: Props) {
  const sample = samples[index];
  const total = samples.length;
  const ratio = sample.image.width / sample.image.height;

  const dialog = useRef<HTMLDivElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const frame = useRef<HTMLDivElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);

  const [view, setView] = useState<View>(FIT);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);

  // Mirrors, for the handlers that must not be re-created on every frame of a
  // gesture: the native wheel listener, the pointer moves and the geometry.
  const viewRef = useRef(view);
  const ratioRef = useRef(ratio);
  const pointers = useRef(new Map<number, Pointer>());
  const pinch = useRef<Pinch | null>(null);
  const pan = useRef<Pan | null>(null);
  const travel = useRef(0);
  const tap = useRef({ time: 0, x: 0, y: 0 });

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    ratioRef.current = ratio;
  }, [ratio]);

  /** Every view change passes through here: no state can escape the stage. */
  const settle = useCallback((next: View): View => {
    const element = stage.current;
    if (!element) return next;
    return clampView(next, element.getBoundingClientRect(), ratioRef.current);
  }, []);

  /** Where a client point sits, measured from the middle of the stage. */
  const anchorOf = useCallback((clientX: number, clientY: number) => {
    const element = stage.current;
    if (!element) return { px: 0, py: 0 };
    const rect = element.getBoundingClientRect();
    return {
      px: clientX - (rect.left + rect.width / 2),
      py: clientY - (rect.top + rect.height / 2),
    };
  }, []);

  /** Renders the transform exactly the way the frame's inline style states it. */
  const transformOf = (next: View) =>
    `translate3d(${next.x}px, ${next.y}px, 0) scale(${next.scale})`;

  /**
   * ── WHY A GESTURE WRITES THE DOM ITSELF ────────────────────────────────────
   * A drag or a pinch changes one thing and one thing only: the plate's
   * transform. Routing that through `setView` meant a React render of the whole
   * dialog on every frame of the gesture — the toolbar, the specification list,
   * and the `<Image>` inside this very frame, which is the heaviest node on the
   * page — for a single 40-byte style change. On a phone that is the difference
   * between a plate that follows the finger and one that trails it.
   *
   * So the handlers below write the transform straight to the frame and keep
   * `viewRef` as the value the frame is showing, which is what the next move of
   * the same gesture starts from. `commit` hands that value back to React when
   * the gesture ends, which is what refreshes the toolbar's percentage and the
   * `data-zoom` state. Nothing else in the component writes the frame, and React
   * only rewrites a style property whose rendered value actually changed — so a
   * re-render that leaves `view` alone cannot snap the plate back.
   */
  const apply = useCallback((next: View) => {
    viewRef.current = next;
    const element = frame.current;
    if (element) element.style.transform = transformOf(next);
  }, []);

  /** The gesture is over: React takes the plate back. */
  const commit = useCallback(() => {
    setView({ ...viewRef.current });
  }, []);

  const zoomBy = useCallback(
    (factor: number, px = 0, py = 0) => {
      setTouched(true);
      setView((previous) => settle(zoomAt(previous, previous.scale * factor, px, py)));
    },
    [settle]
  );

  const reset = useCallback(() => setView(FIT), []);

  const step = useCallback(
    (delta: number) => {
      onNavigate((index + delta + total) % total);
    },
    [index, onNavigate, total]
  );

  // A new sample opens at its own fit: carrying one plate's zoom onto another
  // would drop the visitor into the middle of a surface they never chose.
  useLayoutEffect(() => {
    setView(FIT);
    setDragging(false);
    pointers.current.clear();
    pinch.current = null;
    pan.current = null;
  }, [index]);

  // The viewer is the whole screen while it is up, so the page behind it must not
  // scroll — with the keyboard either. The close button takes the focus, so the
  // dialog is announced and the first Tab lands where a visitor would look.
  useEffect(() => {
    document.body.classList.add("mv-open");
    closeButton.current?.focus();
    return () => document.body.classList.remove("mv-open");
  }, []);

  // ---------- Wheel / trackpad pinch ----------
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const { px, py } = anchorOf(event.clientX, event.clientY);
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      setTouched(true);
      setView((previous) =>
        settle(zoomAt(previous, previous.scale * Math.exp(-delta * 0.0022), px, py))
      );
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [anchorOf, settle]);

  // ---------- Keyboard: close, walk, zoom, and a trap so focus cannot leave ----------
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const root = dialog.current;
      if (!root) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const reachable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (element) => element.offsetParent !== null || element === document.activeElement
        );
        if (!reachable.length) return;
        const first = reachable[0];
        const last = reachable[reachable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!active || !root.contains(active)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        // In this right-to-left register "onwards" travels to the left, so the
        // arrow keys follow the eye rather than the writing system.
        const rtl = window.getComputedStyle(root).direction === "rtl";
        const forward = rtl ? event.key === "ArrowLeft" : event.key === "ArrowRight";
        event.preventDefault();
        step(forward ? 1 : -1);
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomBy(STEP);
        return;
      }

      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        zoomBy(1 / STEP);
        return;
      }

      if (event.key === "0") {
        event.preventDefault();
        reset();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, reset, step, zoomBy]);

  // ---------- Pointer gestures: drag, pinch, double tap ----------
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = stage.current;
    if (!element) return;
    element.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    travel.current = 0;

    if (pointers.current.size === 1) {
      const current = viewRef.current;
      pan.current = { x: current.x, y: current.y, px: event.clientX, py: event.clientY };
      if (current.scale > MIN_SCALE) setDragging(true);
    } else if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      const { px, py } = anchorOf((a.x + b.x) / 2, (a.y + b.y) / 2);
      const current = viewRef.current;
      pinch.current = {
        distance: distanceBetween(a, b) || 1,
        scale: current.scale,
        x: current.x,
        y: current.y,
        midX: px,
        midY: py,
      };
      pan.current = null;
      setDragging(true);
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    const previous = pointers.current.get(event.pointerId) as Pointer;
    travel.current += Math.hypot(event.clientX - previous.x, event.clientY - previous.y);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size >= 2 && pinch.current) {
      const active = pinch.current;
      const [a, b] = Array.from(pointers.current.values());
      const { px, py } = anchorOf((a.x + b.x) / 2, (a.y + b.y) / 2);
      // Derived from the gesture's own starting view, never from the frame
      // before it: a pinch that reverses retraces exactly the path it came along.
      const from: View = { scale: active.scale, x: active.x, y: active.y };
      const zoomed = zoomAt(
        from,
        active.scale * (distanceBetween(a, b) / active.distance),
        active.midX,
        active.midY
      );
      setTouched(true);
      apply(
        settle({
          scale: zoomed.scale,
          x: zoomed.x + (px - active.midX),
          y: zoomed.y + (py - active.midY),
        })
      );
      return;
    }

    const origin = pan.current;
    if (!origin) return;
    apply(
      settle({
        scale: viewRef.current.scale,
        x: origin.x + (event.clientX - origin.px),
        y: origin.y + (event.clientY - origin.py),
      })
    );
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.delete(event.pointerId);

    if (pointers.current.size < 2) pinch.current = null;

    if (pointers.current.size === 1) {
      // A finger left the glass mid-pinch: the remaining one carries on panning.
      const [only] = Array.from(pointers.current.values());
      pan.current = { x: viewRef.current.x, y: viewRef.current.y, px: only.x, py: only.y };
      return;
    }

    if (pointers.current.size > 0) return;
    pan.current = null;
    setDragging(false);
    // The gesture is over, so the plate goes back under React's care — one render
    // for the whole drag, rather than one for every frame of it.
    commit();

    // A tap that never travelled is half of a double tap. Measure first, so a
    // drag that happens to end where it started cannot be mistaken for one.
    if (travel.current > TAP_SLOP) {
      tap.current = { time: 0, x: 0, y: 0 };
      return;
    }

    const previous = tap.current;
    const nearEnough =
      Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < TAP_SLOP * 2;
    if (event.timeStamp - previous.time < TAP_MS && nearEnough) {
      tap.current = { time: 0, x: 0, y: 0 };
      if (viewRef.current.scale > MIN_SCALE + 0.01) {
        reset();
      } else {
        const { px, py } = anchorOf(event.clientX, event.clientY);
        setTouched(true);
        setView((current) => settle(zoomAt(current, TAP_SCALE, px, py)));
      }
      return;
    }

    tap.current = { time: event.timeStamp, x: event.clientX, y: event.clientY };
  };

  const zoomed = view.scale > MIN_SCALE + 0.01;

  return (
    <div
      className="mv"
      data-zoom={zoomed ? "true" : "false"}
      data-drag={dragging ? "true" : "false"}
      data-touched={touched ? "true" : "false"}
    >
      {/* A click on the scrim is the oldest way out of a photograph, so it stays
          — decoration for the pointer, nothing at all for a screen reader. */}
      <div className="mv-scrim" onClick={onClose} aria-hidden="true" />

      {/* ── THE DIALOG'S OWN REGISTER ───────────────────────────────────────
          The panel's copy, the specification pairs and the two walking controls
          are all Persian, so the dialog is the RTL register: the labels read
          from the right, each specification value sits opposite its own term,
          and the footer's order puts «قبلی» where the reading starts — which is
          also the side its arrow points to. */}
      <div
        className="mv-dialog"
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={labels.viewerLabel}
        dir="rtl"
      >
        <div className="mv-bar">
          <p className="mv-position" role="status">
            {formatSampleCounter(index, total)}
          </p>

          <div className="mv-tools">
            <button
              type="button"
              className="mv-tool"
              onClick={() => zoomBy(1 / STEP)}
              disabled={!zoomed}
              aria-label={labels.zoomOut}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <circle cx="10.8" cy="10.8" r="6.2" />
                <path d="M15.4 15.4 20.5 20.5" />
                <path d="M8.5 10.8h4.6" />
              </svg>
              <span className="mv-tool-text">{labels.zoomOut}</span>
            </button>

            <span className="mv-zoom" aria-hidden="true">
              {formatZoomPercent(view.scale)}
            </span>

            <button
              type="button"
              className="mv-tool"
              onClick={() => zoomBy(STEP)}
              disabled={view.scale >= MAX_SCALE}
              aria-label={labels.zoomIn}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <circle cx="10.8" cy="10.8" r="6.2" />
                <path d="M15.4 15.4 20.5 20.5" />
                <path d="M10.8 8.5v4.6M8.5 10.8h4.6" />
              </svg>
              <span className="mv-tool-text">{labels.zoomIn}</span>
            </button>

            <button
              type="button"
              className="mv-tool"
              onClick={reset}
              disabled={!zoomed}
              aria-label={labels.reset}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <path d="M4.5 10.2A7.6 7.6 0 1 1 6.6 16" />
                <path d="M4.2 5.4v4.8h4.8" />
              </svg>
              <span className="mv-tool-text">{labels.reset}</span>
            </button>

            <button
              type="button"
              className="mv-close"
              ref={closeButton}
              onClick={onClose}
              aria-label={labels.close}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <path d="M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mv-body">
          {/* The stage is the gesture surface; the frame inside it is what
              actually moves. The `touch-action: none` in the stylesheet is what
              keeps the browser from taking the pinch for its own page zoom. */}
          <div
            className="mv-stage"
            ref={stage}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
          >
            <div
              className="mv-frame"
              ref={frame}
              style={{
                transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
              }}
            >
              <Image
                src={sample.image.src}
                alt={sample.image.alt}
                fill
                sizes="(max-width: 860px) 100vw, min(1080px, 76vw)"
                quality={90}
                draggable={false}
                style={{ objectFit: "contain" }}
              />
            </div>

            {sample.image.placeholder ? (
              <span className="mv-badge">{labels.placeholder}</span>
            ) : null}

            <p className="mv-hints" aria-hidden="true">
              <span className="mv-hint">{labels.hintZoom}</span>
              <span className="mv-hint-sep" />
              <span className="mv-hint">{labels.hintPan}</span>
            </p>
          </div>

          <div className="mv-panel">
            <h3 className="mv-name">{sample.name}</h3>

            {sample.description ? <p className="mv-desc">{sample.description}</p> : null}

            <dl className="mv-specs">
              <div className="mv-spec">
                <dt>{labels.category}</dt>
                <dd>{sample.category}</dd>
              </div>

              {sample.finish ? (
                <div className="mv-spec">
                  <dt>{labels.finish}</dt>
                  <dd>{sample.finish}</dd>
                </div>
              ) : null}

              {sample.color ? (
                <div className="mv-spec">
                  <dt>{labels.color}</dt>
                  <dd>
                    <i
                      className="mv-chip"
                      aria-hidden="true"
                      style={sample.colorHex ? { background: sample.colorHex } : undefined}
                    />
                    {sample.color}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        {total > 1 ? (
          <div className="mv-foot">
            <button
              type="button"
              className="mv-nav"
              onClick={() => step(-1)}
              aria-label={labels.prev}
            >
              {/* In this right-to-left register the previous sample is the one
                  the eye has already passed, so its arrow points right. */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span className="mv-nav-text">{labels.prev}</span>
            </button>

            <button
              type="button"
              className="mv-nav"
              onClick={() => step(1)}
              aria-label={labels.next}
            >
              <span className="mv-nav-text">{labels.next}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}



