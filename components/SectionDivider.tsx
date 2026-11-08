import type { CSSProperties } from "react";

/**
 * The divider between two home-page sections.
 *
 * The page tried tall, colourful bridges — and they were too much. This is
 * the opposite: one beautiful line, broken in the middle, in the site's own
 * language. A hairline that fades at both ends, a gap at its centre, and one
 * small diamond sitting in the gap — the same diamond the site's labels wear.
 * Nothing moves, nothing blends, nothing is added to the page's weight: no
 * JavaScript, no images, one element, and its entrance rides the page's own
 * reveal system.
 *
 * `bg` is the section above, as a CSS colour: the divider is a slim band,
 * and its ground has to be the section it closes, or it would read as a
 * stripe of the wrong colour where two dark sections meet. `tone` says which
 * register the diamond belongs to — ink on the light ground, ivory on the
 * dark one — so the mark reads on either.
 */
type SectionDividerProps = {
  /** The section above, as a CSS colour. */
  bg: string;
  /** Light or dark ground. Defaults to light. */
  tone?: "light" | "dark";
};

export default function SectionDivider({ bg, tone = "light" }: SectionDividerProps) {
  return (
    <div
      className="divider"
      data-tone={tone}
      data-reveal="fade-up"
      aria-hidden="true"
      style={{ "--divider-bg": bg } as CSSProperties}
    />
  );
}
