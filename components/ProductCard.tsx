import Image from "next/image";

import {
  PRODUCT_CONFIG,
  formatProductNumber,
  getCategoryLabel,
  getProductInquiryUrl,
  type ProductDTO,
} from "@/content/products";

/**
 * One product, on its card.
 *
 * What the card shows, and nothing more: a photograph (here, a marked
 * stand-in), the shelf the item belongs to, its name, one sentence about what it
 * is, and the way to ask about it. There is no price, no quantity stepper, no
 * "add to cart" and no product page link, because none of those exist in this
 * catalogue — an order is a conversation, and the card's job is to start it.
 *
 * ── WHY THERE IS NO STRETCHED LINK ─────────────────────────────────────────
 * The site's project cards make the whole plate one link into a detail page.
 * There is no detail page here, so the plate is *not* clickable: the only target
 * is the enquiry link in the footer, and its accessible name names both the
 * action and the item («استعلام و سفارش — مالهی فولادی»), so a screen reader
 * announces which product a link belongs to rather than eight identical labels.
 *
 * ── HONESTY ────────────────────────────────────────────────────────────────
 * `image.placeholder` travels with the image, so a stand-in prints «تصویر موقت»
 * over the plate. It stops printing the moment a record points at a real
 * photograph — the card itself never changes.
 *
 * The hairline under the plate carries the record's own `tintHex`: it is the
 * plate's surface tone, used as an accent, never as a claim about the product's
 * colour.
 */
type ProductCardProps = {
  product: ProductDTO;
  /** Zero-based position in the visible grid — the number printed on the plate. */
  index: number;
};

export default function ProductCard({ product, index }: ProductCardProps) {
  const { labels } = PRODUCT_CONFIG;
  const categoryLabel = getCategoryLabel(product.category);
  const enquiryUrl = getProductInquiryUrl(product);

  return (
    <article className="pdc">
      <div className="pdc-media">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(max-width: 640px) 88vw, (max-width: 960px) 44vw, (max-width: 1240px) 30vw, 22vw"
          style={{ objectFit: "cover" }}
        />

        {/* A wash and a hairline: the plate is a flat placeholder, and the glass
            keeps a card from reading as a coloured rectangle. */}
        <span className="pdc-glass" aria-hidden="true" />

        {product.image.placeholder ? (
          <span className="pdc-badge">{labels.placeholder}</span>
        ) : null}

        <span className="pdc-no" aria-hidden="true">
          {formatProductNumber(index)}
        </span>
      </div>

      <span className="pdc-rule" aria-hidden="true" style={{ background: product.tintHex }} />

      <div className="pdc-body">
        <p className="pdc-cat">
          <span className="pdc-cat-label">{labels.category}</span>
          <span className="pdc-cat-sep" aria-hidden="true" />
          {categoryLabel}
        </p>

        <h3 className="pdc-name">{product.name}</h3>

        <p className="pdc-desc">{product.description}</p>

        <a
          className="pdc-cta"
          href={enquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${labels.inquiryShort} — ${product.name}`}
        >
          <span className="pdc-cta-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5.2" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
            </svg>
          </span>

          <span className="pdc-cta-label">{labels.inquiryShort}</span>

          <span className="pdc-cta-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7.5 16.5 16.5 7.5" />
              <path d="M9 7.5h7.5V15" />
            </svg>
          </span>
        </a>
      </div>
    </article>
  );
}
