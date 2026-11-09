"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

/**
 * The process — «قدم به قدم» — the studio's four steps, as the reference
 * template's “My Process” section, measured against the live demo rather than
 * remembered from it:
 *
 *   · The cards are pinned, not merely stacked. The reference pins its
 *     section with GSAP ScrollTrigger (`start: 'top top'`, the next card
 *     starting at `yPercent: 100` — exactly at the viewport's bottom edge);
 *     this site carries no GSAP, so the stack is `position: sticky` with a
 *     gap of a full viewport minus one card between the items. The next card
 *     therefore starts below the fold and travels the whole viewport up over
 *     the one before it, exactly as the reference's does.
 *   · The covered card settles in three dimensions: it tips back
 *     (`rotateX`) and shrinks toward 0.9 while the next one rises, and the
 *     rising card flattens out of a slight forward tilt as it arrives — the
 *     same 0.9 the reference animates to, with the depth the flat scale
 *     leaves out.
 *   · The title fills with the scroll. The reference splits its heading into
 *     characters and scrubs them from opacity 0.4 to 1 as the heading travels
 *     from 80% to 20% of the viewport. Persian letters join, so a character
 *     split would break the script — instead the whole title is one gradient
 *     that sweeps from the inline start (right, here) to full ink over the
 *     same scroll window.
 *   · After the last card, the numbers. The reference follows its cards with
 *     a row of counting stats; this one repeats the numbers the About section
 *     already publishes (founded 1401, 30+ projects) beside the size of the
 *     sample library (8), counted up by the site's own `[data-count]` system.
 *
 * The copy is the studio's own: the step order and the vocabulary come from
 * the site itself — the samples catalogue (“پنل‌های نمونه برای دیدن رنگ، بافت
 * و پرداخت در نور محل پروژه؛ پیش از آنکه تصمیم نهایی گرفته شود”), the tools
 * catalogue (“لایه کشیده، فشرده و در نهایت یکدست می‌شود”) and the magazine's
 * account of where microcement is applied. The photographs are the repo's own
 * unused `www/` pool — finished microcement surfaces, each captioned for what
 * it shows rather than for a project it does not depict.
 */
type ProcessStep = {
  num: string;
  title: string;
  /** The step's short focus, printed bold before its purpose. */
  focus: string;
  /** What the step is for. */
  label: string;
  desc: string;
  img: string;
  alt: string;
};

const STEPS: ProcessStep[] = [
  {
    num: "۰۱",
    title: "شناخت فضا",
    focus: "گفت‌وگو",
    label: "فضا، نور و کاربری",
    desc: "کار از شناخت فضا شروع می‌شود: نور، تناسبات و کاربری آن، و آنچه ساکنانش از آن می‌خواهند. پیش از هر تصمیمی درباره‌ی رنگ و بافت، فضا را می‌بینیم و می‌شنویم.",
    img: "/images/www/surface-floor-03.jpg",
    alt: "فضای نشیمن با کف میکروسمنت، پنجره‌های بزرگ و شومینه",
  },
  {
    num: "۰۲",
    title: "نمونه و انتخاب",
    focus: "نمونه",
    label: "رنگ، بافت و پرداخت",
    desc: "از میان نمونه‌های استودیو، رنگ و بافت و میزان صافی سطح را روی نمونه‌های واقعی می‌بینید و انتخاب می‌کنید؛ پیش از اجرا، تصمیم نهایی در نور همان محل گرفته می‌شود.",
    img: "/images/www/finish-sand.jpg",
    alt: "دیوار میکروسمنت شنی با رد ماله",
  },
  {
    num: "۰۳",
    title: "آماده‌سازی و اجرا",
    focus: "اجرا",
    label: "لایه‌به‌لایه، با دست",
    desc: "سطح آماده می‌شود و میکروسمنت لایه‌به‌لایه با ماله کشیده و فشرده می‌شود تا یکدست شود؛ هر لایه پیش از لایه‌ی بعد می‌نشیند و پرداخت می‌شود.",
    img: "/images/www/detail-01.jpg",
    alt: "نمای نزدیک از رد ماله روی سطح میکروسمنت",
  },
  {
    num: "۰۴",
    title: "پایان و نگهداری",
    focus: "تحویل",
    label: "سیلر و مراقبت",
    desc: "پس از پایان اجرا، سطح با سیلر مناسب مهر و موم می‌شود و شیوه‌ی نگهداری آن را با شما در میان می‌گذاریم؛ تا سطح، با گذر زمان و استفاده‌ی روزمره، همان بماند که تحویل گرفته‌اید.",
    img: "/images/www/microcement-wet-area .jpg",
    alt: "حمام با دیوار و کف میکروسمنت خاکستری",
  },
];

/** The numbers after the last card — the site's own published figures. */
const STATS = [
  { value: "1401", from: "1395", suffix: "", label: "سال تأسیس" },
  { value: "30", from: undefined, suffix: "+", label: "پروژه‌های اجراشده" },
  { value: "8", from: undefined, suffix: "", label: "نمونه‌ی رنگ و بافت" },
];

/** Persian digits for the counters' starting text, matching the animation. */
const toFa = (value: string) =>
  value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/**
 * The sticky line the cards settle on. The reference pins at the viewport's
 * very top (`start: 'top top'`), so this is 0 — the card's top edge meets the
 * top of the screen.
 */
const STICK_TOP = 0;

export default function Process() {
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
      stack.querySelectorAll<HTMLElement>(".process-item")
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
      id="process"
      className="process"
      dir="rtl"
      aria-labelledby="process-title"
    >
      <div className="process-head">
        <div>
          <span className="eyebrow-roll" data-reveal="fade-up">
            <span className="eyebrow-roll-text" aria-hidden="true">
              <span className="text-1">قدم به قدم</span>
              <span className="text-2">قدم به قدم</span>
            </span>
            <span className="eyebrow-roll-arrow" aria-hidden="true">
              <svg viewBox="0 0 11 11" fill="none">
                <path
                  d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z"
                  fill="currentColor"
                />
              </svg>
              <svg viewBox="0 0 11 11" fill="none">
                <path
                  d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="sr-only">قدم به قدم</span>
          </span>
          <h2 id="process-title" className="process-title" ref={titleRef}>
            روند اجرای میکروسمنت
          </h2>
        </div>
        <p className="process-lede" data-reveal="fade-up" data-delay="120">
          از نخستین گفت‌وگو تا تحویل نهایی، هر گام اجرای میکروسمنت را با هم و با نمونه‌های
          واقعی جلو می‌بریم.
        </p>
      </div>

      <div className="process-stack" ref={stackRef}>
        {STEPS.map((step, i) => (
          <article
            key={step.num}
            className="process-item"
            style={{ zIndex: i + 1 } as CSSProperties}
            aria-label={`گام ${step.num}: ${step.title}`}
          >
            <div className="process-card" data-reveal="fade-up">
              <div className="process-media">
                <Image
                  src={step.img}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 680px) 100vw, 34vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="process-content">
                <header className="process-header">
                  <h3 className="process-card-title">
                    {step.num}. {step.title}
                  </h3>
                  <div className="process-meta">
                    <span className="process-meta-text">
                      {step.focus}{" "}
                      <span className="process-meta-label">{step.label}</span>
                    </span>
                    <span className="process-plus" aria-hidden="true">
                      +
                    </span>
                  </div>
                </header>
                <p className="process-desc">{step.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="process-stats">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="process-stat"
            data-reveal="fade-up"
            data-delay={i ? String(i * 120) : undefined}
          >
            <span
              className="process-stat-num"
              data-count={stat.value}
              data-from={stat.from}
              data-suffix={stat.suffix || undefined}
            >
              {toFa(stat.from ?? "0")}
            </span>
            <span className="process-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
