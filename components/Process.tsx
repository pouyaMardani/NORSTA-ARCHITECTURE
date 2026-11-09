"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * The process — «قدم به قدم» — the studio's four steps, as the reference
 * template's “Four systems. One spine.” section (TemplateMo 629, Nexus
 * System), measured against the live demo and its mirrors rather than
 * remembered from it:
 *
 *   · Four equal columns in a single horizontal row, not a vertical timeline.
 *     There is no literal spine line in the reference — the “spine” is the
 *     shared chassis the four systems plug into, and visually it is the row
 *     itself: four columns on one baseline, separated by hairlines.
 *   · Pointer-driven, not scroll-driven. Hover a column (desktop) or tap it
 *     (touch) and it turns: it grows to about two and a half times its
 *     neighbours' width, its description fades and slides in, and the other
 *     three dim and recede. Only one column is active at a time; leaving the
 *     row keeps the last one active, so the section never sits empty.
 *   · The motion is the buttery part: a single ~600 ms ease
 *     (`cubic-bezier(0.22, 1, 0.36, 1)`) on the column's growth, its dimming
 *     and its description — no scroll scrub, no pin, no 3D tilt.
 *   · Mobile is a horizontal scroll-snap row (one column ~80vw, snap), the
 *     same tap-to-activate behaviour — the pattern the site's Recent Projects
 *     already uses — so nothing here is hover-only.
 *
 * The copy is the studio's own (unchanged from the stacked-cards version):
 * the step order and the vocabulary come from the site itself — the samples
 * catalogue, the tools catalogue and the magazine's account of where
 * microcement is applied. The photographs are the repo's own unused `www/`
 * pool — finished microcement surfaces, each captioned for what it shows
 * rather than for a project it does not depict. The numbers after the row
 * (founded ۱۴۰۱, ۳۰+ projects, ۸ finishes) are the site's own published
 * figures, counted up by the site's `[data-count]` system.
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

export default function Process() {
  /** The step whose description is open. The first step starts active, so
      the row never sits empty — and leaving the row keeps the last active. */
  const [active, setActive] = useState(0);

  return (
    <section
      id="process"
      className="process"
      dir="rtl"
      aria-labelledby="process-title"
    >
      <div className="process-head">
        <div>
          <span className="eyebrow" data-reveal="fade-up">
            ۰۳ / قدم به قدم
          </span>
          <h2 id="process-title" className="process-title">
            روند اجرای میکروسمنت
          </h2>
        </div>
        <div className="process-head-side">
          <p className="process-lede" data-reveal="fade-up" data-delay="120">
            از نخستین گفت‌وگو تا تحویل نهایی، هر گام اجرای میکروسمنت را با هم و
            با نمونه‌های واقعی جلو می‌بریم.
          </p>
          <p className="process-hint" data-reveal="fade-up" data-delay="200">
            روی یک مرحله بایستید یا لمس کنید
          </p>
        </div>
      </div>

      <div className="process-row" role="group" aria-label="مراحل اجرای میکروسمنت">
        {STEPS.map((step, i) => {
          const isActive = i === active;
          return (
            <article
              key={step.num}
              className={`process-col${isActive ? " is-active" : ""}`}
              role="button"
              aria-label={`گام ${step.num}: ${step.title}`}
              aria-expanded={isActive}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActive(i);
                }
              }}
            >
              <div className="process-col-media">
                <Image
                  src={step.img}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 680px) 80vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="process-col-body">
                <span className="process-col-num" aria-hidden="true">
                  {step.num}
                </span>
                <h3 className="process-col-title">{step.title}</h3>
                <p className="process-col-meta">
                  <span className="process-col-focus">{step.focus}</span>
                  <span className="process-col-label">{step.label}</span>
                </p>
                <div className="process-col-desc-wrap" aria-hidden={!isActive}>
                  <p className="process-col-desc">{step.desc}</p>
                </div>
              </div>
            </article>
          );
        })}
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
