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
        <p>
          معماری‌ای که با سکوت، وزن و{" "}
          <br />
          .گذرِ آرام نور در فضا شکل می‌گیرد
        </p>
        <a href="#work" className="link-underline">
          مشاهده پروژه‌ها
        </a>
      </div>

      {/* The hero is inside the first viewport, so nothing here is gated on
          hydration: the media is simply static (a `data-reveal` would hide it
          until JS runs, and animating a full-viewport video layer is what made
          the entrance stutter) and the wordmark/copy animate from CSS. See
          `globals.css` → "Above-the-fold entrance". */}
      <div className="hero-image">
        {/* No `poster`: the band is already painted in the theme's own ground
            colour (`globals.css`) and the video fades in over it once it can
            play — `SiteInteractions` adds `is-ready` for that. A poster would
            have shown a second, unrelated picture for a moment first. */}
        <video
          className="hero-video"
          src="/images/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>

      {/* Without JS nothing would add `is-ready`, so the video would stay behind
          the ground colour for good — show it as plain media instead. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{ __html: ".hero-video{opacity:1}" }}
        />
      </noscript>

      <div className="scroll-cue">
        <a href="#services">
          <span>Scroll</span>
          <i />
        </a>
      </div>
    </section>
  );
}
