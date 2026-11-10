"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import {
  formatProjectDate,
  formatProjectNumber,
  getProjectBySlug,
  toPersianDigits,
} from "@/content/projects";
import type { ProjectDTO } from "@/content/projects/types";

/**
 * The results — Framo's `ag2-results` ("Results, not reports.") section,
 * rebuilt for Norsta with the studio's own projects.
 *
 * The design is the reference's, exactly: the white section with the dot
 * grid, the two-column head (a light title with a lime marker band on the
 * strong line, a lead and a dark pill button), the pinned horizontal reel
 * of rounded case cards (photo with translucent tag pills, client row with
 * a white circular arrow, a huge figure beside a rising sparkline, a label
 * and two sub-stats), the lime "more" card, and the floating HUD (prev/next,
 * a lime progress rail and a 01 / 07 counter).
 *
 * The content is Norsta's, not the demo's: the reference's six case studies
 * are a fictional agency's (Ferncastle bedding, Corvessa SaaS, … with
 * ROAS and pipeline figures the studio never had), so the cards carry six
 * of the studio's own ten projects — their own photographs, names,
 * locations, years and descriptions — and the copy is Persian. The figure
 * on each card is the project's completion year, the one honest number a
 * project carries; the sub-stats are its location and its gallery size.
 *
 * The motion is the reference's too, rebuilt without GSAP: on desktop the
 * reel is a pinned scroll — a tall section with a sticky viewport, the
 * track translated as the page scrolls (scrubbed 1:1), the HUD counting
 * and filling in sync. Below 768px the pin is destroyed and the reel
 * becomes a native swipe row with scroll-snap, the HUD hidden. With
 * `prefers-reduced-motion` the pin is skipped entirely. The section is
 * RTL, so the track translates to the right (positive X) to reveal the
 * cards that sit to the left.
 */

type ResultCard = {
  project: ProjectDTO;
  /** Two surface tags over the photo. */
  tags: [string, string];
  /** The rising sparkline's polyline and its end dot. */
  spark: { points: string; cx: number; cy: number };
};

/** The six projects in the reel, in order — four categories, four cities. */
const CARD_DEFS: { slug: string; tags: [string, string] }[] = [
  { slug: "qeytarieh-villa", tags: ["تراس و نشیمن", "پلکان و کف"] },
  { slug: "foundry-offices", tags: ["کف و دیوار", "سطوح بتنی"] },
  { slug: "cultural-center", tags: ["نما و دیوار", "آستانه و بازشو"] },
  { slug: "tea-pavilion", tags: ["کف و دیوار", "بازشو و چوب"] },
  { slug: "saadatabad-bathroom", tags: ["حمام و دوش", "دیوار و کف"] },
  { slug: "zaferanieh-villa", tags: ["پلکان و حیاط", "تراس و باغ"] },
];

/** The reference's six rising sparklines, one per card. */
const SPARKS: { points: string; cx: number; cy: number }[] = [
  { points: "2,34 16,31 30,33 44,24 58,21 72,12 94,5", cx: 94, cy: 5 },
  { points: "2,35 16,33 30,27 44,28 58,18 72,15 94,4", cx: 94, cy: 4 },
  { points: "2,36 16,34 30,30 44,31 58,22 72,14 94,6", cx: 94, cy: 6 },
  { points: "2,30 16,31 30,29 44,30 58,17 72,15 94,9", cx: 94, cy: 9 },
  { points: "2,37 16,35 30,33 44,26 58,24 72,13 94,3", cx: 94, cy: 3 },
  { points: "2,33 16,30 30,31 44,22 58,23 72,14 94,8", cx: 94, cy: 8 },
];

const CARDS: ResultCard[] = CARD_DEFS.map((def, i) => {
  const project = getProjectBySlug(def.slug);
  if (!project) throw new Error(`results card project missing: ${def.slug}`);
  return { project, tags: def.tags, spark: SPARKS[i] };
});

/** The "more" card's client chips — the other projects, as a preview. */
const MORE_CLIENTS = [
  "خانه‌ی مینیمال",
  "آپارتمان جردن",
  "خانه‌ی تجریش",
  "آپارتمان تهرانپارس",
  "ویلای قیطریه",
  "حمام سعادت‌آباد",
];

const TOTAL_PANELS = CARDS.length + 1; // six cards + the "more" card
const PIN_MIN_WIDTH = 768;

function ArrowUpLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 7 7 17" />
      <path d="M7 17h9" />
      <path d="M7 17V8" />
    </svg>
  );
}

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M5 12l6-6" />
      <path d="M5 12l6 6" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M19 12l-6-6" />
      <path d="M19 12l-6 6" />
    </svg>
  );
}

function Sparkline({ spark }: { spark: ResultCard["spark"] }) {
  return (
    <svg
      className="results-spark"
      viewBox="0 0 96 40"
      aria-hidden="true"
    >
      <polyline points={spark.points} />
      <circle cx={spark.cx} cy={spark.cy} r="7" className="results-spark-halo" />
      <circle cx={spark.cx} cy={spark.cy} r="3.5" className="results-spark-dot" />
    </svg>
  );
}

export default function Results() {
  const reelRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const indexRef = useRef<HTMLSpanElement | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  // Cached on measure (resize), so the scroll handler never reads layout.
  const geomRef = useRef({ top: 0, height: 0, overflow: 0, active: false });

  useEffect(() => {
    const reel = reelRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!reel || !viewport || !track) return;

    const mq = window.matchMedia(`(min-width: ${PIN_MIN_WIDTH}px)`);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let raf = 0;

    const measure = () => {
      const active = mq.matches && !reduced;
      geomRef.current.active = active;
      // The HUD only shows while the pin is live.
      reel.classList.toggle("is-pinned", active);
      if (!active) {
        // No pin: a plain swipe row. Clear anything the pin set.
        reel.style.height = "";
        track.style.transform = "";
        return;
      }
      const overflow = Math.max(
        0,
        track.scrollWidth - viewport.clientWidth
      );
      geomRef.current.overflow = overflow;
      geomRef.current.top =
        reel.getBoundingClientRect().top + window.scrollY;
      geomRef.current.height = window.innerHeight + overflow;
      reel.style.height = `${geomRef.current.height}px`;
    };

    const sync = () => {
      raf = 0;
      const { active, top, height, overflow } = geomRef.current;
      if (!active) return;
      const vh = window.innerHeight;
      const p = Math.min(
        1,
        Math.max(0, (window.scrollY - top) / (height - vh))
      );
      // RTL: the track's first card sits at the right and the rest run to
      // the left, so the track moves right (positive X) as you scroll.
      track.style.transform = `translate3d(${(p * overflow).toFixed(1)}px, 0, 0)`;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
      }
      const idx = Math.min(TOTAL_PANELS, Math.floor(p * TOTAL_PANELS) + 1);
      if (indexRef.current) {
        indexRef.current.textContent = formatProjectNumber(idx - 1);
      }
      if (prevRef.current) prevRef.current.disabled = p <= 0.01;
      if (nextRef.current) nextRef.current.disabled = p >= 0.99;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(sync);
    };
    const onResize = () => {
      measure();
      sync();
    };

    measure();
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (panel: number) => {
    // `panel` is 0-based. Scroll the page to the scroll position that
    // puts that panel at the viewport's start edge.
    const { active, top, height } = geomRef.current;
    if (!active) return;
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, panel / (TOTAL_PANELS - 1)));
    window.scrollTo({ top: top + p * (height - vh), behavior: "smooth" });
  };

  const step = (dir: 1 | -1) => {
    const { active, top, height } = geomRef.current;
    if (!active) return;
    const vh = window.innerHeight;
    const p = Math.min(
      1,
      Math.max(0, (window.scrollY - top) / (height - vh))
    );
    const current = Math.min(
      TOTAL_PANELS - 1,
      Math.floor(p * TOTAL_PANELS)
    );
    goTo(Math.min(TOTAL_PANELS - 1, Math.max(0, current + dir)));
  };

  return (
    <section
      id="results"
      className="results"
      dir="rtl"
      aria-labelledby="results-title"
    >
      <span className="results-dots" aria-hidden="true" />

      <div className="results-head">
        <h2 id="results-title" className="results-title" data-reveal="fade-up">
          نتایج،{" "}
          <strong className="results-marker">نه گزارش‌ها.</strong>
        </h2>
        <div className="results-aside">
          <p className="results-lead" data-reveal="fade-up">
            هر عدد زیر به یک پروژه‌ی واقعی وصل است.
          </p>
          <div data-reveal="fade-up" data-delay="120">
            <Link href="/projects" className="results-btn">
              همه‌ی پروژه‌ها
              <span className="results-btn-chip">
                <ArrowUpLeft className="results-btn-arrow" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="results-reel" ref={reelRef}>
        <div className="results-viewport" ref={viewportRef}>
          <div className="results-track" ref={trackRef}>
            {CARDS.map(({ project, tags, spark }) => {
              const year = project.completedAt
                ? formatProjectDate(project.completedAt)
                : "";
              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="results-card"
                  aria-label={`${project.title} — ${project.location ?? ""}`}
                >
                  <div className="results-shot">
                      <Image
                        src={project.coverImage.src}
                        alt={project.coverImage.alt}
                        fill
                        sizes="(max-width: 768px) 84vw, 28rem"
                        style={{ objectFit: "cover" }}
                      />
                      <ul className="results-tags" role="list">
                        {tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="results-body">
                      <div className="results-client">
                        <div>
                          <h3>{project.title}</h3>
                          <span>{project.category}</span>
                        </div>
                        <span className="results-arrow" aria-hidden="true">
                          <ArrowUpLeft />
                        </span>
                      </div>
                      <div className="results-result">
                        <p className="results-figure">{year}</p>
                        <Sparkline spark={spark} />
                      </div>
                      <p className="results-label">{project.shortDescription}</p>
                      <dl className="results-subs">
                        <div>
                          <dt>موقعیت</dt>
                          <dd>{project.location ?? "—"}</dd>
                        </div>
                        <div>
                          <dt>گالری</dt>
                          <dd>
                            {toPersianDigits(project.galleryImages.length)} تصویر
                          </dd>
                        </div>
                      </dl>
                    </div>
                </Link>
              );
            })}

            <Link href="/projects" className="results-more">
              <span className="results-more-dots" aria-hidden="true" />
              <span className="results-more-eyebrow">کتابخانه‌ی پروژه‌ها</span>
              <span className="results-more-big">
                دیدن همه‌ی <strong>{toPersianDigits(10)}</strong> پروژه
              </span>
              <span className="results-more-clients">
                {MORE_CLIENTS.map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </span>
              <span className="results-more-foot">
                <span>ده پروژه، یک معیار.</span>
                <span
                  className="results-more-disc"
                  aria-hidden="true"
                >
                  <ArrowUpLeft />
                </span>
              </span>
            </Link>
          </div>

          <div className="results-hud">
            <button
              type="button"
              className="results-nav-btn"
              ref={prevRef}
              onClick={() => step(-1)}
              aria-label="پروژه‌ی قبلی"
            >
              <ArrowRight />
            </button>
            <button
              type="button"
              className="results-nav-btn"
              ref={nextRef}
              onClick={() => step(1)}
              aria-label="پروژه‌ی بعدی"
            >
              <ArrowLeft />
            </button>
            <div className="results-rail">
              <span ref={progressRef} />
            </div>
            <span className="results-counter">
              <span ref={indexRef}>{formatProjectNumber(0)}</span>
              <span className="results-counter-sep"> / </span>
              <span>{toPersianDigits(String(TOTAL_PANELS).padStart(2, "0"))}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
