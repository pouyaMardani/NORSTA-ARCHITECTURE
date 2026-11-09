import Image from "next/image";

/**
 * The full-bleed parallax band between About and Work.
 *
 * A photograph that seems fixed while the page scrolls past it, then lets the
 * next section slide over it like a curtain — the infinite-window effect.
 *
 * The old way is `background-attachment: fixed`, which iOS Safari ignores, so
 * the band is built from a sticky window instead: a tall section (200svh)
 * whose inner frame sticks to the viewport top at 100svh, so the photograph
 * holds still for a full viewport of scrolling and Work then covers it. Pure
 * CSS, no JavaScript.
 *
 * The photograph is the studio's own villa still (`hero-villa.png`, 2880×1792
 * — the highest-resolution landscape the site owns, and the one the magazine
 * and the Instagram strip already borrow at small sizes). It is served through
 * `next/image`, which optimises the 6 MB source down to a sized WebP/AVIF, so
 * the band costs the page a fraction of the file. It loads lazily: the band
 * sits mid-page, below the fold.
 *
 * There is no copy on the band by design — the photograph is the whole
 * sentence, and the section it introduces (Work) carries the words. Moving the
 * band to another joint is one line in `app/page.tsx`.
 */
export default function ParallaxBand() {
  return (
    <section className="pxband">
      <div className="pxband-sticky">
        <Image
          src="/images/hero-villa.png"
          alt="ویلایی مدرن در غروب با استخر؛ کوهستان در پس‌زمینه"
          fill
          sizes="(max-width: 680px) 140vw, 100vw"
          quality={80}
        />
      </div>
    </section>
  );
}
