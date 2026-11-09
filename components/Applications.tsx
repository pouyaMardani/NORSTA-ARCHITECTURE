"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

import { PROJECT_IMAGES } from "@/content/projects";

/**
 * The applications — where microcement goes — as the reference template's
 * stacked cards, the same "My Process" motion the Process section used to
 * carry, measured against the live demo rather than remembered from it:
 *
 *   · The cards are pinned, not merely stacked. The reference pins its
 *     section with GSAP ScrollTrigger (`start: 'top top'`, the next card
 *     starting at `yPercent: 100` — exactly at the viewport's bottom edge);
 *     this site carries no GSAP, so the stack is `position: sticky` with a
 *     small gap between the items. The next card therefore starts below the
 *     fold and travels the whole viewport up over the one before it, exactly
 *     as the reference's does.
 *   · Each box is full height (`min-height: 100svh`), so the stack reads as
 *     a deck of full screens rather than a run of short cards.
 *   · The motion is a halo's glide, not a snap: the covered card settles
 *     with half the old tilt and half the old shrink, and a warm, soft glow
 *     gathers around each card as it arrives (`--arrive` drives the glow's
 *     opacity), so the card settles into light rather than into shadow.
 *   · The title fills with the scroll. Persian letters join, so a character
 *     split would break the script — instead the whole title is one gradient
 *     that sweeps from the inline start (right, here) to full ink over the
 *     same scroll window the Process title used to use.
 *
 * The copy is the studio's own: five places a visitor can picture microcement
 * living — cafés and restaurants, private homes and villas, bathrooms,
 * shops and complexes, kitchens — each with the surfaces it covers and a few
 * lines on why the material belongs there. The photographs are the repo's own
 * stills, each captioned for what it shows rather than for a project it does
 * not depict.
 */
type Application = {
  num: string;
  title: string;
  /** The surfaces microcement covers in this kind of space. */
  tag: string;
  /** Why the material belongs here, in a few lines. */
  desc: string;
  img: string;
  alt: string;
};

const AREAS: Application[] = [
  {
    num: "۰۱",
    title: "کافه‌ها و رستوران‌ها",
    tag: "پیشخوان، کف و دیوار",
    desc: "سطحی یکپارچه که نه درز دارد نه بند؛ روی پیشخوان و کف و دیوار می‌نشیند و با رفت‌وآمد و شست‌وشوی هر روزه کنار می‌آید. گرما و لکه را می‌پذیرد و همان می‌ماند که بود.",
    img: PROJECT_IMAGES.teaPavilion.src,
    alt: PROJECT_IMAGES.teaPavilion.alt,
  },
  {
    num: "۰۲",
    title: "خانه‌های شخصی و ویلاها",
    tag: "کف، دیوار و پله",
    desc: "از کف نشیمن تا دیوار حمام، یک سطح پیوسته که خانه را آرام و یکدست می‌کند؛ بی‌درز، بی‌صدا، و هم‌نشین چوب و سنگ و نور.",
    img: PROJECT_IMAGES.villa.src,
    alt: PROJECT_IMAGES.villa.alt,
  },
  {
    num: "۰۳",
    title: "سرویس‌های بهداشتی",
    tag: "دیوار، کف و دوش",
    desc: "جایی که آب هر روز می‌نشیند، میکروسمنت با سیلر مناسب یک سطح یکپارچه می‌سازد؛ بدون بند کاشی، بدون جایی برای نشستن رطوبت.",
    img: PROJECT_IMAGES.wetArea.src,
    alt: PROJECT_IMAGES.wetArea.alt,
  },
  {
    num: "۰۴",
    title: "فروشگاه‌ها و مجتمع‌ها",
    tag: "کف، ویترین و راهرو",
    desc: "فضاهای پررفت‌وآمد که سطحشان باید هم زیبا بماند و هم دوام بیاورد؛ میکروسمنت روی کف و دیوار، یکدست و مقاوم، با کمترین توقف برای اجرا.",
    img: PROJECT_IMAGES.livingRoom.src,
    alt: PROJECT_IMAGES.livingRoom.alt,
  },
  {
    num: "۰۵",
    title: "آشپزخانه‌ها",
    tag: "جزیره، پیشخوان و دیوار",
    desc: "سطح کار آشپزخانه که هر روز با آب و حرارت و لکه سروکار دارد؛ میکروسمنت روی جزیره و پیشخوان و دیوار یکدست می‌نشیند و تمیز کردنش یک دستمال است.",
    img: PROJECT_IMAGES.kitchen.src,
    alt: PROJECT_IMAGES.kitchen.alt,
  },
];

/**
 * The sticky line the cards settle on. The reference pins at the viewport's
 * very top (`start: 'top top'`), so this is 0 — the card's top edge meets the
 * top of the screen.
 */
const STICK_TOP = 0;

export default function Applications() {
  const stackRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const stack = stackRef.current;
    const title = titleRef.current;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Full ink, flat cards, no pin: the section reads as plain content.
      title?.style.setProperty("--fill", "100%");
      return;
    }
    if (!stack) return;

    const items = Array.from(
      stack.querySelectorAll<HTMLElement>(".app-item")
    );
    let raf = 0;

    const sync = () => {
      raf = 0;
      const vh = window.innerHeight;
      // The pitch — one card plus the gap after it — is the travel each card
      // makes: measured, so the progress spans the whole journey from below
      // the fold to the sticky line, not just the last card-height of it.
      // Measured from the card's layout height plus the stack's computed gap:
      // `offsetTop` is no good here, because Chrome reports a stuck sticky
      // element's offsetTop at its stuck position, so the pitch would collapse
      // to nothing exactly as the first card settles.
      const gapPx = parseFloat(getComputedStyle(stack).rowGap || "0") || 0;
      const step = (items[0]?.offsetHeight ?? vh) + gapPx;
      items.forEach((item, i) => {
        const next = items[i + 1];
        const top = item.getBoundingClientRect().top;
        // How far the next card has travelled over this one: 0 while it is
        // still a full pitch below the sticky line, 1 once it has arrived.
        const cover = next
          ? Math.min(
              1,
              Math.max(
                0,
                (STICK_TOP + step - next.getBoundingClientRect().top) / step
              )
            )
          : 0;
        // How far this card itself has arrived at the line. The first card
        // is already there when the stack begins; the others flatten out of
        // their forward tilt as they arrive.
        const arrive =
          i === 0
            ? 1
            : Math.min(
                1,
                Math.max(0, (STICK_TOP + step - top) / step)
              );
        item.style.setProperty("--cover", cover.toFixed(3));
        item.style.setProperty("--arrive", arrive.toFixed(3));
      });

      // The title fills as its top travels from 80% to 20% of the viewport —
      // the reference's scrub window, measured the same way.
      if (title) {
        const top = title.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, (vh * 0.8 - top) / (vh * 0.6)));
        title.style.setProperty("--fill", `${(p * 100).toFixed(1)}%`);
      }
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
      id="applications"
      className="applications"
      dir="rtl"
      aria-labelledby="applications-title"
    >
      <div className="app-head">
        <div>
          <span className="eyebrow" data-reveal="fade-up">
            کاربردهای میکروسمنت
          </span>
          <h2 id="applications-title" className="app-title" ref={titleRef}>
            میکروسمنت، همه‌جا
          </h2>
        </div>
        <p className="app-lede" data-reveal="fade-up" data-delay="120">
          سطحی یکپارچه و بی‌درز که در هر فضایی که آب، رفت‌وآمد و زندگی روزمره
          هست می‌نشیند — از کف آشپزخانه تا دیوار کافه.
        </p>
      </div>

      <div className="app-stack" ref={stackRef}>
        {AREAS.map((area, i) => (
          <article
            key={area.num}
            className="app-item"
            style={{ zIndex: i + 1 } as CSSProperties}
            aria-label={`${area.num}: ${area.title}`}
          >
            <div className="app-card" data-reveal="fade-up">
              <div className="app-media">
                <Image
                  src={area.img}
                  alt={area.alt}
                  fill
                  sizes="(max-width: 680px) 100vw, 42vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="app-content">
                <span className="app-num" aria-hidden="true">
                  {area.num}
                </span>
                <h3 className="app-card-title">{area.title}</h3>
                <p className="app-tag">{area.tag}</p>
                <p className="app-desc">{area.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
