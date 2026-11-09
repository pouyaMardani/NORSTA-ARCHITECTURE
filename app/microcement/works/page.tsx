import type { Metadata } from "next";

import NextPageBlock from "@/components/microcement/NextPageBlock";
import WorksGallery from "@/components/microcement/WorksGallery";
import { SITE_LOCALE, SITE_NAME, absoluteUrl } from "@/lib/site";

/**
 * The Works gallery (`/microcement/works`).
 *
 * A server shell around the interactive gallery: the metadata lives here,
 * the state (grid/list, category filter) lives in `WorksGallery`, and the
 * next-page block below it is Jetton's own closing pattern — a huge linked
 * title back to the home page.
 */
export const metadata: Metadata = {
  title: "آثار میکروسمنت — نورستا",
  description:
    "گزیده‌ی پروژه‌های اجرای میکروسمنت و پتینه‌ی نورستا در تهران — هر پروژه، هر فضا، یک رویکرد: ایده‌ی محکم، اجرای صادقانه و سطحی که فریاد نمی‌زند.",
  alternates: {
    canonical: absoluteUrl("/microcement/works"),
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    title: "آثار میکروسمنت — نورستا",
    description:
      "گزیده‌ی پروژه‌های اجرای میکروسمنت و پتینه‌ی نورستا در تهران — هر پروژه، هر فضا، یک رویکرد: ایده‌ی محکم، اجرای صادقانه و سطحی که فریاد نمی‌زند.",
    url: absoluteUrl("/microcement/works"),
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
    title: "آثار میکروسمنت — نورستا",
    description:
      "گزیده‌ی پروژه‌های اجرای میکروسمنت و پتینه‌ی نورستا در تهران — هر پروژه، هر فضا، یک رویکرد: ایده‌ی محکم، اجرای صادقانه و سطحی که فریاد نمی‌زند.",
  },
};

export default function MicrocementWorksPage() {
  return (
    <>
      <WorksGallery />
      <NextPageBlock
        num="۰۳"
        title="نورستا"
        sub="بازگشت به خانه — استودیوی میکروسمنت و پتینه"
        href="/"
        vertical="NORSTA"
        label="بازگشت به صفحه‌ی اصلی"
      />
    </>
  );
}
