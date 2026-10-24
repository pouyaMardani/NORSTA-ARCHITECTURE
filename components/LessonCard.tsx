import Image from "next/image";
import Link from "next/link";

import {
  ACADEMY_CONFIG,
  formatLessonDuration,
  formatLessonNumber,
  lessonNumberLabel,
  type LessonDTO,
} from "@/content/academy";

/**
 * One lesson card — the shared unit of the landing page's lesson row and the
 * lesson page's related-lessons block.
 *
 * Like `ArticleCard`, the card is a real photograph with real type mounted over
 * it: the plate is a `next/image`, the number is a Persian numeral and the copy
 * is text, so nothing is a flattened screenshot.
 *
 * Accessibility: the title is the only link and its stretched `::after` covers
 * the whole card (see `globals.css`), so the entire plate is clickable while the
 * link's accessible name stays the lesson title. The number plate, the hairline
 * separator and the arrow are decorative.
 *
 * The «رایگان» badge is written only when the lesson's `access` really is free,
 * and a runtime is printed only when the record carries one — a card therefore
 * never claims either on a lesson that has neither.
 */
type LessonCardProps = {
  lesson: LessonDTO;
  /** Responsive `sizes` hint; defaults to the three-column row. */
  sizes?: string;
};

export default function LessonCard({
  lesson,
  sizes = "(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw",
}: LessonCardProps) {
  const { labels } = ACADEMY_CONFIG;
  const duration = formatLessonDuration(lesson.durationMinutes);

  return (
    <article className="aca-card">
      <div className="aca-card-media">
        <Image
          src={lesson.coverImage.src}
          alt={lesson.coverImage.alt}
          fill
          sizes={sizes}
          style={{ objectFit: "cover" }}
        />
        <span className="aca-card-veil" aria-hidden="true" />
        <span className="aca-card-num" aria-hidden="true">
          {formatLessonNumber(lesson.order)}
        </span>
      </div>

      <div className="aca-card-body">
        <p className="aca-card-meta">
          <span>{lessonNumberLabel(lesson)}</span>
          {lesson.access === "free" ? (
            <>
              <span className="aca-card-sep" aria-hidden="true" />
              <span className="aca-card-free">{labels.free}</span>
            </>
          ) : null}
          {duration ? (
            <>
              <span className="aca-card-sep" aria-hidden="true" />
              <span>{duration}</span>
            </>
          ) : null}
        </p>

        <h3 className="aca-card-title">
          <Link className="aca-card-link" href={`/academy/${lesson.slug}`}>
            {lesson.title}
          </Link>
        </h3>

        <p className="aca-card-excerpt">{lesson.summary}</p>

        <span className="aca-card-cta">
          {labels.view}
          <span className="aca-card-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 12h16" />
              <path d="M14 6l6 6-6 6" />
            </svg>
          </span>
        </span>
      </div>
    </article>
  );
}
