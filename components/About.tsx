"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";

import { ABOUT_SHOWCASE, formatCompareValue, formatSampleNumber } from "@/content/about";

const { copy, samples } = ABOUT_SHOWCASE;

/**
 * The studio block, showing its own work: a small selector of comparisons
 * and, under it, one frame holding two photographs of one space with a
 * divider between them.
 *
 * This is the section's only view. It used to share the block with a "studio"
 * mode — the matted photograph and the studio's own words beside it — but
 * that half is gone: the section is the showcase now, and the switch that
 * chose between the two went with it. The header's `#about` jump, the reveal
 * system and the page's section order are exactly as they were.
 *
 * ── WHY THIS FILE IS THE CLIENT BOUNDARY ───────────────────────────────────
 * The selected comparison and the divider's position are two pieces of state,
 * and every one of them is visible in the markup. Keeping them in one client
 * component means the whole section is one boundary, the static half is never
 * re-created by a second copy of itself, and nothing elsewhere in the page has
 * to know that About can move.
 *
 * ── WHY A DRAG DOES NOT GO THROUGH REACT ───────────────────────────────────
 * A pointer drag fires far faster than the browser paints. So during a drag
 * nothing is set in React: the position is written straight to the frame as the
 * `--about-pos` custom property (one write per animation frame, from a
 * rectangle measured once when the pointer went down), and the divider's readout
 * and the slider's `aria-valuenow` are updated in that same frame, so what an
 * assistive layer announces is never behind what a sighted visitor sees. React
 * state is written once, on release. The keyboard path is a discrete press, so
 * it paints and commits in one step.
 *
 * ── THE ON-SCREEN MEANING OF THE NUMBER ────────────────────────────────────
 * `--about-pos` is the share of the frame the *original* side occupies, measured
 * from the block's inline-start edge — the right edge in this RTL section — so
 * «۵۰٪ پیش از اجرا» reads as: half the frame is still the space before the work.
 * The before layer is clipped with
 * `clip-path: inset(0 0 0 calc(100% - var(--about-pos)))` and the divider is
 * pinned from the same edge, so the seam can never drift away from the mask.
 *
 * ── KEYS ───────────────────────────────────────────────────────────────────
 * A horizontal slider in an RTL block is mirrored, and so are these keys: Left
 * and Up grow the share of the original side (the divider travels the way the
 * key points), Right and Down shrink it, PageUp/PageDown move ten, and Home/End
 * are the two ends of the measure — 0٪ is all "after", 100٪ is all "before".
 * Each of these keys is taken from the page while the handle has focus, so
 * pressing them can never scroll the document instead.
 */

/** How far one arrow key moves the divider, in percent of the frame. */
const STEP = 2;

/** How far PageUp/PageDown move it. */
const PAGE = 10;

/**
 * The frame runs the full measure of the section at every width, so the
 * section's own gutters are the only thing subtracted from the viewport.
 */
const FRAME_SIZES = "(max-width: 680px) calc(100vw - 56px), 88vw";

/** The disclosure the divider points at while a stand-in is on screen. */
const NOTE_ID = "about-compare-note";

const clamp = (value: number) => Math.min(100, Math.max(0, value));

/**
 * The position a pointer lands on, kept to a tenth of a percent: finer than a
 * pixel at any frame width, and short enough that the number written to the DOM
 * and the number React commits are the same string — so a re-render can never
 * nudge the seam by the pointer's own float noise.
 */
const round = (value: number) => Math.round(value * 10) / 10;

export default function About() {
  const [activeId, setActiveId] = useState(samples[0].id);
  const [pos, setPos] = useState(50);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);
  /** The live position, readable by the handlers without re-rendering. */
  const posRef = useRef(50);
  /** The frame's box, measured once per drag rather than once per event. */
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef(0);
  const draggingRef = useRef(false);

  const active = samples.find((sample) => sample.id === activeId) ?? samples[0];
  /** Only the samples flagged as stand-ins carry the badge and the note. */
  const standIn = active.placeholder;
  const valueText = formatCompareValue(pos);

  /** Writes the divider's position, its readout and the slider's value. */
  const paint = useCallback((value: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    // The measure twice over: as a percentage, which is what the mask, the seam
    // and the handle are written against, and as a bare number, which is what
    // lets the stylesheet do arithmetic on it — the two corner badges step aside
    // at the ends of the measure, and CSS cannot compare a percentage to a
    // length. One write each, from one value.
    frame.style.setProperty("--about-pos", `${value}%`);
    frame.style.setProperty("--about-pos-n", String(value));

    const text = formatCompareValue(value);
    const slider = sliderRef.current;
    if (slider) {
      slider.setAttribute("aria-valuenow", String(Math.round(value)));
      slider.setAttribute("aria-valuetext", text);
    }
    if (readoutRef.current) readoutRef.current.textContent = text;
  }, []);

  /** At most one paint per animation frame, however fast the pointer moves. */
  const schedule = useCallback(
    (value: number) => {
      posRef.current = round(value);
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        paint(posRef.current);
      });
    },
    [paint],
  );

  /** Where a pointer at `clientX` puts the seam, as percent from the right edge. */
  const valueFromX = useCallback((clientX: number) => {
    const rect = rectRef.current ?? frameRef.current?.getBoundingClientRect() ?? null;
    if (!rect || !rect.width) return posRef.current;
    return clamp(((rect.right - clientX) / rect.width) * 100);
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const frame = frameRef.current;
    if (!frame) return;

    rectRef.current = frame.getBoundingClientRect();
    draggingRef.current = true;
    frame.classList.add("is-dragging");
    frame.setPointerCapture(event.pointerId);
    schedule(valueFromX(event.clientX));
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    schedule(valueFromX(event.clientX));
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    rectRef.current = null;

    const frame = frameRef.current;
    frame?.classList.remove("is-dragging");
    if (frame?.hasPointerCapture(event.pointerId)) frame.releasePointerCapture(event.pointerId);
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }

    paint(posRef.current);
    // The one state write of the whole drag.
    setPos(posRef.current);
  };

  const onDividerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = posRef.current;
    let next: number;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        next = current + STEP;
        break;
      case "ArrowRight":
      case "ArrowDown":
        next = current - STEP;
        break;
      case "PageUp":
        next = current + PAGE;
        break;
      case "PageDown":
        next = current - PAGE;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
      default:
        return;
    }

    event.preventDefault();
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }

    const value = clamp(next);
    posRef.current = value;
    paint(value);
    setPos(value);
  };

  /** A new comparison arrives at the middle of its own measure. */
  const selectSample = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    posRef.current = 50;
    setPos(50);
  };

  return (
    <section id="about" className="about">
      {/*
        The showcase: a selector of comparisons and one frame holding two
        photographs of one space at the same box size — the "after" one laid
        flat, the "before" one clipped from the block's inline-start edge by
        the same custom property that pins the divider, so the seam and the
        mask are one number written once per frame.

        The frame is also the control's surface. Pressing anywhere on a picture
        moves the divider there and dragging anywhere on it keeps moving it, so a
        visitor never has to catch a 28px handle with a thumb; the handle itself
        is the keyboard and screen-reader entry point into the same measure.

        Every part of the copy here comes from `content/about`, including the
        stand-in labels, so nothing about what these pictures are is decided in
        this file.
      */}
      <div className="about-panel--compare" dir="rtl">
        <header className="about-compare-head">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h2 className="about-compare-title">{copy.title}</h2>
          <p className="about-compare-lede">{copy.lede}</p>
        </header>

        <div className="about-samples" role="group" aria-label={copy.samplesLabel}>
          {samples.map((sample, index) => (
            <button
              key={sample.id}
              type="button"
              className="about-sample"
              aria-current={sample.id === active.id ? "true" : undefined}
              onClick={() => selectSample(sample.id)}
            >
              <span className="about-sample-index" aria-hidden="true">
                {formatSampleNumber(index)}
              </span>
              {sample.name}
            </button>
          ))}
        </div>

        <div className="about-compare-wrap">
          <div
            className="about-compare"
            ref={frameRef}
            style={
              {
                "--about-pos": `${pos}%`,
                "--about-pos-n": pos,
              } as CSSProperties
            }
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div className="about-compare-layer">
              <Image
                src={active.after.src}
                alt={active.after.alt}
                fill
                sizes={FRAME_SIZES}
                draggable={false}
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="about-compare-layer about-compare-layer--before">
              <Image
                src={active.before.src}
                alt={active.before.alt}
                fill
                sizes={FRAME_SIZES}
                draggable={false}
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* The two badges ride the pictures themselves: the original space
                in the top corner of the half it owns, the finished one in the
                other, each a little inside the frame's own edge — so a label
                stands on the photograph it names at every width, rather than
                on the rule above the pair. They are drawn before the seam and
                the handle, which stay over them, and their pointer events
                belong to the frame: a press that starts on a badge still moves
                the divider. Each one fades out as its own half narrows past
                the width of the badge, from the same number that moves the
                seam. */}
            <span className="about-compare-side about-compare-side--before">
              {copy.before}
            </span>
            <span className="about-compare-side about-compare-side--after">
              {copy.after}
            </span>

            <span className="about-compare-seam" aria-hidden="true" />

            <div
              className="about-compare-handle"
              role="slider"
              tabIndex={0}
              ref={sliderRef}
              aria-label={copy.sliderLabel}
              aria-orientation="horizontal"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={valueText}
              aria-describedby={standIn ? NOTE_ID : undefined}
              onKeyDown={onDividerKeyDown}
            >
              <span className="about-compare-grip" aria-hidden="true">
                <i />
                <i />
              </span>
            </div>
          </div>

          {/* The stand-in badge hangs on the wrap's lower rule, clear of the
              pictures, and is the only label left outside the frame. */}
          {standIn ? <span className="about-compare-badge">{copy.placeholder}</span> : null}
        </div>

        <div className="about-compare-meta">
          {/* The readout is written by the drag itself, so it never lags the
              pictures; assistive layers read the slider's own value instead. */}
          <span className="about-compare-value" ref={readoutRef} aria-hidden="true">
            {valueText}
          </span>
          <span className="about-compare-hint">{copy.hint}</span>
        </div>

        {/* The disclosure, shown only while a stand-in pair is on screen, and
            pointed at by the handle: what these pictures are is never implied. */}
        {standIn ? (
          <p className="about-compare-note" id={NOTE_ID}>
            {copy.placeholderNote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
