import type { Metadata } from "next";

import About from "@/components/About";
import AcademyPromo from "@/components/AcademyPromo";
import Articles from "@/components/Articles";
import Contact from "@/components/Contact";
import Craftsman from "@/components/Craftsman";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import InstagramShowcase from "@/components/InstagramShowcase";
import Lightbox from "@/components/Lightbox";
import MaterialsShowcase from "@/components/MaterialsShowcase";
import MicrocementSamples from "@/components/MicrocementSamples";
import Nav from "@/components/Nav";
import ParallaxBand from "@/components/ParallaxBand";
import Process from "@/components/Process";
import Results from "@/components/Results";
import SectionDivider from "@/components/SectionDivider";
import SectionNav from "@/components/SectionNav";
import SiteInteractions from "@/components/SiteInteractions";
import { SITE_LOCALE, SITE_NAME } from "@/lib/site";

/**
 * The home page states its own title, summary and share card — the one page
 * whose words a search engine weighs most.
 *
 * The root layout's `NORSTA HOME` and the poetic tagline stay as the brand's
 * own defaults for every page that does not set its own, but a Persian reader
 * searching for «میکروسمنت» would never meet them: this page's document title
 * and description therefore name what the studio does, where, and with what —
 * میکروسمنت و پتینه، اجرا در تهران، متریال و ابزار، نمونه و آموزش — in the
 * order a result page reads them. The share card carries the same words and
 * the villa plate (`public/images/og/home.jpg`, cut at build time by
 * `scripts/make-og-images.mjs`), so a shared link shows the studio's own
 * photograph instead of an empty half-card.
 */
const HOME_TITLE = "نورستا | میکروسمنت، پتینه و اجرای سطح در تهران";
const HOME_DESCRIPTION =
  "استودیو نورستا؛ اجرای میکروسمنت و پتینه در تهران — کف، دیوار، حمام و آشپزخانه، با متریال و ابزار اجرای میکروسمنت، نمونه‌های رنگ و بافت و آموزش اجرا.";
const HOME_OG_IMAGE = {
  url: "/images/og/home.jpg",
  width: 1200,
  height: 630,
  alt: "ویلایی با سطوح ساده‌ی میکروسمنت و پنجره‌های بزرگ",
};

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,

  /* The relative path is resolved against `metadataBase` (see `lib/site.ts`),
     so the tag reads as one absolute URL rather than as a second spelling of
     the home page. */
  alternates: { canonical: "/" },

  /* A page that states its own `openGraph` replaces the layout's wholesale,
     so the site's name and language are repeated here alongside the plate. */
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [HOME_OG_IMAGE],
  },

  /* The plate is a real photograph now, so the card is the large one. */
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* The joints: one simple divider between every two sections — a
            beautiful line, broken in the middle, in the site's own language.
            Its ground is the section above's own colour, so it never reads
            as a stripe of the wrong colour where two dark sections meet. See
            `components/SectionDivider.tsx`. */}
        <SectionDivider bg="var(--bg)" />
        {/* The process sits directly under the hero, before the results. */}
        <Process />
        <SectionDivider bg="var(--bg-2)" />
        <Results />
        <SectionDivider bg="#fff" />
        <About />
        {/* The full-bleed parallax band stands in for the divider here: the
            villa photograph holds still while the page scrolls, then the
            materials showcase slides over it — the joint between the story
            and the catalogue. */}
        <ParallaxBand />
        <MaterialsShowcase />
        <SectionDivider bg="var(--bg)" />
        <MicrocementSamples />
        <SectionDivider bg="#100e0b" tone="dark" />
        <Articles />
        <SectionDivider bg="#100e0b" tone="dark" />
        <Craftsman />
        <SectionDivider bg="var(--bg-2)" />
        <AcademyPromo />
        <SectionDivider bg="#100e0b" tone="dark" />
        <Contact />
        <SectionDivider bg="var(--bg)" />
        <InstagramShowcase />
      </main>
      <Lightbox />
      <Footer />
      <SectionNav />
      <SiteInteractions />
    </>
  );
}

