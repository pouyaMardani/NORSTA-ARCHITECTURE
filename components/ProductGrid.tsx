import ProductCard from "@/components/ProductCard";

import type { ProductDTO } from "@/content/products";

/**
 * The catalogue grid.
 *
 * A list, not a set of floating cards: the count in a filtered view is the
 * number of products the visitor can actually see, and a screen reader announces
 * how many there are before reading them. Each cell carries its own reveal, so
 * the grid arrives card by card; the stagger is capped, which keeps a long
 * catalogue from ending in a slow trickle.
 *
 * The grid owns no product and no count. It is handed a list — already narrowed
 * by the filter, when there is one — and renders it in order.
 */
type ProductGridProps = {
  products: ProductDTO[];
  /** Accessible name of the list, so the grid is not an anonymous group. */
  label: string;
};

export default function ProductGrid({ products, label }: ProductGridProps) {
  return (
    <ul className="prd-grid" aria-label={label}>
      {products.map((product, index) => (
        <li
          className="prd-grid-item"
          key={product.id}
          data-reveal="fade-up"
          data-delay={String(Math.min(index, 7) * 70)}
        >
          <ProductCard product={product} index={index} />
        </li>
      ))}
    </ul>
  );
}
