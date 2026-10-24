import Link from "next/link";

import {
  ACADEMY_CONFIG,
  lessonNumberLabel,
  type LessonDTO,
} from "@/content/academy";

/**
 * The sequence controls at the foot of a lesson page.
 *
 * Both ends of the sequence are nullable, so the first lesson prints only "next"
 * and the last only "previous": the reader is never offered a link that loops
 * back on itself, and a one-lesson academy would render nothing at all.
 *
 * The arrows follow the site's existing convention rather than a generic one —
 * `previous` reuses the left-pointing glyph of `.post-back` ("back") and `next`
 * the right-pointing glyph of `.art-all-arrow` — so the pager matches the back
 * link at the top of the same page.
 */
type LessonNavProps = {
  previous: LessonDTO | null;
  next: LessonDTO | null;
};

export default function LessonNav({ previous, next }: LessonNavProps) {
  const { labels } = ACADEMY_CONFIG;

  if (!previous && !next) return null;

  return (
    <nav className="aca-pager" aria-label={labels.sequence}>
      {previous ? (
        <Link className="aca-pager-link" href={`/academy/${previous.slug}`}>
          <span className="aca-pager-dir">
            <span className="aca-pager-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M20 12H4" />
                <path d="M10 6l-6 6 6 6" />
              </svg>
            </span>
            {labels.previous}
          </span>
          <span className="aca-pager-title">{previous.title}</span>
          <span className="aca-pager-num">{lessonNumberLabel(previous)}</span>
        </Link>
      ) : (
        <span className="aca-pager-gap" aria-hidden="true" />
      )}

      {next ? (
        <Link className="aca-pager-link" href={`/academy/${next.slug}`}>
          <span className="aca-pager-dir">
            {labels.next}
            <span className="aca-pager-arrow aca-pager-arrow-forward" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M4 12h16" />
                <path d="M14 6l6 6-6 6" />
              </svg>
            </span>
          </span>
          <span className="aca-pager-title">{next.title}</span>
          <span className="aca-pager-num">{lessonNumberLabel(next)}</span>
        </Link>
      ) : (
        <span className="aca-pager-gap" aria-hidden="true" />
      )}
    </nav>
  );
}
