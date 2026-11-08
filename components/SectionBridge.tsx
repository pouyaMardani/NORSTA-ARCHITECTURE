import type { CSSProperties } from "react";

/**
 * The bridge between two home-page sections — reconsidered.
 *
 * The first version of this bridge was too quiet: on two sections of one
 * colour it was nearly invisible, and where the colour changed it read as the
 * next section starting early rather than as a passage between the two. This
 * version is a passage you can see. Three things, all of them deliberate:
 *
 * 1. THE COLOURS ARE THE BRIDGE. The band is tall, and its ground is a
 *    visible journey from the upper section's colour, through a middle tone,
 *    into the lower section's colour. `from` and `to` are the two sections'
 *    own backgrounds; `mid` is the tone the journey passes through — the
 *    deeper sand where two ivory sections meet, the raised charcoal where two
 *    dark sections meet, a warm taupe where ivory meets charcoal. Nothing
 *    here is a new colour: every tone is the page's own palette, or the
 *    midpoint of the two colours it joins.
 *
 * 2. THREE-DIMENSIONAL, DRIVEN BY THE SCROLL. A slab in the lower section's
 *    colour floats in the band — a solid plate, with a soft shadow under it
 *    and a faint light on its top edge, so it reads as a thing rather than a
 *    tint. It is tilted in three dimensions and it moves with the scroll:
 *    as the band enters the viewport the slab swings down toward the reader,
 *    settles flat while it is in view, and tilts away as it leaves. That
 *    motion is a scroll-driven animation (`animation-timeline: view()`), so
 *    the slab answers the scroll itself instead of playing once on arrival.
 *    Browsers without scroll-driven animations, and readers who asked for
 *    less motion, see the slab sitting flat — the bridge is still a coloured
 *    passage, just without the turn.
 *
 * 3. FADING. The slab fades with the same scroll: it arrives out of nothing
 *    and leaves into nothing, and the ground itself is a fade from one
 *    section's colour into the next. The bridge is a dissolve as much as a
 *    joint.
 *
 * ── THE THREE VARIANTS ─────────────────────────────────────────────────────
 * `fold`   The slab is the star: a page turn. It swings down from the top
 *          crease at a steep tilt, so the turn reads as a real turn. Used
 *          where the colour changes — the joints that need the most drama.
 * `mist`   The cloudy halo: two big soft discs of the two sections' colours
 *          drift across the band, slowly, and the slab turns more gently
 *          beneath them. Used where two sections of one colour need air.
 * `curve`  No slab — two waves instead. The lower section's colour sweeps up
 *          into the band as one smooth wave, with a fainter wave of the
 *          middle tone behind it, so the light (or the dark) rises out of
 *          the section above.
 *
 * ── COST ───────────────────────────────────────────────────────────────────
 * Still no JavaScript and no images: one inline SVG for the waves, the rest
 * paint. The scroll-driven motion is transform and opacity only, which the
 * compositor owns, and it is gated behind both `@supports` and
 * `prefers-reduced-motion: no-preference`. The bands are tall on purpose —
 * a passage has to have room — so the page grows by about two screens in
 * total. That is the price of the effect, and it is spent on purpose.
 */
export type BridgeVariant = "mist" | "fold" | "curve";

type SectionBridgeProps = {
  /** Which of the three joints this is. */
  variant: BridgeVariant;
  /** The section above, as a CSS colour. */
  from: string;
  /** The section below, as a CSS colour. */
  to: string;
  /** The tone the colour journey passes through, as a CSS colour. */
  mid: string;
  /** Light or dark clouds for `mist`. Defaults to light. */
  tone?: "light" | "dark";
  /** The wave's fill for `curve`, when `to` would not read against `from`. */
  accent?: string;
};

export default function SectionBridge({
  variant,
  from,
  to,
  mid,
  tone = "light",
  accent,
}: SectionBridgeProps) {
  const style = {
    "--bridge-from": from,
    "--bridge-to": to,
    "--bridge-mid": mid,
    "--bridge-accent": accent ?? to,
  } as CSSProperties;

  return (
    <div
      className="bridge"
      data-variant={variant}
      data-tone={tone}
      data-reveal="fade-up"
      aria-hidden="true"
      style={style}
    >
      {/* The visible journey from one section's colour into the next. */}
      <span className="bridge-wash" />

      {variant === "mist" ? (
        <span className="bridge-orbs">
          <i />
          <i />
        </span>
      ) : null}

      {variant !== "curve" ? (
        /* The three-dimensional slab: the lower section's colour, floating in
           the band, tilted by the scroll. */
        <span className="bridge-sheet" />
      ) : null}

      {variant === "curve" ? (
        <svg
          className="bridge-waves"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path
            className="bridge-wave bridge-wave--back"
            d="M0,60 C240,10 480,110 720,60 C960,10 1200,110 1440,60 L1440,220 L0,220 Z"
          />
          <path
            className="bridge-wave bridge-wave--front"
            d="M0,110 C240,60 480,160 720,110 C960,60 1200,160 1440,110 L1440,220 L0,220 Z"
          />
        </svg>
      ) : null}
    </div>
  );
}
