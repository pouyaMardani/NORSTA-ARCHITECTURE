import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SiteInteractions from "@/components/SiteInteractions";
import { ACADEMY_CONFIG } from "@/content/academy";
import { SITE_LOCALE, SITE_NAME } from "@/lib/site";

/**
 * Shell for every academy route.
 *
 * The academy reuses what the site already has — the same header, the same
 * footer, the same reveal client — but puts them on the magazine's dark ground
 * (`--aca-*` tokens in `globals.css`, the same values the magazine uses), so
 * `/academy` reads as one room with the home page's academy block instead of a
 * separately designed course platform.
 *
 * `Nav` is route-aware and already knows `/academy` is a dark route, so its links
 * point back at the home page's sections and it renders in its dark variant.
 *
 * `title.template` gives every lesson page a consistent, unique document title:
 * the page sets its own `title` and the academy's name is appended to it.
 */
/** This segment's own summary line: the document description and the share card's text. */
const SECTION_DESCRIPTION =
  "آکادمی میکروسمنت نورستا: آموزش گامبهگام میکروسمنت از شناخت متریال و ابزار تا آمادهسازی زیرکار و اجرای سطحهای دکوراتیو.";

export const metadata: Metadata = {
  title: {
    default: ACADEMY_CONFIG.copy.name,
    template: `%s | ${ACADEMY_CONFIG.copy.name}`,
  },

  description: SECTION_DESCRIPTION,

  /* The academy's own canonical address: `/academy` is the one landing page of
     this segment, and every lesson below it states its own. */
  alternates: { canonical: "/academy" },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: "/academy",
    title: ACADEMY_CONFIG.copy.name,
    description: SECTION_DESCRIPTION,
  },

  twitter: {
    card: "summary",
    title: ACADEMY_CONFIG.copy.name,
    description: SECTION_DESCRIPTION,
  },
};

export default function AcademyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="aca-shell">
      <Nav />
      <main className="aca-main">{children}</main>
      <Footer />
      <SiteInteractions />

      {/* The reveal system needs scripting; without it the lesson copy must still
          be readable (and crawlable). */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".aca-shell [data-reveal]{opacity:1!important;transform:none!important}" +
              ".aca-shell .mask-title .line>span{transform:none!important}",
          }}
        />
      </noscript>
    </div>
  );
}
