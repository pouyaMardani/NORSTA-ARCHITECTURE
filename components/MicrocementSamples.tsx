import { Fragment } from "react";

import SampleWall from "@/components/SampleWall";

import { SAMPLE_CONFIG, getSampleCategories, getWallSamples, toPersianDigits } from "@/content/samples";

/**
 * The material library.
 *
 * Eight framed microcement samples hang on a lit wall, each label naming the
 * finish, the colour and the family it belongs to. The brief asked for a section
 * that behaves like a premium sample showcase rather than a product grid, so the
 * built page is: a studio-style head on the left, the wall on the right, a
 * filter row derived from the records, and a deep-zoom viewer behind every frame.
 *
 * ── WHAT THIS COMPONENT DOES, AND WHAT IT DOES NOT ─────────────────────────
 * It reads the library (`content/samples`), renders the head and hands the
 * records to `SampleWall`. It owns no sample, no name and no count: adding a
 * record grows the wall, deleting one closes the gap, and re-ordering is one
 * `sortOrder` edit — this file never changes again.
 *
 * The head is a server component and stays one; the filter row and the viewer
 * are the only interactive parts, and they live in the client boundary
 * `SampleWall` opens.
 *
 * ── HONESTY ────────────────────────────────────────────────────────────────
 * The studio has not published close-ups of these finishes yet, so every record
 * currently hangs a temporary plate. The plates say so on their face, and the
 * viewer prints «تصویر موقت» beside the sample. Nothing about this section
 * claims a material has been photographed when it has not.
 */
export default function MicrocementSamples() {
  const samples = getWallSamples();
  const categories = getSampleCategories(samples);
  const { section, labels } = SAMPLE_CONFIG;

  return (
    <section id="materials" className="mfc" aria-labelledby="mfc-title">
      <div className="mfc-inner">
        <div className="mfc-head">
          <div className="mfc-head-title">
            <span className="eyebrow mfc-eyebrow" data-reveal="fade-up">
              {toPersianDigits(samples.length)} {section.eyebrow}
            </span>

            <h2
              className="mfc-title mask-title"
              id="mfc-title"
              data-reveal="mask-line"
              data-delay="120"
            >
              <span className="line">
                <span>{section.title}</span>
              </span>
            </h2>

            {/* The Latin material word, set as an ornament rather than as a claim:
                it repeats the heading in the trade's own language. */}
            <p className="mfc-latin" aria-hidden="true">
              {section.latinNote}
            </p>
          </div>

          <div className="mfc-head-copy">
            <p className="mfc-lede" data-reveal="fade-up" data-delay="200">
              {section.intro.map((line, index) => (
                <Fragment key={line}>
                  {index > 0 ? <br /> : null}
                  {line}
                </Fragment>
              ))}
            </p>

            <p className="mfc-hint" data-reveal="fade-up" data-delay="280">
              <span className="mfc-hint-glyph" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <circle cx="10.8" cy="10.8" r="6.2" />
                  <path d="M15.4 15.4 20.5 20.5" />
                  <path d="M10.8 8.5v4.6M8.5 10.8h4.6" />
                </svg>
              </span>
              {section.hint}
            </p>
          </div>
        </div>

        <SampleWall
          samples={samples}
          categories={categories}
          labels={labels}
          wallLabel={section.name}
          legendLabel={section.legendLabel}
          allLabel={section.allLabel}
          wallNote={section.wallNote}
        />
      </div>
    </section>
  );
}
