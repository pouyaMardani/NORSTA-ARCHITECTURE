import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";

import BackToTop from "@/components/BackToTop";
import JsonLd from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";

import {
  SITE_LOCALE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";
import {
  graphJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/structured-data";

import "./globals.css";

/**
 * Latin brand faces only. After localisation these two families are used
 * exclusively for the kept-English brand text (`NORSTA`, `NORSTA HOME`), so the
 * original wordmark typography is preserved verbatim.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * Vazirmatn — the Persian typeface, self-hosted as a single variable WOFF2
 * (wght 100–900) so every weight used by the design costs one small request
 * instead of four static files. Loaded through `next/font/local`, which emits a
 * preload link and a metric-corrected fallback, so there is no layout shift.
 */
const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-vazirmatn",
  fallback: ["Segoe UI", "Tahoma", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_TAGLINE,

  /* The mark: a carved `N` on a warm-stone plaque — the studio's own two
     colours as one full-bleed square tile, a charcoal monogram whose spine is
     a single curved wall. Cut by `scripts/make-favicon.mjs` (run it after
     touching the geometry there), served from `public/`, and inherited by
     every route through this root layout.

     Order matters only as a tie-break, so the two vectors come last and win:
     `/favicon.svg` for light chrome, `/favicon-dark.svg` — the same drawing
     inverted, a charcoal plaque — behind a `prefers-color-scheme: dark` media
     query. The PNGs and the ICO are the exact-pixel and legacy fallbacks, and
     Safari, which ignores SVG favicons, gets the stone plaque from
     `/favicon.ico` — the charcoal monogram on it reads on a light tab, and the
     stone tile itself reads on a dark one. */
  /* ── The absolute address, and the share card's own defaults ──────────────
     `metadataBase` is what turns every relative URL in this metadata into the
     absolute one a crawler needs: the canonical link, the Open Graph image and
     the structured data all name one address instead of the localhost fallback.
     A page that states its own `openGraph` replaces the object below wholesale,
     which is why the three detail routes repeat `siteName` and `locale`. */
  metadataBase: new URL(SITE_URL),

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: "/",
    title: SITE_TITLE,
    description: SITE_TAGLINE,
  },

  /* Without a share image, `summary_large_image` would render an empty
     half-card, so the default is the honest small one; the pages that do have a
     photograph ask for the large card themselves. */
  twitter: { card: "summary" },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      {
        url: "/favicon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      className={`${cormorant.variable} ${inter.variable} ${vazirmatn.variable}`}
    >
      {/* No `dir` attribute is set: the page intentionally stays LTR. */}
      <body>
        {/* The studio and the site, as structured data: the same facts the page
            states, in the form a search engine can read without guessing at
            them. Inert markup — it paints nothing and reaches no network. */}
        <JsonLd data={graphJsonLd([organizationJsonLd(), websiteJsonLd()])} />
        {children}

        {/* Site-wide floating controls, mounted once here so every route — the
            home page, the magazine, the project gallery and each of their
            detail pages — gets them without opting in. Both are client
            components; the markup they render is static and hidden by default,
            so the server-rendered HTML and the first client render agree. */}
        <BackToTop />
        <PageTransition />
      </body>
    </html>
  );
}
