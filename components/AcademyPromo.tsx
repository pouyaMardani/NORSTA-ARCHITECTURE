import Image from "next/image";
import Link from "next/link";

import { ACADEMY_CONFIG, getFreeLessons, lessonNumberLabel, toPersianDigits } from "@/content/academy";

/**
 * The academy's promotional block on the home page.
 *
 * It is deliberately *not* a banner: instead of a slogan over a photograph, the
 * section is an editorial index of what the academy actually contains — the three
 * free lessons, by name, with their own thumbnails — and one link into the
 * academy itself. A visitor can see the syllabus before committing to a click,
 * and the block stays worth reading even when nothing in it changes.
 *
 * It is placed directly after the magazine section (`Articles`) and shares its
 * dark ground, so the two stack into a single dark stretch and the home page
 * never flips light → dark → light twice in a row.
 *
 * The lesson list is rendered from the same `getFreeLessons()` the academy's own
 * pages use, so a lesson added to `content/academy/records.ts` appears here too.
 * Only the headline, the paragraph, the button label and the note come from
 * `ACADEMY_COPY`, which keeps the marketing words editable in one place.
 */
export default function AcademyPromo() {
  const { copy, labels } = ACADEMY_CONFIG;
  const lessons = getFreeLessons();

  return (
    <section id="academy" className="aca" dir="rtl" aria-labelledby="aca-promo-title">
      <div className="aca-head">
        <div className="aca-head-title">
          <span className="eyebrow aca-eyebrow" data-reveal="fade-up">
            {copy.promoEyebrow}
          </span>
          <h2
            className="aca-promo-title mask-title"
            id="aca-promo-title"
            data-reveal="mask-line"
            data-delay="120"
          >
            <span className="line">
              <span>{copy.promoTitle}</span>
            </span>
          </h2>
        </div>

        <div className="aca-head-copy">
          <p className="aca-promo-body" data-reveal="fade-up" data-delay="200">
            {copy.promoBody}
          </p>

          <Link className="aca-all" href="/academy" data-reveal="fade-up" data-delay="280">
            <span>{copy.promoCtaLabel}</span>
            <span className="aca-all-count">
              {`${toPersianDigits(lessons.length)} ${labels.lesson} ${labels.free}`}
            </span>
            <span className="aca-all-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M4 12h16" />
                <path d="M14 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <ol className="aca-index">
        {lessons.map((lesson, index) => (
          <li
            className="aca-index-item"
            key={lesson.id}
            data-reveal="fade-up"
            data-delay={String(120 + index * 120)}
          >
            <div className="aca-index-thumb">
              <Image
                src={lesson.coverImage.src}
                alt={lesson.coverImage.alt}
                fill
                sizes="(max-width: 680px) 40vw, 160px"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="aca-index-body">
              <p className="aca-index-meta">
                <span className="aca-index-num">{lessonNumberLabel(lesson)}</span>
                <span className="aca-card-sep" aria-hidden="true" />
                <span className="aca-card-free">{labels.free}</span>
              </p>
              <h3 className="aca-index-title">
                <Link className="aca-index-link" href={`/academy/${lesson.slug}`}>
                  {lesson.title}
                </Link>
              </h3>
              <p className="aca-index-summary">{lesson.summary}</p>
            </div>

            <span className="aca-index-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M4 12h16" />
                <path d="M14 6l6 6-6 6" />
              </svg>
            </span>
          </li>
        ))}
      </ol>

      <p className="aca-note" data-reveal="fade-up">
        {copy.promoNote}
      </p>

      {/* Without scripting the section never receives `is-in` and would stay
          hidden; reveal it outright instead. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".aca [data-reveal]{opacity:1!important;transform:none!important}" +
              ".aca .mask-title .line>span{transform:none!important}",
          }}
        />
      </noscript>
    </section>
  );
}
