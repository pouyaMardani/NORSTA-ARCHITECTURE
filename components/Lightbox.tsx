/**
 * Lightbox markup. Purely presentational: every interaction (open / close /
 * prev / next / keyboard) is wired up by `SiteInteractions`, mirroring the
 * single delegated script of the reference page.
 */
export default function Lightbox() {
  return (
    <div
      className="lightbox"
      id="lightbox"
      aria-hidden="true"
      role="dialog"
      aria-label="Project image viewer"
    >
      <button className="lb-close" type="button" aria-label="Close">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>
      <button className="lb-nav lb-prev" type="button" aria-label="Previous">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <button className="lb-nav lb-next" type="button" aria-label="Next">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <figure className="lb-stage">
        {/* eslint-disable-next-line @next/next/no-img-element -- the lightbox
            needs intrinsic (auto) sizing with object-fit:contain, which the
            reference achieves with a plain <img>; next/image would force
            fixed dimensions. */}
        <img className="lb-img" alt="" />
        <figcaption className="lb-cap">
          <span className="lb-title" />
          <span className="lb-loc" />
        </figcaption>
      </figure>
    </div>
  );
}
