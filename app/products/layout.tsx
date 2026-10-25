import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SiteInteractions from "@/components/SiteInteractions";
import { PRODUCT_CONFIG, SITE_ORIGIN } from "@/content/products";

/**
 * Shell for the catalogue.
 *
 * `/products` reuses what the site already has — the same header, the same
 * footer, the same reveal client — on the site's own warm ground, so the
 * catalogue reads as a room of the house rather than a separately designed shop.
 * The shell adds the two things a page needs that the home page gets from its own
 * sections: a height for a page that ends in the footer, and a `<noscript>` rule
 * so the reveal system can never hide the catalogue from a reader without
 * scripting.
 *
 * `SiteInteractions` — not the project pages' `RouteInteractions` — because the
 * catalogue has no lightbox plates (`.proj`) and no child routes, so there is
 * nothing for a per-route remount to keep in step.
 *
 * ── THE CANONICAL ADDRESS ──────────────────────────────────────────────────
 * The page's canonical is set here, absolute and on the production origin, so a
 * filtered view (`/products?category=tools`) consolidates onto `/products` in the
 * index rather than competing with it: the filter is a way through one catalogue,
 * not four catalogues.
 *
 * ── WHY THERE IS NO `openGraph.images` ─────────────────────────────────────
 * Every picture the catalogue currently owns is a marked temporary plate, and
 * publishing one of those as the site's social card would advertise a placeholder
 * as a product photograph. The card therefore carries the title, the description
 * and the address only. Add `images` here — and to the page — the moment real
 * product photography exists.
 */
export const metadata: Metadata = {
  title: PRODUCT_CONFIG.page.seoTitle,
  description: PRODUCT_CONFIG.page.seoDescription,
  alternates: {
    canonical: `${SITE_ORIGIN}/products`,
  },
  openGraph: {
    type: "website",
    title: PRODUCT_CONFIG.page.seoTitle,
    description: PRODUCT_CONFIG.page.seoDescription,
    url: `${SITE_ORIGIN}/products`,
  },
};

export default function ProductsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="prd-shell">
      <Nav />
      <main className="prd-main">{children}</main>
      <Footer />
      <SiteInteractions />

      {/* The reveal system needs scripting; without it the catalogue must still be
          readable (and crawlable). */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".prd-shell [data-reveal]{opacity:1!important;transform:none!important}" +
              ".prd-shell .mask-title .line>span{transform:none!important}",
          }}
        />
      </noscript>
    </div>
  );
}
