import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-image" data-reveal="image-reveal">
        <Image
          src="/images/about-courtyard.png"
          alt="Sunlit stone interior with tree and stair"
          fill
          sizes="(max-width: 960px) 100vw, 48vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="about-copy">
        <span className="eyebrow" data-reveal="fade-up">
          STUDIO
        </span>
        <h2 className="mask-title" data-reveal="mask-line" data-delay="120">
          <span className="line">
            <span>Matter</span>
          </span>
          <span className="line">
            <span>&amp; Silence</span>
          </span>
        </h2>
        <p className="lede" data-reveal="fade-up" data-delay="320">
          We design buildings that hold their ground quietly. Stone, timber and light
          are treated as instruments — tuned to place, climate, and the unhurried
          rhythms of everyday life.
        </p>
        <p className="sub" data-reveal="fade-up" data-delay="460">
          Established in 2008 between Copenhagen and Kyoto, the atelier has delivered
          more than 140 works across residential, cultural and hospitality programmes.
        </p>

        <div className="metrics" data-reveal="metrics-rule">
          <div data-reveal="fade-up" data-delay="200">
            <span className="num" data-count="2008" data-from="2000">
              2000
            </span>
            <span className="label">ESTABLISHED</span>
          </div>
          <div data-reveal="fade-up" data-delay="340">
            <span className="num" data-count="140" data-suffix="+">
              0
            </span>
            <span className="label">WORKS BUILT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
