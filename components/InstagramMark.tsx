import { useId } from "react";

/**
 * The Instagram mark, drawn as a three-dimensional tile rather than a flat
 * outline: the platform's own gradient (yellow through orange, pink and
 * purple to blue) on a rounded square, the camera glyph in white, a darker
 * tile behind it offset down and to the side for depth, and a glassy sheen
 * across the top — so the mark reads as a solid app icon sitting on the
 * page, not as a line drawing of one.
 *
 * The gradient ids are per-instance (`useId`), so the mark can be used more
 * than once on a page without the defs colliding. The float is on the svg
 * itself and the hover lift on the wrapper, so the two motions compose
 * instead of fighting over one transform.
 */
export default function InstagramMark({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `ig-grad-${uid}`;
  const shineId = `ig-shine-${uid}`;

  return (
    <span className={className}>
      <svg
        className="ig-mark-float"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={gradId}
            x1="8"
            y1="112"
            x2="112"
            y2="8"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#feda75" />
            <stop offset="0.25" stopColor="#fa7e1e" />
            <stop offset="0.5" stopColor="#d62976" />
            <stop offset="0.75" stopColor="#962fbf" />
            <stop offset="1" stopColor="#4f5bd5" />
          </linearGradient>
          <linearGradient id={shineId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.38" />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* The depth layer: a darker tile behind, offset down and to the
            side, so the gradient tile sits on something solid. */}
        <rect x="12" y="16" width="96" height="96" rx="26" fill="#5b2a86" />
        {/* The gradient tile. */}
        <rect x="6" y="6" width="96" height="96" rx="26" fill={`url(#${gradId})`} />
        {/* The glassy sheen across the tile's top. */}
        <rect x="6" y="6" width="96" height="96" rx="26" fill={`url(#${shineId})`} />
        {/* The camera glyph, in white: the rounded square, the lens, the flash. */}
        <rect x="28" y="28" width="52" height="52" rx="15" stroke="#fff" strokeWidth="5" />
        <circle cx="54" cy="54" r="12" stroke="#fff" strokeWidth="5" />
        <circle cx="72" cy="36" r="3.5" fill="#fff" />
      </svg>
    </span>
  );
}
