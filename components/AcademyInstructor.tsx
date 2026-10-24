import Image from "next/image";

import { ACADEMY_CONFIG } from "@/content/academy";

/**
 * The instructor block.
 *
 * ── Why there is no portrait here ───────────────────────────────────────────
 * No approved portrait of the instructor exists in this project, and Norsta's
 * rules forbid inventing one — as they forbid inventing a biography, a
 * certification, an award or a year count. So the block is composed the way
 * `Craftsman.tsx` composes the studio's craftsman block: a real photograph of the
 * studio's own material work, credited with its own caption, carrying the name,
 * the role and the introduction in type.
 *
 * When an approved portrait exists, change `ACADEMY_INSTRUCTOR.image` in
 * `content/academy/config.ts` — this component crops whatever plate it is given
 * into the same silhouette and needs no other change.
 *
 * The name is the section's heading and the role is a label beneath it; the
 * credit line stays the instructor's record's own words, so the same sentence
 * appears wherever she is named.
 */
export default function AcademyInstructor() {
  const { instructor, copy } = ACADEMY_CONFIG;

  return (
    <section className="aca-teacher" aria-labelledby="aca-teacher-name">
      <div className="aca-teacher-visual" data-reveal="image-reveal">
        <div className="aca-teacher-frame">
          <figure className="aca-teacher-figure">
            <Image
              src={instructor.image.src}
              alt={instructor.image.alt}
              fill
              sizes="(max-width: 960px) 100vw, 40vw"
              style={{ objectFit: "cover" }}
            />
          </figure>
        </div>

        {instructor.image.caption ? (
          <p className="aca-teacher-caption">{instructor.image.caption}</p>
        ) : null}
      </div>

      <div className="aca-teacher-copy">
        <span className="eyebrow aca-eyebrow" data-reveal="fade-up">
          {copy.instructorEyebrow}
        </span>

        <h2
          className="aca-teacher-name mask-title"
          id="aca-teacher-name"
          data-reveal="mask-line"
          data-delay="120"
        >
          <span className="line">
            <span>{instructor.name}</span>
          </span>
        </h2>

        <p className="aca-teacher-role" data-reveal="fade-up" data-delay="200">
          {instructor.role}
        </p>

        {instructor.intro.map((paragraph, index) => (
          <p
            className="aca-teacher-bio"
            key={paragraph}
            data-reveal="fade-up"
            data-delay={String(260 + index * 80)}
          >
            {paragraph}
          </p>
        ))}

        {instructor.focus.length > 0 ? (
          <ul className="aca-focus" data-reveal="fade-up" data-delay="420">
            {instructor.focus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
