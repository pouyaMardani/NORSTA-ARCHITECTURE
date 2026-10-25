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
        <AcademyPromo />
        <Craftsman />
        <Contact />
        <InstagramShowcase />
      </main>
      <Lightbox />
      <Footer />
      <SiteInteractions />
    </>
  );
}

