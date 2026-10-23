import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";
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
      <body>{children}</body>
    </html>
  );
}
