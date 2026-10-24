import Image from "next/image";

import {
  ACADEMY_CONFIG,
  resolveLessonVideo,
  type LessonDTO,
} from "@/content/academy";

/**
 * The lesson's media plate: the player, or the honest state of a lesson that has
 * no recording yet.
 *
 * `resolveLessonVideo` is the single decision point. It returns a video only when
 * the record carries a usable source, so a half-filled entry (an empty string, a
 * relative embed address) is reported as absent and lands on the placeholder
 * instead of rendering a player that cannot play.
 *
 * The source is rendered faithfully rather than guessed at:
 *   · `kind:"file"`    → a native `<video>` with controls and a poster that
 *                        falls back to the lesson's own cover;
 *   · `kind:"embed"`   → a titled `<iframe>`, lazily loaded, so a third-party
 *                        player costs nothing until the reader reaches it.
 *
 * The placeholder is a dark plate carrying the lesson's own photograph, pushed
 * out of focus, with the Persian explanation on top. It is deliberately a
 * *statement of status*, not a fake player: there is no play button to press, no
 * duration and no promise of a date. This is also the exact seam a licensed
 * player (SpotPlayer, for example) would slot into later — it would return its
 * own `LessonVideoDTO` from the same resolver and this component would render it
 * with no change.
 */
export default function LessonPlayer({ lesson }: { lesson: LessonDTO }) {
  const video = resolveLessonVideo(lesson);

  if (!video) {
    const { labels } = ACADEMY_CONFIG;

    return (
      <div className="aca-player aca-player-empty">
        {/* Decorative: the same still is the page's cover above, so repeating it
            as content would only duplicate the alt text. */}
        <div className="aca-player-plate" aria-hidden="true">
          <Image
            src={lesson.coverImage.src}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="aca-player-soon">
          <span className="aca-player-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <circle cx="12" cy="12" r="9.2" />
              <path d="M10.2 8.6 15.6 12l-5.4 3.4z" />
            </svg>
          </span>
          <p className="aca-player-soon-title">{labels.videoSoonTitle}</p>
          <p className="aca-player-soon-body">{labels.videoSoonBody}</p>
        </div>
      </div>
    );
  }

  if (video.kind === "file") {
    return (
      <div className="aca-player">
        <video
          className="aca-video"
          controls
          preload="metadata"
          playsInline
          poster={video.poster ?? lesson.coverImage.src}
        >
          <source src={video.src} type={video.mimeType} />
          {/* The fallback is a link, so a browser that cannot play the file still
              gives the reader a way to the media. */}
          <a className="aca-video-fallback" href={video.src} target="_blank" rel="noopener noreferrer">
            {lesson.title}
          </a>
        </video>
      </div>
    );
  }

  return (
    <div className="aca-player aca-player-frame">
      <iframe
        className="aca-frame"
        src={video.src}
        title={video.title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
