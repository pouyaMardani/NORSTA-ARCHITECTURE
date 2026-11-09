"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { toPersianDigits } from "@/content/academy";

import type { AcademyLabels, LessonVideoDTO } from "@/content/academy";
import type { PointerEvent as ReactPointerEvent } from "react";

type Props = {
  /** A file video: the player owns its element, so an embed has nothing to play here. */
  video: Extract<LessonVideoDTO, { kind: "file" }>;
  /** The lesson's title, printed in the bar and used as the dialog's name. */
  title: string;
  /** Still shown before the first frame; falls back to the lesson's cover. */
  poster: string;
  labels: AcademyLabels;
  onClose: () => void;
};

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];
/** What the skip buttons and J/L move by. */
const SKIP_SECONDS = 10;
/** What the arrow keys move by. */
const SEEK_KEY_SECONDS = 5;
/** How long the controls stay up after the last movement while playing. */
const HIDE_MS = 3000;
/** Everything a keyboard can reach inside the dialog. */
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Seconds → `m:ss` (or `h:mm:ss`), in the site's own Persian digits. */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const body = `${hours > 0 ? String(minutes).padStart(2, "0") : minutes}:${String(secs).padStart(2, "0")}`;
  return toPersianDigits(hours > 0 ? `${hours}:${body}` : body);
}

/** A playback rate in Persian digits, with the Persian decimal separator. */
function formatRate(rate: number): string {
  return `${toPersianDigits(String(rate).replace(".", "٫"))}×`;
}

/**
 * The lesson player, in the image viewer's own register.
 *
 * A fixed dialog — dark scrim, charcoal panel, hairline bar, ivory type — so
 * watching a lesson feels like opening a sample, not leaving the site for a
 * third-party player. It is one native `<video>` and no library: the whole
 * player is the element's own events plus a `requestAnimationFrame` loop for
 * the progress, which is what keeps the seek bar moving smoothly instead of in
 * the element's own ~4 Hz `timeupdate` steps.
 *
 * ── WHAT IT DOES ───────────────────────────────────────────────────────────
 * Play/pause (the button, a click on the picture, Space or K), a seek bar that
 * is dragged with a finger or a mouse and read with a keyboard (arrows move
 * five seconds, Home/End jump to the ends), skip buttons and J/L for ten
 * seconds either way, a volume slider with a mute, a speed menu (۰٫۵×–۲×),
 * fullscreen and picture-in-picture, and a time readout in Persian digits.
 * While the picture is playing the chrome gets out of the way: after three
 * seconds without a movement the bar and the controls fade, and any movement
 * brings them back. The picture keeps playing behind them.
 *
 * ── WHY THE PROGRESS IS WRITTEN BY HAND ────────────────────────────────────
 * A seek is the one gesture that must never trail the finger. Routing it
 * through React state would re-render the whole dialog — the bar, the time,
 * the speed menu and the video node itself — on every pointer move. So the
 * drag writes the played fill, the knob and the time bubble straight to the
 * DOM and keeps the time it is showing in a ref; React only takes the value
 * back when the drag ends, which is what refreshes the readout and the
 * slider's accessible value. The same split is why the playing progress rides
 * `requestAnimationFrame` instead of state: one tiny style write per frame,
 * no render at all.
 *
 * ── HONESTY ────────────────────────────────────────────────────────────────
 * The badge in the bar says «ویدیوی آزمایشی» while the lesson plays a stand-in
 * recording, so no one mistakes the Pexels clip for the studio's own lesson.
 */
export default function VideoPlayer({ video, title, poster, labels, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const seekRef = useRef<HTMLDivElement | null>(null);
  const seekPlayedRef = useRef<HTMLDivElement | null>(null);
  const seekKnobRef = useRef<HTMLDivElement | null>(null);
  const seekBubbleRef = useRef<HTMLDivElement | null>(null);
  const hideTimer = useRef<number | null>(null);
  const lastVolume = useRef(1);
  const scrubbing = useRef(false);
  const scrubRatio = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [pipSupported, setPipSupported] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);
  const [controlsHidden, setControlsHidden] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const hasDuration = Number.isFinite(duration) && duration > 0;
  const playedRatio = hasDuration ? Math.min(1, Math.max(0, current / duration)) : 0;
  const bufferedRatio = hasDuration ? Math.min(1, Math.max(0, buffered / duration)) : 0;

  // ---------- Playback ----------
  const toggle = useCallback(() => {
    const element = videoRef.current;
    if (!element || error) return;
    setTouched(true);
    if (element.paused) {
      // Opening from a click is a user gesture, so sound is allowed; if the
      // browser still refuses, the promise rejects and the big play button
      // simply stays up instead of the picture freezing mid-gesture.
      void element.play().catch(() => {});
    } else {
      element.pause();
    }
  }, [error]);

  const skip = useCallback((delta: number) => {
    const element = videoRef.current;
    if (!element || !Number.isFinite(element.duration)) return;
    setTouched(true);
    element.currentTime = Math.min(
      Math.max(0, element.currentTime + delta),
      element.duration
    );
    setCurrent(element.currentTime);
  }, []);

  const setMutedState = useCallback((next: boolean) => {
    const element = videoRef.current;
    if (!element) return;
    element.muted = next;
    setMuted(next);
  }, []);

  const setVolumeValue = useCallback((next: number) => {
    const element = videoRef.current;
    if (!element) return;
    const value = Math.min(1, Math.max(0, next));
    element.volume = value;
    if (value > 0) {
      lastVolume.current = value;
      element.muted = false;
      setMuted(false);
    }
    setVolume(value);
  }, []);

  const setRateValue = useCallback((next: number) => {
    const element = videoRef.current;
    if (!element) return;
    element.playbackRate = next;
    setRate(next);
    setSpeedOpen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const element = dialogRef.current;
    if (!element) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void element.requestFullscreen().catch(() => {});
    }
  }, []);

  const togglePip = useCallback(async () => {
    const element = videoRef.current;
    if (!element) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await element.requestPictureInPicture();
      }
    } catch {
      // Not every browser offers it; the button is hidden where it is absent.
    }
  }, []);

  const retry = useCallback(() => {
    const element = videoRef.current;
    if (!element) return;
    setError(false);
    setWaiting(true);
    element.load();
    void element.play().catch(() => {});
  }, []);

  // ---------- The smooth progress ----------
  // While the picture plays, one animation frame writes the current time straight
  // to the seek bar's own nodes — no React render per frame. The readout above
  // the bar follows from the same value when the frame ends, which is why the
  // bar never trails the picture.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const element = videoRef.current;
      if (element) {
        if (!scrubbing.current) {
          setCurrent(element.currentTime);
          const ratio = Number.isFinite(element.duration) && element.duration > 0
            ? Math.min(1, Math.max(0, element.currentTime / element.duration))
            : 0;
          if (seekPlayedRef.current) {
            seekPlayedRef.current.style.width = `${ratio * 100}%`;
          }
          if (seekKnobRef.current) {
            seekKnobRef.current.style.insetInlineStart = `${ratio * 100}%`;
          }
        }
        if (element.buffered.length > 0) {
          setBuffered(element.buffered.end(element.buffered.length - 1));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // ---------- The seek bar ----------
  const ratioOf = useCallback((clientX: number): number => {
    const element = seekRef.current;
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    // The bar fills from the inline start: in this right-to-left register that
    // is the right edge, so the ratio is measured from the right.
    const ratio =
      getComputedStyle(element).direction === "rtl"
        ? (rect.right - clientX) / rect.width
        : (clientX - rect.left) / rect.width;
    return Math.min(1, Math.max(0, ratio));
  }, []);

  const paintScrub = useCallback((ratio: number) => {
    const percent = `${ratio * 100}%`;
    if (seekPlayedRef.current) seekPlayedRef.current.style.width = percent;
    if (seekKnobRef.current) seekKnobRef.current.style.insetInlineStart = percent;
    if (seekBubbleRef.current) {
      seekBubbleRef.current.style.insetInlineStart = percent;
      seekBubbleRef.current.textContent = formatTime(ratio * (duration || 0));
    }
  }, [duration]);

  const onSeekPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!hasDuration) return;
    event.preventDefault();
    seekRef.current?.setPointerCapture(event.pointerId);
    scrubbing.current = true;
    scrubRatio.current = ratioOf(event.clientX);
    paintScrub(scrubRatio.current);
    setCurrent(scrubRatio.current * duration);
    setTouched(true);
  };

  const onSeekPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!hasDuration) return;
    if (scrubbing.current) {
      scrubRatio.current = ratioOf(event.clientX);
      paintScrub(scrubRatio.current);
      setCurrent(scrubRatio.current * duration);
      return;
    }
    // Hovering the bar previews the time under the pointer.
    const ratio = ratioOf(event.clientX);
    if (seekBubbleRef.current) {
      seekBubbleRef.current.style.insetInlineStart = `${ratio * 100}%`;
      seekBubbleRef.current.textContent = formatTime(ratio * duration);
    }
    setHoverTime(ratio * duration);
  };

  const onSeekPointerUp = () => {
    if (!scrubbing.current) return;
    scrubbing.current = false;
    const element = videoRef.current;
    if (element && hasDuration) {
      element.currentTime = scrubRatio.current * duration;
      setCurrent(element.currentTime);
    }
    setHoverTime(null);
  };

  const onSeekKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hasDuration) return;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = (key: string) => (rtl ? key === "ArrowLeft" : key === "ArrowRight");
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      skip(forward(event.key) ? SEEK_KEY_SECONDS : -SEEK_KEY_SECONDS);
    } else if (event.key === "Home") {
      event.preventDefault();
      skip(-Infinity);
    } else if (event.key === "End") {
      event.preventDefault();
      skip(Infinity);
    } else if (event.key === "PageDown") {
      event.preventDefault();
      skip(-SKIP_SECONDS);
    } else if (event.key === "PageUp") {
      event.preventDefault();
      skip(SKIP_SECONDS);
    }
  };

  // ---------- Chrome that gets out of the way ----------
  const poke = useCallback(() => {
    setControlsHidden(false);
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControlsHidden(true);
    }, HIDE_MS);
  }, []);

  useEffect(() => {
    poke();
    return () => {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    };
  }, [poke]);

  // ---------- Mount: lock the page, focus the dialog, try to play ----------
  useEffect(() => {
    document.body.classList.add("vp-open");
    closeRef.current?.focus();
    setPipSupported(
      typeof document !== "undefined" && document.pictureInPictureEnabled
    );
    const element = videoRef.current;
    if (element) void element.play().catch(() => {});
    return () => document.body.classList.remove("vp-open");
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // The speed menu closes on a press anywhere outside it — no scrim needed.
  useEffect(() => {
    if (!speedOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const speed = (event.target as HTMLElement | null)?.closest(".vp-speed");
      if (!speed) setSpeedOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [speedOpen]);

  // ---------- Keyboard: close, trap, and the player's own shortcuts ----------
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const root = dialogRef.current;
      if (!root) return;

      if (event.key === "Escape") {
        if (speedOpen) {
          event.preventDefault();
          setSpeedOpen(false);
          return;
        }
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const reachable = Array.from(
          root.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter(
          (element) =>
            element.offsetParent !== null || element === document.activeElement
        );
        if (!reachable.length) return;
        const first = reachable[0];
        const last = reachable[reachable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!active || !root.contains(active)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      const target = event.target as HTMLElement | null;
      const onControl =
        target !== null &&
        (target.tagName === "BUTTON" || target.tagName === "INPUT");

      if (event.key === " " || event.key.toLowerCase() === "k") {
        // On a button or a slider the key already does its own job; anywhere
        // else it is the play/pause key.
        if (onControl) return;
        event.preventDefault();
        toggle();
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        // The seek bar handles its own arrows; the volume slider keeps its.
        if (target === seekRef.current || target?.tagName === "INPUT") return;
        // In this right-to-left register "onwards" travels to the left, so the
        // arrow keys follow the eye rather than the writing system.
        const rtl = window.getComputedStyle(root).direction === "rtl";
        const forward = rtl ? event.key === "ArrowLeft" : event.key === "ArrowRight";
        event.preventDefault();
        skip(forward ? SEEK_KEY_SECONDS : -SEEK_KEY_SECONDS);
        return;
      }

      if (event.key.toLowerCase() === "j") {
        event.preventDefault();
        skip(-SKIP_SECONDS);
        return;
      }
      if (event.key.toLowerCase() === "l") {
        event.preventDefault();
        skip(SKIP_SECONDS);
        return;
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleFullscreen();
        return;
      }
      if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        setMutedState(!muted);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, toggle, skip, toggleFullscreen, setMutedState, muted, speedOpen]);

  return (
    <div
      className="vp"
      data-playing={playing ? "true" : "false"}
      data-controls={controlsHidden ? "hidden" : "shown"}
      data-touched={touched ? "true" : "false"}
      onPointerMove={poke}
      onPointerDown={poke}
    >
      {/* A click on the scrim is the oldest way out of a picture, so it stays —
          decoration for the pointer, nothing at all for a screen reader. */}
      <div className="vp-scrim" onClick={onClose} aria-hidden="true" />

      <div
        className="vp-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} — ${labels.playVideo}`}
        dir="rtl"
      >
        <div className="vp-bar">
          <p className="vp-title">{title}</p>
          <span className="vp-badge">{labels.testVideo}</span>

          <div className="vp-tools">
            <button
              type="button"
              className="vp-close"
              ref={closeRef}
              onClick={onClose}
              aria-label={labels.closePlayer}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <path d="M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="vp-stage">
          <video
            ref={videoRef}
            className="vp-video"
            src={video.src}
            poster={poster}
            preload="metadata"
            playsInline
            onClick={toggle}
            onDoubleClick={toggleFullscreen}
            onLoadedMetadata={(event) => {
              setDuration(event.currentTarget.duration);
              setWaiting(false);
            }}
            onDurationChange={(event) => setDuration(event.currentTarget.duration)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onWaiting={() => setWaiting(true)}
            onPlaying={() => setWaiting(false)}
            onCanPlay={() => setWaiting(false)}
            onTimeUpdate={(event) => {
              if (!scrubbing.current) setCurrent(event.currentTarget.currentTime);
            }}
            onProgress={(event) => {
              const target = event.currentTarget;
              if (target.buffered.length > 0) {
                setBuffered(target.buffered.end(target.buffered.length - 1));
              }
            }}
            onVolumeChange={(event) => {
              setVolume(event.currentTarget.volume);
              setMuted(event.currentTarget.muted);
            }}
            onEnded={() => {
              setPlaying(false);
              setCurrent(duration);
            }}
            onError={() => {
              setError(true);
              setWaiting(false);
              setPlaying(false);
            }}
          />

          {waiting && !error ? (
            <span className="vp-spinner" role="status" aria-label={labels.playerLoading} />
          ) : null}

          {error ? (
            <div className="vp-error" role="alert">
              <p>{labels.playerError}</p>
              <button type="button" className="vp-retry" onClick={retry}>
                {labels.playerRetry}
              </button>
            </div>
          ) : null}

          {!playing && !error ? (
            <button
              type="button"
              className="vp-bigplay"
              onClick={toggle}
              aria-label={labels.play}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8.5 5.8v12.4c0 .9 1 1.5 1.8 1L19 13a1.2 1.2 0 0 0 0-2L10.3 4.8c-.8-.5-1.8.1-1.8 1Z" />
              </svg>
            </button>
          ) : null}

          <p className="vp-hints" aria-hidden="true">
            {labels.playerHint}
          </p>
        </div>

        <div className="vp-controls">
          <div
            className="vp-seek"
            ref={seekRef}
            role="slider"
            tabIndex={0}
            aria-label={labels.seek}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration) || 0}
            aria-valuenow={Math.round(current)}
            aria-valuetext={formatTime(current)}
            onPointerDown={onSeekPointerDown}
            onPointerMove={onSeekPointerMove}
            onPointerUp={onSeekPointerUp}
            onPointerCancel={onSeekPointerUp}
            onPointerLeave={() => {
              if (!scrubbing.current) setHoverTime(null);
            }}
            onKeyDown={onSeekKeyDown}
          >
            <span className="vp-seek-track" aria-hidden="true" />
            <span
              className="vp-seek-buffered"
              aria-hidden="true"
              style={{ width: `${bufferedRatio * 100}%` }}
            />
            <span
              className="vp-seek-played"
              ref={seekPlayedRef}
              aria-hidden="true"
              style={{ width: `${playedRatio * 100}%` }}
            />
            <span
              className="vp-seek-knob"
              ref={seekKnobRef}
              aria-hidden="true"
              style={{ insetInlineStart: `${playedRatio * 100}%` }}
            />
            <span
              className="vp-seek-bubble"
              ref={seekBubbleRef}
              aria-hidden="true"
              data-visible={hoverTime !== null || scrubbing.current ? "true" : "false"}
            >
              {formatTime(hoverTime ?? current)}
            </span>
          </div>

          <div className="vp-row">
            <button
              type="button"
              className="vp-btn"
              onClick={toggle}
              aria-label={playing ? labels.pause : labels.play}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8.5 5.8v12.4c0 .9 1 1.5 1.8 1L19 13a1.2 1.2 0 0 0 0-2L10.3 4.8c-.8-.5-1.8.1-1.8 1Z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="vp-btn"
              onClick={() => skip(-SKIP_SECONDS)}
              aria-label={labels.skipBack}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <polyline points="1 4 1 10 7 10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" strokeLinecap="round" />
                <text x="12" y="15.5" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none">
                  ۱۰
                </text>
              </svg>
            </button>

            <button
              type="button"
              className="vp-btn"
              onClick={() => skip(SKIP_SECONDS)}
              aria-label={labels.skipForward}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <polyline points="23 4 23 10 17 10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" strokeLinecap="round" />
                <text x="12" y="15.5" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none">
                  ۱۰
                </text>
              </svg>
            </button>

            <span className="vp-time" role="timer">
              {formatTime(current)} / {formatTime(duration)}
            </span>

            <span className="vp-spacer" aria-hidden="true" />

            <span className="vp-volume">
              <button
                type="button"
                className="vp-btn"
                onClick={() => setMutedState(!muted)}
                aria-label={muted || volume === 0 ? labels.unmute : labels.mute}
              >
                {muted || volume === 0 ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" stroke="none" />
                    <path d="m16 9 5 6M21 9l-5 6" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" stroke="none" />
                    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                className="vp-volume-range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(event) => setVolumeValue(Number(event.currentTarget.value))}
                aria-label={labels.volume}
              />
            </span>

            <span className="vp-speed">
              <button
                type="button"
                className="vp-btn vp-speed-btn"
                onClick={() => setSpeedOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={speedOpen}
                aria-label={labels.speed}
              >
                {formatRate(rate)}
              </button>
              {speedOpen ? (
                <span className="vp-speed-menu" role="menu" aria-label={labels.speed}>
                  {RATES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className="vp-speed-item"
                      role="menuitemradio"
                      aria-checked={value === rate}
                      onClick={() => setRateValue(value)}
                    >
                      {formatRate(value)}
                    </button>
                  ))}
                </span>
              ) : null}
            </span>

            {pipSupported ? (
              <button
                type="button"
                className="vp-btn"
                onClick={() => void togglePip()}
                aria-label={labels.pip}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="2.5" y="5" width="19" height="13" rx="2" />
                  <rect x="12.5" y="11" width="6" height="4" rx="1" fill="currentColor" stroke="none" />
                </svg>
              </button>
            ) : null}

            <button
              type="button"
              className="vp-btn"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? labels.exitFullscreen : labels.fullscreen}
            >
              {fullscreen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
