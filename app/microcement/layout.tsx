import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import McReveal from "@/components/microcement/McReveal";
import { SITE_LOCALE, SITE_NAME, absoluteUrl } from "@/lib/site";

/**
 * Shell for the microcement showcase (`/microcement` and its children).
 *
 * The section reuses the site's own header and footer, so the new «میکروسمنت»
 * menu entry and the way back stay exactly where a reader expects them —
 * but the ground between them is Jetton's off-white register (`.mc`), not
 * the home page's warm stone. The shell is a plain `<div dir="rtl">`: the
 * root `<html>` carries no `dir`, and each section sets its own, as the rest
 * of the site does.
 *
 * No `SiteInteractions` here: the section's reveal is `McReveal`, which is
 * scoped to `.mc` and re-runs on every route change inside the section, so
 * the gallery and the project pages get their reveals without depending on
 * the home page's system.
 *
 * ── THE CANONICAL ADDRESS ──────────────────────────────────────────────
 * The landing page is the section's canonical address; the gallery and the
 * project pages declare their own.
 */
export const metadata: Metadata = {
  title: "میکروسمنت؛ سطحی یکپارچه — نورستا",
  description:
    "میکروسمنت و پتینه؛ سطحی یکپارچه که با سکوت، وزن و گذرِ آرام نور در فضا شکل می‌گیرد. گزیده‌ی پروژه‌های اجرا شده‌ی نورستا در تهران، به رهبری مهندس افسانه مردانی.",
  alternates: {
    canonical: absoluteUrl("/microcement"),
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    title: "میکروسمنت؛ سطحی یکپارچه — نورستا",
    description:
      "میکروسمنت و پتینه؛ سطحی یکپارچه که با سکوت، وزن و گذرِ آرام نور در فضا شکل می‌گیرد. گزیده‌ی پروژه‌های اجرا شده‌ی نورستا در تهران.",
    url: absoluteUrl("/microcement"),
    images: [
      {
        url: "/images/og/microcement.jpg",
        width: 1200,
        height: 630,
        alt: "نشیمن با کف تیره، دیوار چوبی و پنجره‌های بزرگ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "میکروسمنت؛ سطحی یکپارچه — نورستا",
    description:
      "میکروسمنت و پتینه؛ سطحی یکپارچه که با سکوت، وزن و گذرِ آرام نور در فضا شکل می‌گیرد. گزیده‌ی پروژه‌های اجرا شده‌ی نورستا در تهران.",
  },
};

export default function MicrocementLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mc" dir="rtl" lang="fa">
      <Nav />
      <main>{children}</main>
      <Footer />
      <McReveal />
    </div>
  );
}
