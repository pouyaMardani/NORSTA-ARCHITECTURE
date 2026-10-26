import { INSTAGRAM_URL } from "@/content/products";

/**
 * The catalogue's ordering action.
 *
 * The catalogue has no cart, no checkout and no payment form: an order is a
 * conversation. This is the one control that starts it, so every place the
 * catalogue offers to order uses *this* component rather than a hand-built
 * anchor — the destination, the `target`/`rel` pair and the glyph can then never
 * drift apart between the home page's showcase, the catalogue's hero and its
 * closing band.
 *
 * `label` is the button's text and therefore its accessible name; the glyph and
 * the arrow are decorative. The anchor is a plain link, so it is reachable and
 * operable by keyboard, opens in a new tab without handing the new document a
 * reference back to this one, and never pretends to complete a payment.
 *
 * `className` carries the visual weight (`prd-btn-solid` / `prd-btn-ghost`),
 * because where the button sits belongs to the caller and what it *does* belongs
 * here.
 */
type InstagramCtaProps = {
  label: string;
  className?: string;
};

export default function InstagramCta({
  label,
  className = "prd-btn prd-btn-solid",
}: InstagramCtaProps) {
  return (
    <a className={className} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
      <span className="prd-btn-glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5.2" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
        </svg>
      </span>

      <span className="prd-btn-label">{label}</span>

      <span className="prd-btn-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7.5 16.5 16.5 7.5" />
          <path d="M9 7.5h7.5V15" />
        </svg>
      </span>
    </a>
  );
}
