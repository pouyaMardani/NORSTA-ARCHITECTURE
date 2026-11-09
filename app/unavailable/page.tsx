import type { Metadata } from "next";

import ErrorPage from "@/components/ErrorPage";
import { SITE_INSTAGRAM_URL } from "@/lib/site";

/**
 * The 503 page: the site, briefly away.
 *
 * This is a plain route (`/unavailable`), so it can be opened and checked
 * like any other page — but its real job is done by `middleware.ts`: with
 * `MAINTENANCE_MODE=1` every request is rewritten here and answered with
 * HTTP 503, while this page itself keeps rendering normally.
 */
export const metadata: Metadata = {
  title: "سرویس در دسترس نیست",
  robots: { index: false },
};

export default function UnavailablePage() {
  return (
    <ErrorPage
      code="503"
      eyebrow="خطای ۵۰۳"
      title="به‌زودی برمی‌گردیم"
      lede="سایت فعلا در دسترس نیست؛ در حال آماده‌سازی یا نگهداری کوتاهی هستیم. چند دقیقه‌ی دیگر دوباره سر بزنید؛ استودیو در اینستاگرام در دسترس است."
      primary={{ href: "/", label: "تلاش دوباره" }}
      secondary={{
        href: SITE_INSTAGRAM_URL,
        label: "اینستاگرام استودیو",
        external: true,
      }}
    />
  );
}
