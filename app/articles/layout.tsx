import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SiteInteractions from "@/components/SiteInteractions";
import { ARTICLE_CONFIG } from "@/content/articles";
import { SITE_LOCALE, SITE_NAME } from "@/lib/site";

/**
 * Shell for every magazine route.
 *
 * The pages below the home page reuse what the site already has — the same
 * header, the same footer, the same reveal client — but put them on the
 * magazine's dark ground, so `/articles` reads as one room with the home-page
 * section instead of a separately designed micro-site.
 *
 * `title.template` gives every article page a consistent, unique document title:
 * a page sets its own `title` and the magazine's name is appended to it.
 */
/** This segment's own summary line: the document description and the share card's text. */
const SECTION_DESCRIPTION =
  "یادداشت‌های استودیو نورستا درباره‌ی میکروسمنت، پتینه، ابزار و مصالح اجرا، آماده‌سازی بستر، نگهداری سطح و هزینه‌ی پروژه.";

export const metadata: Metadata = {
  /* The archive's own title carries the keywords, not just the magazine's
     name: eleven characters is not enough room for a result page. The article
     pages keep the short name as their suffix (`%s | مجله نورستا`). */
  title: {
    default: "مجله نورستا | میکروسمنت، پتینه و اجرای سطح",
    template: `%s | ${ARTICLE_CONFIG.magazine.name}`,
  },

  description: SECTION_DESCRIPTION,

  /* The archive's canonical address, declared on the segment because the
     filtered views (`/articles?category=…`) are this same page and must point at
     the unfiltered address rather than compete with it for the same words. */
  alternates: { canonical: "/articles" },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: "/articles",
    title: "مجله نورستا | میکروسمنت، پتینه و اجرای سطح",
    description: SECTION_DESCRIPTION,
    images: [
      {
        url: "/images/og/articles.jpg",
        width: 1200,
        height: 630,
        alt: "فضای داخلی سنگی با نور طبیعی و دیوارهای مادهای",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "مجله نورستا | میکروسمنت، پتینه و اجرای سطح",
    description: SECTION_DESCRIPTION,
  },
};

export default function ArticlesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="art-shell">
      {/* `Nav` is route-aware: on these pages its links point back at the home
          page's sections, and it renders in its dark variant. */}
      <Nav />
      <main className="art-main">{children}</main>
      <Footer />
      <SiteInteractions />

      {/* The reveal system needs scripting; without it the article copy must
          still be readable (and crawlable). */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".art-shell [data-reveal]{opacity:1!important;transform:none!important}" +
              ".art-shell .mask-title .line>span{transform:none!important}",
          }}
        />
      </noscript>
    </div>
  );
}
