import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";

import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";

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
  title: "NORSTA HOME",
  description:
    "معماری‌ای که با سکوت، وزن و گذرِ آرام نور در فضا شکل می‌گیرد.",

  /* The mark: a drawn `N` sealed in a circle — an ink medallion with an ivory
     rim and letter. Cut by `scripts/make-favicon.mjs` (run it after touching
     the geometry there), served from `public/`, and inherited by every route
     through this root layout.

     Order matters only as a tie-break, so the two vectors come last and win:
     `/favicon.svg` for light chrome, `/favicon-dark.svg` — the same drawing
     inverted, ivory medallion — behind a `prefers-color-scheme: dark` media
     query. The PNGs and the ICO are the exact-pixel and legacy fallbacks, and
     Safari, which ignores SVG favicons, gets the charcoal medallion from
     `/favicon.ico` — legible on a dark tab because of its ivory rim. */
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
