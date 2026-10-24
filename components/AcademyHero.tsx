import Image from "next/image";

import { ACADEMY_CONFIG, getFreeLessons, toPersianDigits } from "@/content/academy";

/**
 * The academy's own entrance.
 *
 * A single full-bleed still with the copy mounted on its lower edge — the same
 * composition the magazine's article pages use, so the academy reads as another
 * room of this site rather than a separately designed course platform.
 *
 * The headline is one `<span className="line">` per configured line and rides the
 * site's existing masked-line reveal, which is why `titleLines` in
 * `content/academy/config.ts` is an array rather than one string: the line
 * breaks are an editorial decision, not a CSS accident.
 *
 * The two actions are deliberately different in kind:
 *   · the primary action jumps to `#lessons` — the three free lessons below, on
 *     this page, with no form and no email in between;
 *   · the secondary action leaves for Instagram, where the complete collection is
 *     actually arranged. It is an ordinary external link (`target="_blank"`,
 *     `rel="noopener noreferrer"`), and the note beside it says plainly that the
 *     purchase is handled in direct messages, so the link never pretends to
 *     complete a payment.
 */
export default function AcademyHero() {
  const { copy, labels, instructor } = ACADEMY_CONFIG;
  const freeLessons = getFreeLessons().length;

  return (
    <section className="aca-hero">
      <div className="aca-hero-media" data-reveal="image-reveal">
        <Image
          src={ACADEMY_CONFIG.placeholderImage.src}
          alt={ACADEMY_CONFIG.placeholderImage.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <span className="aca-hero-veil" aria-hidden="true" />
      </div>

      <div className="aca-hero-inner">
        <span className="eyebrow aca-eyebrow" data-reveal="fade-up">
          {copy.eyebrow}
        </span>

        <h1 className="aca-hero-title mask-title" data-reveal="mask-line" data-delay="120">
          {copy.titleLines.map((line) => (
            <span className="line" key={line}>
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <p className="aca-hero-lede" data-reveal="fade-up" data-delay="240">
          {copy.lede}
        </p>

        <div className="aca-hero-actions" data-reveal="fade-up" data-delay="330">
          <a className="aca-btn aca-btn-solid" href="#lessons">
            {copy.ctaPrimary}
            <span className="aca-btn-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14" />
                <path d="M6 13l6 6 6-6" />
              </svg>
            </span>
          </a>

          <a
            className="aca-btn aca-btn-ghost"
            href={ACADEMY_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.ctaSecondary}
            <span className="aca-btn-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7.5 16.5 16.5 7.5" />
                <path d="M9 7.5h7.5V15" />
              </svg>
            </span>
          </a>
        </div>

        <p className="aca-hero-credit" data-reveal="fade-up" data-delay="420">
          {instructor.credit}
          <span className="aca-card-sep" aria-hidden="true" />
          {`${toPersianDigits(freeLessons)} ${labels.lesson} ${labels.free}`}
        </p>
      </div>
    </section>
  );
}
