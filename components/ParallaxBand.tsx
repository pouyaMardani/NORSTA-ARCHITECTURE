"use client";

import { useEffect, useRef } from "react";

/**
 * The full-bleed band between About and Work — a photograph that stays put
 * while the page scrolls over it, as the reference template's Testimonials
 * section (Tooplate 2117, Infinite Loop) does, measured against its own CSS
 * and inline script rather than remembered from it:
 *
 *   · The mechanism is two things at once. `background-attachment: fixed`
 *     pins the photograph to the viewport, so the page's own content slides
 *     over it — the feeling the user described (“the photo is there, we
 *     scroll over it, and it stays”). On top of that, a scroll sync nudges
 *     `background-position-y` slowly (a fifth of the scroll, the reference's
 *     own 0.20 multiplier), so the fixed image still breathes instead of
 *     sitting dead still. The drift runs only above 768px; below that the
 *     position stays centred.
 *   · The old band was a sticky window (a tall section whose inner frame
 *     stuck at 100svh, so the next section slid over it like a curtain). That
 *     is a different effect — the photograph was the section's own content,
 *     pinned — and it is gone. This one is a background: the section's own
 *     words sit on top of it, and the photograph is the ground they stand on.
 *   · The photograph is the studio's own villa still, cut wide (2000×1125)
 *     at build time by `scripts/make-og-images.mjs` into
 *     `public/images/og/band.jpg` — a share plate is 1200×630, and a
 *     full-viewport background needs the width — so no new binary is ever
 *     committed. A thin warm veil sits over it (the reference's is a faint
 *     teal, `rgba(20,70,80,0.2)`; this one is the site's own dark ground at
 *     45%, so the ivory statement reads against a dusk photograph).
 *   · Mobile falls back the way the reference's does: iOS Safari ignores
 *     `background-attachment: fixed`, so below 768px the attachment is
 *     `scroll` and the drift is off — the band degrades to a normal
 *     full-bleed photograph, never a broken one.
 *
 * The words on the band are the site's own hero lede, reused as an
 * interlude — the surface shaped by silence, weight and the slow passage of
 * light — not a new claim and not a testimonial: the studio publishes no
 * testimonials, and this section invents none.
 */
export default function ParallaxBand() {
  const bandRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth <= 768
    ) {
      // Still image, centred: no drift without motion, and no drift on a
      // narrow screen, where the attachment itself is `scroll`.
      band.style.setProperty("--band-y", "0px");
      return;
    }

    let raf = 0;
    const sync = () => {
      raf = 0;
      // A fifth of the scroll, as the reference's multiplier has it: the
      // band's top travels a full viewport while its photograph drifts a
      // fifth of one, so the fixed image breathes instead of sitting still.
      const y = Math.round(0.2 * band.getBoundingClientRect().top);
      band.style.setProperty("--band-y", `${y}px`);
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
    <section
      className="pxband"
      ref={bandRef}
      dir="rtl"
      aria-label="میکروسمنت؛ سطحی یکپارچه"
    >
      <div className="pxband-veil" aria-hidden="true" />
      <div className="pxband-content">
        <span className="pxband-eyebrow" data-reveal="fade-up">
          نورستا
        </span>
        <p className="pxband-statement" data-reveal="fade-up" data-delay="120">
          میکروسمنت؛ سطحی یکپارچه که با سکوت، وزن و گذرِ آرام نور در فضا شکل
          می‌گیرد.
        </p>
      </div>
    </section>
  );
}
