"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Master craftsman — the portrait stage.
 *
 * The section that introduces the engineer behind Norsta's microcement and
 * patina work, rebuilt as a scroll-driven stage: a tall dark room
 * (`320svh`) with one sticky viewport inside it. Scrolling through the room
 * drives everything, and scrolling back reverses it — the motion is a
 * function of where the room sits in the viewport, never a one-way trigger.
 *
 *   · The portrait zooms IN as the room is entered and zooms OUT again as
 *     it is left (`--craft-zoom` is a sine over the room), drifting upward
 *     (`--craft-rise`) and tipping in three dimensions (`--craft-tilt`,
 *     read through the pin's perspective), while the photograph itself
 *     drifts inside its frame — a slow Ken Burns parallax.
 *   · A warm glow behind the plate brightens to its peak at the middle of
 *     the room (`--craft-glow`) and the ghost frame drifts the other way,
 *     so the plate, its frame and its light sit at three different depths.
 *   · The name rises out of its mask line by line (`--craft-name1`,
 *     `--craft-name2`), then the role, the biography, the three figures and
 *     the CTA arrive (`--craft-copy`, the figures flipping in one by one).
 *
 * The room is dark (`#100e0b`, the site's own dark ground) so the light and
 * the shadow Pouya asked for actually read: the warm portrait and the ivory
 * name sit in a pool of light.
 *
 * ── CONTENT ────────────────────────────────────────────────────────────────
 * The name, the role and the biography are the owner's own facts: the
 * engineer who leads Norsta's microcement and patina work is مهندس افسانه
 * مردانی, and the studio's work in the material runs from ۱۴۰۱. The three
 * figures under the biography are the site's own published numbers (founded
 * ۱۴۰۱, ۳۰+ projects, ۸ finishes), so nothing here is a guess. The marquee
 * repeats only those two facts — her name and the material — so it invents
 * nothing.
 *
 * ── IMAGE ──────────────────────────────────────────────────────────────────
 * `CRAFTSMAN.image` is her portrait — مهندس افسانه مردانی outdoors, beside
 * the olive tree — so the alt text names her, and the plate is captioned as
 * her portrait rather than as a material detail. The photograph is cropped
 * by `object-fit:cover` inside a fixed `4/5` plate, so a different source
 * image lands in exactly the same silhouette.
 *
 * ── WITHOUT SCRIPTING ──────────────────────────────────────────────────────
 * The custom properties default to their settled values in the stylesheet
 * (full size, name and copy in, a steady glow), so the room reads as plain
 * content when the scroll sync never runs. Below `960px` the room stops
 * being a pinned stage and becomes a full-bleed portrait cover — the
 * photograph fills the viewport, the name sits over its lower edge on a
 * gradient, and the rest of the copy follows on the dark ground — and the
 * same scroll sync still drives a gentle zoom and the reveals, because the
 * progress is measured from the room's own rectangle, not from the pin.
 */

type CraftsmanContent = {
  /** Her professional title, as the owner states it. */
  title: string;
  /** One short paragraph: who she is and how she works. */
  bio: string;
  /** The site's own published numbers, so the section never guesses. */
  metrics: { value: string; label: string }[];
  image: { src: string; alt: string };
  /** Latin micro-label for the plate, set in the same face as the wordmarks. */
  label: string;
  /** Latin material tags under the plate. Decorative — they mirror the heading. */
  tags: string[];
};

const CRAFTSMAN: CraftsmanContent = {
  /** Her role: the engineer who runs Norsta's microcement and patina work. */
  title: "مجری میکروسمنت و پتینه‌ی نورستا",
  /** The introduction, in her own section's voice: the work, and how she
      follows it from the first sample to the last coat. */
  bio: "از سال ۱۴۰۱ اجرای سطح‌های یکپارچه‌ی نورستا را رهبری می‌کند. هر پروژه از نمونه تا تحویل با همراهی مستقیم او پیش می‌رود؛ از انتخاب رنگ و بافت در نور همان فضا تا آخرین لایه‌ی ماله و سیلر.",
  metrics: [
    { value: "۱۴۰۱", label: "آغاز به کار" },
    { value: "۳۰+", label: "پروژه‌ی اجراشده" },
    { value: "۸", label: "نمونه‌ی رنگ و بافت" },
  ],
  image: {
    /** Her portrait, outdoors beside the olive tree. */
    src: "/images/craft.png",
    alt: "پرتره‌ی مهندس افسانه مردانی",
  },
  label: "CRAFT & MATERIAL",
  tags: ["MICROCEMENT", "PATINA"],
};

export default function Craftsman() {
  const stageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const setSettled = () => {
      stage.style.setProperty("--craft-zoom", "1");
      stage.style.setProperty("--craft-rise", "0px");
      stage.style.setProperty("--craft-tilt", "0deg");
      stage.style.setProperty("--craft-glow", "0.7");
      stage.style.setProperty("--craft-name1", "1");
      stage.style.setProperty("--craft-name2", "1");
      stage.style.setProperty("--craft-copy", "1");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Full size, name and copy in, a steady glow: the room reads as plain
      // content, and the stylesheet's reduced-motion block un-pins it.
      setSettled();
      return;
    }

    let raf = 0;
    const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

    const sync = () => {
      raf = 0;
      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the room's top reaches the viewport's top, 1 when its bottom
      // reaches the viewport's bottom — the whole scroll through the room.
      const travel = Math.max(1, rect.height - vh);
      const p = clamp01(-rect.top / travel);

      // Zoom: in from far, out again — a sine over the room, so scrolling
      // back reverses it exactly. Kept to a 1.08 peak. On a phone the
      // portrait is full-bleed, so the zoom never drops below 1 there: a
      // 0.84 would pull the photograph in from the viewport's edges and
      // break the cover.
      const isMobile = window.innerWidth <= 960;
      const zoom = isMobile
        ? 1 + 0.08 * Math.sin(p * Math.PI)
        : 0.84 + 0.24 * Math.sin(p * Math.PI);
      // The portrait drifts upward through the room.
      const rise = (0.5 - p) * 80;
      // Tipped back on entry, flat at the middle, forward on exit.
      const tilt = (0.5 - p) * 14;
      // The glow is brightest at the middle.
      const glow = Math.sin(p * Math.PI);
      // The name: line one over p 0–0.35, line two over p 0.12–0.47. On a
      // phone the name sits on the photograph as a cover headline, so it gets
      // a head start — it is already half-risen when the section arrives,
      // instead of invisible until the room is a third scrolled.
      const name1 = isMobile
        ? clamp01((p + 0.2) / 0.35)
        : clamp01(p / 0.35);
      const name2 = isMobile
        ? clamp01((p + 0.08) / 0.35)
        : clamp01((p - 0.12) / 0.35);
      // Role, biography, figures and CTA over p 0.25–0.6, so the room's
      // middle already holds the name and most of the copy.
      const copy = clamp01((p - 0.25) / 0.35);

      stage.style.setProperty("--craft-p", p.toFixed(3));
      stage.style.setProperty("--craft-zoom", zoom.toFixed(3));
      stage.style.setProperty("--craft-rise", `${rise.toFixed(1)}px`);
      stage.style.setProperty("--craft-tilt", `${tilt.toFixed(2)}deg`);
      stage.style.setProperty("--craft-glow", glow.toFixed(3));
      stage.style.setProperty("--craft-name1", name1.toFixed(3));
      stage.style.setProperty("--craft-name2", name2.toFixed(3));
      stage.style.setProperty("--craft-copy", copy.toFixed(3));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="craft" className="craft" ref={stageRef}>
      <div className="craft-pin">
        <div className="craft-visual">
          <div className="craft-glow" aria-hidden="true" />
          <div className="craft-plate">
            <span className="craft-frame" aria-hidden="true" />

            <div className="craft-figure">
              <Image
                src={CRAFTSMAN.image.src}
                alt={CRAFTSMAN.image.alt}
                fill
                sizes="(max-width: 960px) 100vw, 41vw"
                priority
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Straddles the plate's lower edge, so it reads as a mounted label
                rather than as a caption sitting inside the photograph. */}
            <span className="craft-badge">
              <i aria-hidden="true" />
              {CRAFTSMAN.label}
            </span>
          </div>

          {/* Material tags repeat the heading in Latin, so they stay decorative. */}
          <p className="craft-tags" aria-hidden="true">
            {CRAFTSMAN.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
        </div>

        <div className="craft-copy">
          <span className="eyebrow">استادکار</span>

          <h2 className="mask-title">
            <span className="line">
              <span className="craft-name-line craft-name-line--1">
                مهندس افسانه
              </span>
            </span>
            <span className="line">
              <span className="craft-name-line craft-name-line--2">
                مردانی
              </span>
            </span>
          </h2>

          <p className="craft-role">{CRAFTSMAN.title}</p>
          <p className="craft-bio">{CRAFTSMAN.bio}</p>

          <div className="metrics">
            {CRAFTSMAN.metrics.map((metric, index) => (
              <div
                key={metric.label}
                className="craft-metric"
                style={{ "--i": index } as CSSProperties}
              >
                <span className="num">{metric.value}</span>
                <span className="label">{metric.label}</span>
              </div>
            ))}
          </div>

          <a className="link-underline strong" href="#contact">
            گفت‌وگو درباره‌ی اجرا &nbsp;←
          </a>
        </div>
      </div>
    </section>
  );
}
