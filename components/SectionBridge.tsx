import type { CSSProperties } from "react";

/**
 * The bridge between two home-page sections.
 *
 * The home page is twelve sections in a row, and the gap between two of them
 * was only padding — one section ended, the next began, and the change was a
 * hard cut. A bridge sits in that gap and joins the two sections' own colours,
 * so the eye travels from one to the next instead of jumping.
 *
 * Four variants, one system — no JavaScript, no images, no extra requests.
 * Everything here is paint: gradients, one inline SVG, and transforms, so the
 * bridges cost nothing to load and nothing to scroll. Their entrance rides the
 * page's own reveal system (`data-reveal`), and the global reduced-motion
 * rules still the drift and the fold outright.
 *
 * ── THE FOUR VARIANTS ──────────────────────────────────────────────────────
 * `mist`   A cloudy halo: the band blends the upper colour into the lower one
 *          and three soft discs of the two colours drift across it, slowly.
 *          The breathing space between two sections of the same colour.
 * `fold`   A three-dimensional page turn: the lower section's colour arrives
 *          as a plane that swings down from the crease and settles flat, with
 *          the shadow of the fold under it. Used where the page enters the
 *          dark — ivory into charcoal — so the turn reads as a real turn.
 * `curve`  A wave: the lower section's colour sweeps up into the band as one
 *          smooth curve. Used where the page leaves the dark — charcoal into
 *          ivory — so the light rises out of it.
 * `veil`   The quiet one: the same blend as `mist` without the clouds, a
 *          hairline that fades at both ends, and one small diamond on the
 *          centre line. Used where the joint should be felt and not seen.
 *
 * ── HOW A VARIANT READS ITS COLOURS ────────────────────────────────────────
 * `from` / `to` are the two sections' own backgrounds, as CSS colours — the
 * site's own tokens (`var(--bg)`, `var(--bg-2)`) or the dark sections' own
 * charcoal (`#100e0b`). `tone` says which register the clouds belong to:
 * light joints breathe ivory, dark joints breathe a little of the site's
 * ivory at low strength. `accent` is only for `curve`: the wave's fill when
 * the two sections share a colour and the wave would otherwise be invisible.
 */
export type BridgeVariant = "mist" | "fold" | "curve" | "veil";

type SectionBridgeProps = {
  /** Which of the four joints this is. */
  variant: BridgeVariant;
  /** The section above, as a CSS colour. */
  from: string;
  /** The section below, as a CSS colour. */
  to: string;
  /** Light or dark clouds for `mist`. Defaults to light. */
  tone?: "light" | "dark";
  /** The wave's fill for `curve`, when `to` would not read against `from`. */
  accent?: string;
};

export default function SectionBridge({
  variant,
  from,
  to,
  tone = "light",
  accent,
}: SectionBridgeProps) {
  const style = {
    "--bridge-from": from,
    "--bridge-to": to,
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
      {variant === "mist" ? (
        <span className="bridge-mist">
          <i />
          <i />
          <i />
        </span>
      ) : null}

      {variant === "fold" ? (
        <>
          <span className="bridge-fold-plane" />
          <span className="bridge-fold-crease" />
        </>
      ) : null}

      {variant === "curve" ? (
        <svg
          className="bridge-curve"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path d="M0,0 L1440,0 L1440,34 C1180,86 980,18 760,52 C560,82 360,30 180,58 C90,72 30,66 0,58 Z" />
        </svg>
      ) : null}

      {variant === "veil" ? (
        <span className="bridge-veil">
          <i />
        </span>
      ) : null}
    </div>
  );
}
