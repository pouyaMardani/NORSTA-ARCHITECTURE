import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import RouteInteractions from "@/components/RouteInteractions";
import { PROJECT_CONFIG } from "@/content/projects";
import { SITE_LOCALE, SITE_NAME } from "@/lib/site";

/**
 * Shell for every project route.
 *
 * The project pages reuse what the site already has — the same header, the same
 * footer, the same interaction layer — on the site's own warm ground, so a
 * project reads as a room of the house rather than a separately designed
 * micro-site. The shell only adds the two things a page needs that the home page
 * gets from its own section: a height for a page that ends in the footer, and a
 * `<noscript>` rule so the reveal system can never hide copy from a reader
 * without scripting.
 *
 * `title.template` gives every project page a consistent, unique document title:
 * the page sets its own `title` and the gallery's name is appended to it.
 *
 * The shell also carries the gallery's own share card: the project pages state
 * their own (a cover photograph and a large card, via `detailMetadata`), so
 * this one is only the fallback a page without its own would wear.
 */
export const metadata: Metadata = {
  title: {
    default: "پروژه‌های نورستا | اجرای میکروسمنت و پتینه در تهران",
    template: `%s | ${PROJECT_CONFIG.section.name}`,
  },
  description:
    "پروژه‌های اجرای میکروسمنت و پتینه‌ی استودیو نورستا در تهران: نگاهی به تصمیم‌های طراحی، مصالح و جزئیات اجرا در گالری پروژه‌ها.",
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: "/projects",
    title: "پروژه‌های نورستا | اجرای میکروسمنت و پتینه در تهران",
    description:
      "پروژه‌های اجرای میکروسمنت و پتینه‌ی استودیو نورستا در تهران: نگاهی به تصمیم‌های طراحی، مصالح و جزئیات اجرا در گالری پروژه‌ها.",
  },
  twitter: {
    card: "summary",
    title: "پروژه‌های نورستا | اجرای میکروسمنت و پتینه در تهران",
    description:
      "پروژه‌های اجرای میکروسمنت و پتینه‌ی استودیو نورستا در تهران: نگاهی به تصمیم‌های طراحی، مصالح و جزئیات اجرا در گالری پروژه‌ها.",
  },
};

export default function ProjectsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="pj-shell">
      <Nav />
      <main className="pj-main">{children}</main>
      <Footer />
      <RouteInteractions />

      {/* The reveal system needs scripting; without it the project copy must
          still be readable (and crawlable). */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".pj-shell [data-reveal]{opacity:1!important;transform:none!important}",
          }}
        />
      </noscript>
    </div>
  );
}
