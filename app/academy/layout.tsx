import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SiteInteractions from "@/components/SiteInteractions";
import { ACADEMY_CONFIG } from "@/content/academy";

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
export const metadata: Metadata = {
  title: {
    default: ACADEMY_CONFIG.copy.name,
    template: `%s | ${ACADEMY_CONFIG.copy.name}`,
  },
  description:
    "آکادمی میکروسمنت نورستا: آموزش گامبهگام میکروسمنت از شناخت متریال و ابزار تا آمادهسازی زیرکار و اجرای سطحهای دکوراتیو.",
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
