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
import SectionBridge from "@/components/SectionBridge";
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
        {/* The joints: one bridge between every two sections, each in the two
            sections' own colours. `fold` is where the page enters the dark,
            `curve` where it leaves it, `mist` where two sections of one colour
            need air, `veil` where the joint should be felt and not seen. See
            `components/SectionBridge.tsx`. */}
        <SectionBridge variant="mist" from="var(--bg)" to="var(--bg)" />
        <Services />
        <SectionBridge variant="veil" from="var(--bg)" to="var(--bg)" />
        <About />
        <SectionBridge
          variant="curve"
          from="var(--bg)"
          to="var(--bg)"
          accent="var(--bg-2)"
        />
        <Work />
        <SectionBridge variant="mist" from="var(--bg)" to="var(--bg)" />
        <MaterialsShowcase />
        <SectionBridge variant="fold" from="var(--bg)" to="#100e0b" />
        <MicrocementSamples />
        <SectionBridge variant="mist" from="#100e0b" to="#100e0b" tone="dark" />
        <Articles />
        <SectionBridge variant="curve" from="#100e0b" to="var(--bg-2)" />
        <Craftsman />
        <SectionBridge variant="fold" from="var(--bg-2)" to="#100e0b" />
        <AcademyPromo />
        <SectionBridge variant="curve" from="#100e0b" to="var(--bg)" />
        <Contact />
        <SectionBridge variant="veil" from="var(--bg)" to="var(--bg)" />
        <InstagramShowcase />
      </main>
      <Lightbox />
      <Footer />
      <SiteInteractions />
    </>
  );
}

