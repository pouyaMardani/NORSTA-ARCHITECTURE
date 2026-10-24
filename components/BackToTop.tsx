"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Floating “back to top” control.
 *
 * A single circular button, fixed in the page's bottom corner, that appears
 * once the reader is a meaningful distance into a page and returns them to the
 * top when pressed. It is mounted once by `app/layout.tsx`, so it is available
 * on every route — the home page, the magazine, the project gallery and each of
 * their detail pages — without any page having to opt in.
 *
 * Why it works this way:
 *   · **Hidden until it is needed.** Visibility is expressed as a `data-visible`
 *     attribute and handled entirely in CSS (`globals.css` → “Floating
 *     back-to-top control”), so the button is server-rendered in its hidden
 *     state and the first client render agrees with it. There is no
 *     `window`-derived value in the initial markup, which is what keeps this
 *     free of hydration mismatches; `visibility:hidden` + `pointer-events:none`
 *     also keep it out of the tab order and out of the way of assistive tech
 *     while it is not shown.
 *   · **Cheap to run.** The scroll listener is `passive` and coalesced through
 *     `requestAnimationFrame`, and it only calls `setState` when the threshold
 *     is actually crossed, so a long scroll produces at most two renders rather
 *     than one per frame.
 *   · **No arbitrary timers.** Nothing is scheduled to hide the button: its
 *     state is a pure function of the scroll position.
 */

/**
 * How far down the page the control appears: a fraction of the viewport, with a
 * floor so it can never pop up inside a short first screen. It is measured
 * rather than hard-coded because the hero is a full viewport tall — on a tall
 * display a fixed pixel value would surface the button while the reader is
 * still inside the hero.
 */
const thresholdFor = () => Math.max(420, window.innerHeight * 0.6);

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  /**
   * Mirrors `visible` for the scroll handler. Reading state from a ref lets the
   * handler compare against the last value without being re-created (and its
   * listeners re-attached) every time the button toggles.
   */
  const visibleRef = useRef(false);

  useEffect(() => {
    let frame = 0;

    const sync = () => {
      const next = window.scrollY > thresholdFor();
      if (next === visibleRef.current) return;
      visibleRef.current = next;
      setVisible(next);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    };

    // The page may already be scrolled — a restored history entry, a deep link
    // to an anchor, or a client-side navigation that kept the position.
    sync();

    window.addEventListener("scroll", onScroll, { passive: true });
    // The threshold is viewport-relative, so a resize can change the answer.
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    // The stylesheet already drops `scroll-behavior` under reduced motion, but
    // the explicit behaviour keeps the intent local and correct even if that
    // rule is ever refactored.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, []);

  return (
    <button
      type="button"
      className="to-top"
      data-visible={visible ? "true" : undefined}
      aria-label="بازگشت به بالای صفحه"
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? undefined : -1}
      onClick={scrollToTop}
    >
      {/* An elongated stem under a shallow chevron: an architectural arrow
          rather than a stock glyph. It lifts on hover (see `globals.css`). */}
      <span className="to-top-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20V5" />
          <path d="M5.5 11.5 12 5l6.5 6.5" />
        </svg>
      </span>
    </button>
  );
}
