import type { Metadata } from "next";

import About from "@/components/About";
import AcademyPromo from "@/components/AcademyPromo";
import Articles from "@/components/Articles";
import Contact from "@/components/Contact";
import Craftsman from "@/components/Craftsman";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import InstagramShowcase from "@/components/InstagramShowcase";
import Lightbox from "@/components/Lightbox";
import MaterialsShowcase from "@/components/MaterialsShowcase";
import MicrocementSamples from "@/components/MicrocementSamples";
import Nav from "@/components/Nav";
import Process from "@/components/Process";
import SectionDivider from "@/components/SectionDivider";
import Services from "@/components/Services";
import SiteInteractions from "@/components/SiteInteractions";
import Work from "@/components/Work";

/**
 * The home page states its own canonical address and nothing else.
 *
 * Its title and summary are the root layout's (`SITE_TITLE` / `SITE_TAGLINE`),
 * and its share card is the layout's own `openGraph` defaults, which already
 * describe the home page — so this page adds only the one fact the layout cannot
 * know for it: the address it is served from. The relative path is resolved
 * against `metadataBase` (see `lib/site.ts`), so the tag reads as one absolute
 * URL rather than as a second spelling of the home page.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
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
        {/* The process and the questions sit directly under the hero: the
            four steps first, then the answers — before the services. */}
        <Process />
        <SectionDivider bg="var(--bg-2)" />
        <Faq />
        <SectionDivider bg="var(--bg)" />
        <Services />
        <SectionDivider bg="var(--bg)" />
        <About />
        <SectionDivider bg="var(--bg)" />
        <Work />
        <SectionDivider bg="var(--bg)" />
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
      <SiteInteractions />
    </>
  );
}

