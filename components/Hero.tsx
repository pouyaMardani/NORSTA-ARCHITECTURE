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
        {/* The lede is two authored lines, and the break holds at every width
            (`globals.css`). The full stop ends the sentence in the source: put at
            the head of the second line it was reordered to the far end of that
            line, and the moment a narrower measure dropped the break it drifted
            into the middle of the sentence. */}
        <p className="pcenter">
          میکروسمنت؛ سطحی یکپارچه که با سکوت، وزن و{" "}
          <br />
          .گذرِ آرام نور در فضا شکل می‌گیرد
        </p>
        <a href="#work" className="link-underline" data-magnetic>
          مشاهده پروژه‌ها
        </a>
      </div>

      {/* The hero is inside the first viewport, so nothing here is gated on
          hydration: the media is simply static (a `data-reveal` would hide it
          until JS runs, and animating a full-viewport video layer is what made
          the entrance stutter) and the wordmark/copy animate from CSS. See
          `globals.css` → "Above-the-fold entrance". */}
      <div className="hero-image">
        {/* The poster is the same villa the video slowly pans across
            (`hero-poster.jpg`, cut at build time from `hero-villa.png` by
            `scripts/make-og-images.mjs`), so the hero shows the villa the
            moment the page opens — while the video loads, and if it never
            plays — and the still hands over to the motion without a visible
            jump. Never a second, unrelated picture. */}
        <video
          className="hero-video"
          src="/images/hero.mp4"
          poster="/images/og/hero-poster.jpg"
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
        <a href="#applications">
          <span>Scroll</span>
          <i />
        </a>
      </div>
    </section>
  );
}
