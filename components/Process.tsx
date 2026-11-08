"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

/**
 * The process — «قدم به قدم» — the studio's four steps, as the reference
 * template's “My Process” section: a pinned stack of cards, each one sliding
 * up over the last while the covered card shrinks a little.
 *
 * The reference does the pin with GSAP ScrollTrigger; this site carries no
 * GSAP, so the stack is `position: sticky` instead — each card sticks at the
 * top of the viewport and the next one scrolls up over it — with a small
 * scroll listener that shrinks a card in proportion to how far the next one
 * has covered it, which is the same 0.9 settle the reference animates to.
 * Without JavaScript the cards still stack (sticky is CSS); without motion
 * they flow one after another, unpinned.
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

/** How far a covered card shrinks — the reference settles at 0.9. */
const COVER_SCALE = 0.9;
/** The sticky line the cards settle on, in pixels from the viewport top. */
const STICK_TOP = 24;

export default function Process() {
  const stackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (
      !stack ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const items = Array.from(
      stack.querySelectorAll<HTMLElement>(".process-item")
    );
    let raf = 0;

    const sync = () => {
      raf = 0;
      items.forEach((item, i) => {
        const next = items[i + 1];
        if (!next) {
          item.style.setProperty("--cover", "0");
          return;
        }
        // How far the next card has travelled over this one: 0 while it is
        // still a full card-height below the sticky line, 1 once it has
        // arrived on the line.
        const nextTop = next.getBoundingClientRect().top;
        const height = item.getBoundingClientRect().height;
        const p = Math.min(
          1,
          Math.max(0, (STICK_TOP + height - nextTop) / height)
        );
        item.style.setProperty("--cover", p.toFixed(3));
      });
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
          <h2
            id="process-title"
            className="process-title mask-title"
            data-reveal="mask-line"
          >
            <span className="line">
              <span>روند کار ما</span>
            </span>
          </h2>
        </div>
        <p className="process-lede" data-reveal="fade-up" data-delay="120">
          از نخستین گفت‌وگو تا تحویل نهایی، هر گام را با هم و با نمونه‌های
          واقعی جلو می‌بریم.
        </p>
      </div>

      <div className="process-stack" ref={stackRef}>
        {STEPS.map((step, i) => (
          <article
            key={step.num}
            className="process-item"
            style={{ zIndex: i + 1, "--cover-scale": COVER_SCALE } as CSSProperties}
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
    </section>
  );
}
