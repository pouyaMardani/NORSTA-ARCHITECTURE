"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  formatProjectDate,
  toPersianDigits,
  type ProjectDTO,
} from "@/content/projects";

/**
 * One project inside the microcement showcase.
 *
 * Jetton's project page, rebuilt with the project's own record: a centred
 * title and tagline, the hero photograph, a meta row of only the facts the
 * record carries, the description as large statements interleaved with the
 * three gallery shots in a staggered sequence — and the READING / VISUAL
 * switch. READING is the storytelling presentation above; VISUAL hides every
 * text block and shows only the four photographs in a centred column, with a
 * thumbnail rail on the right edge that follows the scroll and jumps to any
 * shot. The switch is a black pill fixed at the bottom centre; both buttons
 * are briefly disabled while the change runs, as in the template.
 *
 * The page closes with the next project in the curated order (wrapping from
 * the last back to the first), so the ten case studies form one circular
 * chain — again Jetton's pattern.
 */
type Mode = "reading" | "visual";

export default function ProjectView({
  project,
  next,
}: Readonly<{ project: ProjectDTO; next: ProjectDTO }>) {
  const [mode, setMode] = useState<Mode>("reading");
  const [switching, setSwitching] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const switchTimeout = useRef<number | null>(null);

  const images = [project.coverImage, ...project.galleryImages];

  const switchTo = (nextMode: Mode) => {
    if (nextMode === mode) return;
    if (switchTimeout.current !== null) {
      window.clearTimeout(switchTimeout.current);
    }
    setMode(nextMode);
    setSwitching(true);
    switchTimeout.current = window.setTimeout(() => {
      setSwitching(false);
      switchTimeout.current = null;
    }, 450);
  };

  useEffect(
    () => () => {
      if (switchTimeout.current !== null) {
        window.clearTimeout(switchTimeout.current);
      }
    },
    [],
  );

  const scrollToImage = (index: number) => {
    document
      .getElementById(`mc-img-${index + 1}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    setCurrentImage(index);
  };

  /* While the visual column is showing, the rail follows the scroll: the
     outlined thumbnail is the shot whose centre is nearest the middle of the
     viewport. Passive, and only while it can be seen. */
  useEffect(() => {
    if (mode !== "visual") return;
    const onScroll = () => {
      const middle = window.innerHeight / 2;
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (let index = 0; index < images.length; index += 1) {
        const element = document.getElementById(`mc-img-${index + 1}`);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - middle);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      }
      setCurrentImage(nearest);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // The images are the record's own shots; the effect only re-runs on mode.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const statement = (index: number) =>
    project.description[index] ? (
      <p className="mc-proj-statement" data-mc-reveal>
        {project.description[index]}
      </p>
    ) : null;

  return (
    <article
      className={
        mode === "visual" ? "mc-project mc-project--visual" : "mc-project"
      }
    >
      <Link href="/microcement/works" className="mc-proj-back">
        → بازگشت به آثار
      </Link>

      {/* ── Hero: centred title, tagline, toolbar ────────────────────── */}
      <header className="mc-proj-hero">
        <h1 className="mc-display">{project.title}</h1>
        <p className="mc-proj-tag">{project.shortDescription}</p>
        <div className="mc-toolbar">
          <span className="mc-mono">↓ اسکرول کنید</span>
          <span className="mc-mono">{project.category}</span>
          {project.completedAt ? (
            <span className="mc-mono">
              {formatProjectDate(project.completedAt)}
            </span>
          ) : null}
        </div>
      </header>

      {/* ── Hero photograph ──────────────────────────────────────────── */}
      <div className="mc-proj-hero-img" id="mc-img-1">
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          sizes="100vw"
          priority
        />
      </div>

      {/* ── Meta: only the facts the record carries ──────────────────── */}
      <dl className="mc-proj-meta">
        {project.location ? (
          <div>
            <dt>مکان</dt>
            <dd>{project.location}</dd>
          </div>
        ) : null}
        <div>
          <dt>دسته</dt>
          <dd>{project.category}</dd>
        </div>
        {project.completedAt ? (
          <div>
            <dt>سال</dt>
            <dd>{formatProjectDate(project.completedAt)}</dd>
          </div>
        ) : null}
      </dl>

      {statement(0)}

      {/* ── Gallery: staggered shots, the second statement between ────── */}
      <div className="mc-proj-gallery">
        {project.galleryImages[0] ? (
          <figure className="mc-proj-shot mc-proj-shot--wide" id="mc-img-2">
            <div className="mc-proj-shot-media">
              <Image
                src={project.galleryImages[0].src}
                alt={project.galleryImages[0].alt}
                fill
                sizes="(max-width: 680px) 100vw, 90vw"
              />
            </div>
            {project.galleryImages[0].caption ? (
              <figcaption>{project.galleryImages[0].caption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        {project.galleryImages[1] ? (
          <figure
            className="mc-proj-shot mc-proj-shot--narrow"
            id="mc-img-3"
          >
            <div className="mc-proj-shot-media">
              <Image
                src={project.galleryImages[1].src}
                alt={project.galleryImages[1].alt}
                fill
                sizes="(max-width: 680px) 100vw, 90vw"
              />
            </div>
            {project.galleryImages[1].caption ? (
              <figcaption>{project.galleryImages[1].caption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        {statement(1)}

        {project.galleryImages[2] ? (
          <figure className="mc-proj-shot mc-proj-shot--full" id="mc-img-4">
            <div className="mc-proj-shot-media">
              <Image
                src={project.galleryImages[2].src}
                alt={project.galleryImages[2].alt}
                fill
                sizes="(max-width: 680px) 100vw, 90vw"
              />
            </div>
            {project.galleryImages[2].caption ? (
              <figcaption>{project.galleryImages[2].caption}</figcaption>
            ) : null}
          </figure>
        ) : null}
      </div>

      {statement(2)}

      {/* ── Next project: the chain closes on itself ─────────────────── */}
      <Link
        href={`/microcement/works/${next.slug}`}
        className="mc-next-proj"
      >
        <p className="mc-next-num">پروژه‌ی بعدی</p>
        <span className="mc-next-proj-title">{next.title}</span>
        <span className="mc-next-proj-media">
          <Image
            src={next.coverImage.src}
            alt={next.coverImage.alt}
            fill
            sizes="100vw"
          />
        </span>
      </Link>

      {/* ── Reading / visual switch ──────────────────────────────────── */}
      <div className="mc-view-pill" role="group" aria-label="نمای پروژه">
        <span className="mc-view-pill-label">نمای پروژه</span>
        <button
          type="button"
          aria-pressed={mode === "reading"}
          disabled={switching}
          onClick={() => switchTo("reading")}
        >
          خواندن
        </button>
        <button
          type="button"
          aria-pressed={mode === "visual"}
          disabled={switching}
          onClick={() => switchTo("visual")}
        >
          دیداری
        </button>
      </div>

      {/* ── Thumbnail rail: visible only in visual mode, via the CSS ──── */}
      <div className="mc-rail" aria-label="تصویرهای پروژه">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-current={currentImage === index}
            aria-label={`رفتن به تصویر ${toPersianDigits(index + 1)}`}
            onClick={() => scrollToImage(index)}
          >
            <Image src={image.src} alt="" width={56} height={70} />
          </button>
        ))}
      </div>
    </article>
  );
}
