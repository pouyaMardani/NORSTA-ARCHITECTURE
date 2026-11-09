import type { Metadata } from "next";

import ErrorPage from "@/components/ErrorPage";

/**
 * The global 404.
 *
 * Next.js renders this file for every URL no route claims, with HTTP 404, and
 * it stays inside the site's own chrome (the header and the footer) rather
 * than falling back to the framework's bare default error page. The magazine,
 * academy and project segments keep their own narrower 404s for a wrong slug
 * inside their shell; this one is for a wrong address anywhere else.
 */
export const metadata: Metadata = {
  title: "صفحه پیدا نشد",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      eyebrow="خطای ۴۰۴"
      title="این صفحه اینجا نیست"
      lede="نشانی‌ای که باز کرده‌اید به صفحه‌ای در سایت NORSTA اشاره نمی‌کند؛ ممکن است اشتباه تایپ شده باشد یا صفحه جابه‌جا شده باشد. به خانه برگردید یا یکی از بخش‌های سایت را از فهرست بالا انتخاب کنید."
      primary={{ href: "/", label: "بازگشت به خانه" }}
      secondary={{ href: "/#work", label: "دیدن پروژه‌ها" }}
    />
  );
}
