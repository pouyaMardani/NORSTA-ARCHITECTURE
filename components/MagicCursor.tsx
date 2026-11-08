"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The magic cursor — the small dot that trails the pointer.
 *
 * A faithful port of the reference template's `at-cursor.js` (a 14px ball
 * that follows the mouse with a 0.15 lerp, grows on magnetic elements,
 * swells into a blurred 110px disc with a label over `[data-cursor]`
 * elements, and hides over links and buttons), rewritten without jQuery or
 * GSAP: one `requestAnimationFrame` loop moves the wrapper, and the ball's
 * own scale, size and opacity ride CSS transitions.
 *
 * What it does, in the reference's order:
 *   · Disabled below 992px and on touch / coarse-pointer devices — the ball
 *     is never rendered there, so nothing can show a stray dot on mobile.
 *   · The native cursor is left alone: the ball trails beside it, exactly
 *     as the reference does (it never sets `cursor: none`).
 *   · `mix-blend-mode: difference` on an ink ball, so the dot reads on the
 *     ivory sections and inverts to a light dot on the dark ones.
 *   · Magnetic elements (`[data-magnetic]`) pull the ball to twice its size
 *     and are themselves drawn a little toward the pointer, then released.
 *   · `[data-cursor="…"]` elements grow the ball into a blurred disc with
 *     that label inside — the project cards use it for «مشاهده».
 *   · Over any other link or button the ball fades away, and a click on a
 *     link pulses it once.
 *   · The ball hides while the pointer is outside the document.
 *
 * Reduced motion disables the whole thing: a trailing dot is motion, and
 * nothing here is needed for the page to work.
 */
export default function MagicCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  /**
   * `null` until the effect has measured the device: the ball is rendered
   * (invisible, `opacity: 0` in CSS) so the server markup and the first
   * client render agree. Once measured, a touch or small device unmounts it
   * entirely — the reference removes `#magic-cursor` the same way — and a
   * desktop pointer keeps it.
   */
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const off =
      window.matchMedia(
        "(max-width: 991.98px), (hover: none), (pointer: coarse)"
      ).matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!off);
    const cursor = cursorRef.current;
    const ball = ballRef.current;
    const label = labelRef.current;
    if (off || !cursor || !ball) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    const RATIO = 0.15;
    let raf = 0;
    let shown = false;
    let magnetic: HTMLElement | null = null;
    let viewLabel: string | null = null;

    const show = () => {
      if (shown) return;
      shown = true;
      cursor.classList.add("is-on");
    };

    const tick = () => {
      if (!magnetic) {
        pos.x += (mouse.x - pos.x) * RATIO;
        pos.y += (mouse.y - pos.y) * RATIO;
      }
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      show();
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        // The element leans toward the pointer (25px at the edge, as in the
        // reference) and the ball is drawn halfway to the element's centre.
        magnetic.style.transform = `translate3d(${
          ((relX - rect.width / 2) / rect.width) * 25
        }px, ${((relY - rect.height / 2) / rect.height) * 25}px, 0)`;
        pos.x =
          rect.left + rect.width / 2 + (relX - rect.width / 2) / 2;
        pos.y =
          rect.top + rect.height / 2 + (relY - rect.height / 2) / 2;
      }
    };

    const enterMagnetic = (el: HTMLElement) => {
      magnetic = el;
      el.style.transition = "transform .3s ease-out";
      ball.classList.add("is-magnetic");
    };

    const leaveMagnetic = () => {
      if (!magnetic) return;
      magnetic.style.transform = "";
      magnetic.style.transition = "";
      magnetic = null;
      ball.classList.remove("is-magnetic");
    };

    const enterView = (text: string) => {
      viewLabel = text;
      if (label) label.textContent = text;
      ball.classList.add("is-view");
    };

    const leaveView = () => {
      viewLabel = null;
      ball.classList.remove("is-view");
    };

    /** The nearest element that wants the ball, if any. */
    const wanted = (target: EventTarget | null) => {
      const el = (target as HTMLElement | null)?.closest?.(
        "[data-magnetic], [data-cursor]"
      ) as HTMLElement | null;
      if (!el) return null;
      return el.hasAttribute("data-magnetic")
        ? { kind: "magnetic" as const, el }
        : { kind: "view" as const, el, text: el.getAttribute("data-cursor") || "" };
    };

    const onMouseOver = (e: MouseEvent) => {
      const w = wanted(e.target);
      if (w?.kind === "magnetic") {
        if (magnetic !== w.el) {
          leaveMagnetic();
          leaveView();
          enterMagnetic(w.el);
        }
        return;
      }
      if (w?.kind === "view") {
        if (viewLabel !== w.text) {
          leaveMagnetic();
          leaveView();
          enterView(w.text);
        }
        return;
      }
      // Plain ground: release any hold, then hide over links and buttons.
      if (magnetic) leaveMagnetic();
      if (viewLabel) leaveView();
      const link = (e.target as HTMLElement | null)?.closest?.("a, button");
      ball.classList.toggle("is-hidden", !!link);
    };

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || a.getAttribute("href")?.startsWith("#")) return;
      ball.classList.add("is-clicked");
      window.setTimeout(() => ball.classList.remove("is-clicked"), 300);
    };

    const onLeaveDocument = () => cursor.classList.remove("is-on");
    const onEnterDocument = () => show();

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("click", onClick);
    document.documentElement.addEventListener("mouseleave", onLeaveDocument);
    document.documentElement.addEventListener("mouseenter", onEnterDocument);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("click", onClick);
      document.documentElement.removeEventListener("mouseleave", onLeaveDocument);
      document.documentElement.removeEventListener("mouseenter", onEnterDocument);
      if (magnetic) magnetic.style.transform = "";
      if (magnetic) magnetic.style.transition = "";
    };
  }, []);

  if (enabled === false) return null;

  return (
    <div id="magic-cursor" ref={cursorRef} aria-hidden="true">
      <div id="ball" ref={ballRef}>
        <span className="ball-view" ref={labelRef} />
      </div>
    </div>
  );
}
