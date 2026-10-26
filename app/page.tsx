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
import MicrocementSamples from "@/components/MicrocementSamples";
import Nav from "@/components/Nav";
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
        <Services />
        <About />
        <Work />
        {/* The material library: the finishes behind the selected work, hung as
            framed samples. It reads the records in `content/samples`, so the wall
            grows, filters and re-orders without anything here changing. */}
        <MicrocementSamples />
        <Articles />
      
        <Craftsman />
        <AcademyPromo />
        <Contact />
        <InstagramShowcase />
      </main>
      <Lightbox />
      <Footer />
      <SiteInteractions />
    </>
  );
}

