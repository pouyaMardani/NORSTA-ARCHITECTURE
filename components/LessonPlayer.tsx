"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import VideoPlayer from "@/components/VideoPlayer";
import {
  ACADEMY_CONFIG,
  formatLessonDuration,
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
 *   · `kind:"file"`    → the lesson's own cover with a play button; pressing it
 *                        opens the custom player — a dialog in the image
 *                        viewer's own register — which plays the file;
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
  const [open, setOpen] = useState(false);
  const playButton = useRef<HTMLButtonElement | null>(null);

  // Closing hands the focus back to the play button that opened the player, so
  // a keyboard reader lands exactly where they left the page.
  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => playButton.current?.focus());
  }, []);

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
    const { labels } = ACADEMY_CONFIG;
    const duration = formatLessonDuration(lesson.durationMinutes);

    return (
      <>
        {/* The whole plate is the play button: the cover, a veil for contrast,
            the play disc and the two badges. It is a plain block button — no
            flex — so the button's own user-agent `align-items` can never
            shrink-wrap its children the way it did to the gallery's frames. */}
        <button
          type="button"
          className="aca-player aca-player-play"
          ref={playButton}
          onClick={() => setOpen(true)}
          aria-label={`${labels.playVideo}: ${lesson.title}`}
        >
          <span className="aca-player-cover" aria-hidden="true">
            <Image
              src={lesson.coverImage.src}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: "cover" }}
            />
          </span>
          <span className="aca-player-veil" aria-hidden="true" />
          <span className="aca-player-playbtn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.5 5.8v12.4c0 .9 1 1.5 1.8 1L19 13a1.2 1.2 0 0 0 0-2L10.3 4.8c-.8-.5-1.8.1-1.8 1Z" />
            </svg>
          </span>
          <span className="aca-player-badges" aria-hidden="true">
            {duration ? (
              <span className="aca-player-duration">{duration}</span>
            ) : null}
            <span className="aca-player-test">{labels.testVideo}</span>
          </span>
        </button>

        {open ? (
          <VideoPlayer
            video={video}
            title={lesson.title}
            poster={video.poster ?? lesson.coverImage.src}
            labels={labels}
            onClose={close}
          />
        ) : null}
      </>
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
