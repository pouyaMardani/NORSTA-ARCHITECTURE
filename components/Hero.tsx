export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        {/* Brand wordmark — intentionally kept in English. */}
        <h1 className="hero-title">
          <span className="line">
            <span>NORSTA</span>
          </span>
        </h1>
        <p data-reveal="fade-up" data-delay="600">
          معماری‌ای که با سکوت، وزن و{" "}
          <br />
          گذرِ آرام نور در فضا شکل می‌گیرد.
        </p>
        <a href="#work" className="link-underline" data-reveal="fade-up" data-delay="800">
          مشاهده پروژه‌ها
        </a>
      </div>

      <div className="hero-image" data-reveal="hero-image">
        <video
          className="hero-video"
          src="/images/hero.mp4"
          poster="/images/hero-villa-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>

      <div className="scroll-cue" data-reveal="fade-up" data-delay="1100">
        <a href="#services">
          <span>پایین</span>
          <i />
        </a>
      </div>
    </section>
  );
}
