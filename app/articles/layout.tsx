import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SiteInteractions from "@/components/SiteInteractions";
import { ARTICLE_CONFIG } from "@/content/articles";

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
export const metadata: Metadata = {
  title: {
    default: ARTICLE_CONFIG.magazine.name,
    template: `%s | ${ARTICLE_CONFIG.magazine.name}`,
  },
  description:
    "یادداشت‌های استودیو نورستا درباره‌ی میکروسمنت، پتینه، مصالح و اجرای سطح‌های معماری.",
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
