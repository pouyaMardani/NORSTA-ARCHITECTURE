import Image from "next/image";

import { ACADEMY_CONFIG } from "@/content/academy";

/**
 * The complete collection: the academy's one commercial block.
 *
 * ── What this block deliberately is not ─────────────────────────────────────
 * There is no price, no cart, no discount, no countdown and no checkout — none of
 * it exists yet. What exists is three free lessons and a way to ask about the
 * rest, so the block says exactly that: the topics the collection covers (from
 * `content/academy/config.ts`, editable without touching this file), one button
 * that opens Instagram, and one plain sentence explaining that the purchase is
 * arranged in direct messages there.
 *
 * That sentence is the honest part of the composition: the button starts a
 * conversation, it does not complete a purchase, and the note says so before the
 * reader finds out the hard way. A licensed player (SpotPlayer, for example)
 * would later hand the customer their access by the same manual route, which is
 * why nothing here promises an instant unlock.
 *
 * The plates are the studio's own work, captioned by their alt text; they are
 * content photographs of what the collection teaches, not decorative wallpaper.
 */
export default function AcademyCollection() {
  const { collection, labels } = ACADEMY_CONFIG;
  const [lead, ...rest] = collection.images;

  return (
    <section className="aca-collection" aria-labelledby="aca-collection-title">
      <div className="aca-collection-copy">
        <span className="eyebrow aca-eyebrow" data-reveal="fade-up">
          {collection.eyebrow}
        </span>

        <h2
          className="aca-collection-title mask-title"
          id="aca-collection-title"
          data-reveal="mask-line"
          data-delay="120"
        >
          <span className="line">
            <span>{collection.title}</span>
          </span>
        </h2>

        {collection.description.map((paragraph, index) => (
          <p
            className="aca-collection-p"
            key={paragraph}
            data-reveal="fade-up"
            data-delay={String(200 + index * 80)}
          >
            {paragraph}
          </p>
        ))}

        {collection.outcomes.length > 0 ? (
          <ul className="aca-outcomes" data-reveal="fade-up" data-delay="360">
            {collection.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        ) : null}

        <div className="aca-collection-cta" data-reveal="fade-up" data-delay="440">
          <a
            className="aca-btn aca-btn-solid"
            href={collection.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="aca-btn-glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5.2" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
              </svg>
            </span>
            {collection.ctaLabel}
            <span className="aca-btn-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7.5 16.5 16.5 7.5" />
                <path d="M9 7.5h7.5V15" />
              </svg>
            </span>
          </a>

          <p className="aca-collection-note">
            <span className="aca-collection-note-label">{labels.purchaseNoteLabel}</span>
            {collection.ctaNote}
          </p>
        </div>
      </div>

      {lead ? (
        <div className="aca-collection-plates">
          <figure className="aca-collection-plate aca-collection-plate-lead" data-reveal="image-reveal">
            <Image
              src={lead.src}
              alt={lead.alt}
              fill
              sizes="(max-width: 960px) 100vw, 42vw"
              style={{ objectFit: "cover" }}
            />
          </figure>

          {rest.slice(0, 1).map((image) => (
            <figure
              className="aca-collection-plate aca-collection-plate-second"
              key={image.src}
              data-reveal="image-reveal"
              data-delay="140"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 960px) 100vw, 42vw"
                style={{ objectFit: "cover" }}
              />
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}
