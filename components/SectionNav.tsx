"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The section navigator — the home page's own index, on the right edge.
 *
 * It reads the way a phonebook's side index does: at rest it is a single
 * circle (with a thin ring that fills as the page is read), and when a finger
 * lands on it, it opens into a vertical track of one dot per home section.
 * Dragging up and down the track glides the page to the section under the
 * finger, and the section's name rides beside the track — only while the
 * widget is open, so the page itself stays unlabelled. Releasing the track
 * folds it back into the circle.
 *
 * The dots follow the page even when the widget is closed (a scroll spy), so
 * opening it always lands on the section the reader is already in. The names
 * are the header's own labels, so the two menus can never disagree.
 *
 * Interaction notes: a tap on the circle opens it and it stays open until a
 * section is picked, the page is scrolled, or five quiet seconds pass; a
 * press-and-drag on the track jumps as the finger moves; a tap on a dot jumps
 * straight there. Mouse and touch are driven by the pointer handlers; the
 * button's click only serves keyboard activation (a keyboard click has
 * `detail === 0`), so the two never double-toggle.
 */
const SECTIONS = [
  { id: "top", label: "خانه" },
  { id: "process", label: "روند کار" },
  { id: "applications", label: "کاربردها" },
  { id: "about", label: "درباره ما" },
  { id: "work", label: "پروژه‌ها" },
  { id: "products", label: "محصولات" },
  { id: "materials", label: "نمونه‌ها" },
  { id: "journal", label: "مجله" },
  { id: "craft", label: "استادکار" },
  { id: "academy", label: "آموزش میکروسمنت" },
  { id: "contact", label: "تماس با ما" },
  { id: "instagram", label: "اینستاگرام" },
] as const;

/** The ring's geometry: r=22 in a 48px button. */
const RING_C = 2 * Math.PI * 22;

/** A press that moves less than this is a tap, not a drag. */
const TAP_SLOP = 6;

export default function SectionNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeRef = useRef(0);
  const draggingRef = useRef(false);
  const pressRef = useRef<{
    y: number;
    wasOpen: boolean;
    moved: boolean;
    onBtn: boolean;
  } | null>(null);
  /** When the widget last opened: a tap's compatibility click lands a beat
      after the press, by which time the track has grown and a dot may sit
      under the finger — clicks that close to the opening are that echo, not
      a choice, and are ignored. */
  const openedAtRef = useRef(0);
  const collapseTimer = useRef<number | null>(null);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const clearCollapse = useCallback(() => {
    if (collapseTimer.current !== null) {
      window.clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
  }, []);

  const scheduleCollapse = useCallback(
    (ms: number) => {
      clearCollapse();
      collapseTimer.current = window.setTimeout(() => setOpen(false), ms);
    },
    [clearCollapse],
  );

  const applyActive = useCallback((index: number) => {
    if (activeRef.current === index) return;
    activeRef.current = index;
    setActive(index);
  }, []);

  const scrollTo = useCallback((index: number) => {
    const el = document.getElementById(SECTIONS[index].id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduceMotionRef.current ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  const jumpTo = useCallback(
    (index: number) => {
      applyActive(index);
      scrollTo(index);
    },
    [applyActive, scrollTo],
  );

  const indexFromY = useCallback((clientY: number) => {
    const first = dotRefs.current[0]?.getBoundingClientRect();
    const last = dotRefs.current[SECTIONS.length - 1]?.getBoundingClientRect();
    if (!first || !last) return 0;
    const top = first.top + first.height / 2;
    const bottom = last.top + last.height / 2;
    if (bottom <= top) return 0;
    const f = (clientY - top) / (bottom - top);
    return Math.min(
      SECTIONS.length - 1,
      Math.max(0, Math.round(f * (SECTIONS.length - 1))),
    );
  }, []);

  const jumpToY = useCallback(
    (clientY: number) => {
      jumpTo(indexFromY(clientY));
    },
    [indexFromY, jumpTo],
  );

  /* Scroll spy: the active dot follows the page, and the ring fills with the
     read. While a drag is in flight the finger owns the active dot, not the
     scroll position, so the label never flickers mid-glide. */
  useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(RING_C * (1 - p));
      }
      if (draggingRef.current) return;
      const mid = window.scrollY + window.innerHeight * 0.35;
      let current = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= mid) {
          current = i;
        }
      }
      applyActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [applyActive]);

  /* A native scroll gesture anywhere else on the page folds the widget away;
     its own smooth scrolls never fire these events, so it cannot fold itself. */
  useEffect(() => {
    const onPageGesture = (event: Event) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      if (draggingRef.current) return;
      scheduleCollapse(350);
    };
    window.addEventListener("wheel", onPageGesture, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchstart", onPageGesture, {
      passive: true,
      capture: true,
    });
    return () => {
      window.removeEventListener("wheel", onPageGesture, { capture: true });
      window.removeEventListener("touchstart", onPageGesture, {
        capture: true,
      });
      clearCollapse();
    };
  }, [scheduleCollapse, clearCollapse]);

  useEffect(() => {
    if (open) openedAtRef.current = Date.now();
  }, [open ]);

  /* The name rides the active dot: measure the dot against the widget and
     park the label on its centre line. The pill's height animates as it
     opens, so a ResizeObserver re-parks the label while the dots spread —
     measuring once, when `open` flips, would leave it parked on a dot that
     has since moved. */
  const placeLabel = useCallback(() => {
    const dot = dotRefs.current[activeRef.current];
    const nav = rootRef.current;
    const label = labelRef.current;
    if (!dot || !nav || !label) return;
    const d = dot.getBoundingClientRect();
    const n = nav.getBoundingClientRect();
    label.style.top = `${d.top + d.height / 2 - n.top}px`;
  }, []);

  useEffect(() => {
    placeLabel();
    const pill = rootRef.current?.querySelector(".secnav-pill");
    if (!pill) return;
    const ro = new ResizeObserver(placeLabel);
    ro.observe(pill);
    return () => ro.disconnect();
  }, [active, open, placeLabel]);

  const onPointerDown = (event: React.PointerEvent) => {
    clearCollapse();
    const wasOpen = open;
    const onBtn =
      (event.target as HTMLElement).closest(".secnav-btn") !== null;
    if (!wasOpen) setOpen(true);
    draggingRef.current = true;
    pressRef.current = {
      y: event.clientY,
      wasOpen,
      moved: false,
      onBtn,
    };
    rootRef.current?.setPointerCapture(event.pointerId);
    /* A press on the open track jumps at once — but never a press on the
       circle itself, which only opens. A press on the closed circle only
       opens: the track is still growing, so its dots have no position worth
       jumping to yet. */
    if (wasOpen && !onBtn) jumpToY(event.clientY);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!draggingRef.current || !pressRef.current) return;
    if (Math.abs(event.clientY - pressRef.current.y) > TAP_SLOP) {
      pressRef.current.moved = true;
    }
    if (pressRef.current.moved) jumpToY(event.clientY);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const press = pressRef.current;
    pressRef.current = null;
    /* A tap that opened the circle leaves the widget open (it folds after
       five quiet seconds, or the moment the page is scrolled). Every other
       release — a drag, a tap on a dot — folds it after a beat, so the name
       has time to land. */
    if (press && !press.moved && press.onBtn && !press.wasOpen) {
      scheduleCollapse(5000);
    } else {
      scheduleCollapse(700);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.min(
        SECTIONS.length - 1,
        Math.max(0, active + (event.key === "ArrowDown" ? 1 : -1)),
      );
      jumpTo(next);
    }
  };

  return (
    <nav
      className="secnav"
      data-open={open ? "true" : "false"}
      dir="rtl"
      aria-label="پیمایش بخش‌های صفحه"
      ref={rootRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={(event) => {
        /* Mouse only: a touch press drives the widget through the pointer
           handlers, and a tap's compatibility mouse events must not reopen
           or refold it. */
        if (event.pointerType !== "mouse") return;
        clearCollapse();
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        if (!draggingRef.current) scheduleCollapse(400);
      }}
      onKeyDown={onKeyDown}
    >
      <div className="secnav-pill">
        <button
          type="button"
          className="secnav-btn"
          aria-expanded={open}
          aria-label="پیمایش بخش‌ها"
          tabIndex={open ? -1 : 0}
          onClick={(event) => {
            /* Keyboard activation only — a real click has detail >= 1 and is
               already handled by the pointer handlers above. */
            if (event.detail === 0) {
              clearCollapse();
              setOpen((prev) => !prev);
            }
          }}
        >
          <svg
            className="secnav-ring"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="22" className="secnav-ring-track" />
            <circle
              cx="24"
              cy="24"
              r="22"
              className="secnav-ring-fill"
              ref={ringRef}
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C}
            />
          </svg>
          <svg
            className="secnav-glyph"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <circle cx="19" cy="6" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="19" cy="18" r="1.5" fill="currentColor" stroke="none" />
            <path d="M4 6h11" />
            <path d="M4 12h11" />
            <path d="M4 18h11" />
          </svg>
        </button>

        <ul className="secnav-track">
          {SECTIONS.map((section, index) => (
            <li key={section.id}>
              <button
                type="button"
                className="secnav-dot"
                data-active={active === index ? "true" : "false"}
                aria-label={section.label}
                aria-current={active === index ? "true" : undefined}
                tabIndex={open ? 0 : -1}
                ref={(el) => {
                  dotRefs.current[index] = el;
                }}
                onClick={() => {
                  /* A tap's compatibility click can land on a dot the track
                     grew under the finger — ignore clicks that close to the
                     opening; a real press already jumped on pointerdown. */
                  if (Date.now() - openedAtRef.current < 350) return;
                  jumpTo(index);
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      <span className="secnav-label" aria-hidden={!open} ref={labelRef}>
        {SECTIONS[active].label}
      </span>
    </nav>
  );
}
