import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import LessonCard from "@/components/LessonCard";
import LessonNav from "@/components/LessonNav";
import LessonPlayer from "@/components/LessonPlayer";
import {
  ACADEMY_CONFIG,
  formatLessonDuration,
  getAllLessonSlugs,
  getLessonBySlug,
  getLessonSequence,
  getRelatedLessons,
  lessonNumberLabel,
  type LessonDTO,
} from "@/content/academy";

/**
 * One lesson.
 *
 * The route is `/academy/<slug>` for every lesson — one dynamic page, one URL per
 * record, no duplicated implementation. Unknown slugs fall through to
 * `notFound()`, which renders `app/academy/not-found.tsx` with a 404 status
 * rather than an empty lesson.
 *
 * The page is a Server Component with no client state of its own: the only
 * scripting it uses is the reveal system and the player, both of which are
 * already mounted for the whole segment. Access is *stated* (the badge and the
 * sequence), never gated — this version has no entitlement to check, and
 * `access` is the field a future licensed workflow would read.
 *
 * The order of the page is the order of use: where this lesson sits, what it
 * covers, the lesson itself, the list of what it walks through, then the way
 * onward. A lesson with no recording still renders this whole page — the media
 * slot is the only part that changes (see `LessonPlayer`).
 */
type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

/** Pre-render every lesson at build time. */
export function generateStaticParams() {
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    return { title: ACADEMY_CONFIG.labels.notFoundTitle };
  }

  return {
    title: lesson.seoTitle,
    description: lesson.seoDescription,
    openGraph: {
      type: "article",
      title: lesson.seoTitle,
      description: lesson.seoDescription,
      images: [{ url: lesson.coverImage.src, alt: lesson.coverImage.alt }],
    },
  };
}

/** The small facts row under the title: instructor, position, runtime. */
function LessonMeta({ lesson }: { lesson: LessonDTO }) {
  const { labels, instructor } = ACADEMY_CONFIG;
  const duration = formatLessonDuration(lesson.durationMinutes);

  return (
    <p className="aca-post-meta">
      <span className="aca-post-author">
        {labels.instructorBy}
        <span className="aca-post-author-name">{instructor.name}</span>
      </span>

      <span className="aca-post-sep" aria-hidden="true" />
      <span>{lessonNumberLabel(lesson)}</span>

      {lesson.access === "free" ? (
        <>
          <span className="aca-post-sep" aria-hidden="true" />
          <span className="aca-post-free">{labels.free}</span>
        </>
      ) : null}

      {duration ? (
        <>
          <span className="aca-post-sep" aria-hidden="true" />
          <span>{duration}</span>
        </>
      ) : null}
    </p>
  );
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) notFound();

  const { labels } = ACADEMY_CONFIG;
  const { previous, next } = getLessonSequence(lesson);
  const related = getRelatedLessons(lesson, 3);

  return (
    <article className="aca-post" dir="rtl">
      <header className="aca-post-head">
        <div className="aca-post-cover" data-reveal="image-reveal">
          <Image
            src={lesson.coverImage.src}
            alt={lesson.coverImage.alt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <span className="aca-post-veil" aria-hidden="true" />
        </div>

        <div className="aca-post-inner">
          <Link className="aca-back" href="/academy">
            <span className="aca-back-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M20 12H4" />
                <path d="M10 6l-6 6 6 6" />
              </svg>
            </span>
            {labels.back}
          </Link>

          <div className="aca-post-title-block" data-reveal="fade-up" data-delay="160">
            <p className="aca-post-badges">
              <span className="aca-badge">{lessonNumberLabel(lesson)}</span>
              {lesson.access === "free" ? (
                <span className="aca-badge aca-badge-free">{labels.free}</span>
              ) : null}
            </p>

            <h1 className="aca-post-title">{lesson.title}</h1>
          </div>

          <div data-reveal="fade-up" data-delay="280">
            <LessonMeta lesson={lesson} />
          </div>
        </div>
      </header>

      <div className="aca-post-wrap">
        <p className="aca-post-lede">{lesson.description}</p>

        <LessonPlayer lesson={lesson} />

        {lesson.outline.length > 0 ? (
          <section className="aca-outline-block" aria-labelledby="aca-outline-title">
            <h2 className="aca-post-h2" id="aca-outline-title">
              {labels.outline}
            </h2>
            <ul className="aca-outline">
              {lesson.outline.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <LessonNav previous={previous} next={next} />
      </div>

      {related.length > 0 ? (
        <section className="aca-related" aria-labelledby="aca-related-title">
          <h2 className="aca-related-title" id="aca-related-title" data-reveal="fade-up">
            {labels.related}
          </h2>

          <div className="aca-grid">
            {related.map((item, index) => (
              <div
                className="aca-grid-item"
                key={item.id}
                data-reveal="fade-up"
                data-delay={String(index * 110)}
              >
                <LessonCard lesson={item} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
