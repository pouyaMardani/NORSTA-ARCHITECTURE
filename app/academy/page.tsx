import type { Metadata } from "next";

import AcademyCollection from "@/components/AcademyCollection";
import AcademyHero from "@/components/AcademyHero";
import AcademyInstructor from "@/components/AcademyInstructor";
import LessonCard from "@/components/LessonCard";
import { ACADEMY_CONFIG, getFreeLessons } from "@/content/academy";

/**
 * The academy landing page.
 *
 * Four bands, in the order the academy itself is structured:
 *
 *   A. the hero        — what this is, and the two ways in;
 *   B. the instructor  — who the lessons are attributed to;
 *   C. the lessons     — the three free ones, the page's actual content;
 *   D. the collection  — what comes after them, and how to ask about it.
 *
 * The middle band is the page's reason to exist, so it is a plain grid of the
 * same `LessonCard` the rest of the site uses: no gate, no form, no email, just
 * three links. Both other bands (the instructor and the collection) are their own
 * components; this page only lays them out.
 *
 * The lesson list comes from `getFreeLessons()`, and the copy from
 * `ACADEMY_COPY`, so the page holds no content of its own.
 */
export const metadata: Metadata = {
  description:
    "سه درس رایگان میکروسمنت از آکادمی نورستا: میکروسمنت چیست، آشنایی با ابزار و متریال، و آمادهسازی زیرکار؛ همراه با مسیر کامل یادگیری برای ادامه.",
};

export default function AcademyPage() {
  const { copy, labels } = ACADEMY_CONFIG;
  const lessons = getFreeLessons();

  return (
    <div className="aca-page" dir="rtl">
      <AcademyHero />

      <AcademyInstructor />

      <section className="aca-lessons" id="lessons" aria-labelledby="aca-lessons-title">
        <header className="aca-lessons-head">
          <span className="eyebrow aca-eyebrow" data-reveal="fade-up">
            {labels.sequence}
          </span>

          <h2
            className="aca-lessons-title mask-title"
            id="aca-lessons-title"
            data-reveal="mask-line"
            data-delay="120"
          >
            <span className="line">
              <span>{copy.lessonsTitle}</span>
            </span>
          </h2>

          <p className="aca-lessons-intro" data-reveal="fade-up" data-delay="200">
            {copy.lessonsIntro}
          </p>
        </header>

        {lessons.length > 0 ? (
          <div className="aca-grid">
            {lessons.map((lesson, index) => (
              <div
                className="aca-grid-item"
                key={lesson.id}
                data-reveal="fade-up"
                data-delay={String(120 + index * 120)}
              >
                <LessonCard lesson={lesson} />
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <AcademyCollection />
    </div>
  );
}
