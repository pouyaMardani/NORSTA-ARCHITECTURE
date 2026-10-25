import Image from "next/image";

import { formatSampleNumber } from "@/content/samples";

import type { SampleDTO, SampleLabels } from "@/content/samples";

type Props = {
  sample: SampleDTO;
  /** Zero-based position on the filtered wall — the number printed on the label. */
  index: number;
  labels: SampleLabels;
  /** Registers the button so the viewer can hand focus back to it when it closes. */
  buttonRef: (node: HTMLButtonElement | null) => void;
  onOpen: () => void;
};

/**
 * One sample, hung.
 *
 * The whole frame is a single `<button>`: the wood, the mount, the photograph and
 * the label sit inside it as phrasing content (`<span>`, `<img>`), so the sample
 * is one large, unmissable tap target and one stop in the tab order — no
 * separate "view" link to hunt for, which is what makes the wall usable with a
 * thumb.
 *
 * Nothing about the frame is drawn by the photograph: the wood, the bevel, the
 * sheen on the glass and the spotlight above the frame are CSS layers of this
 * component, so the same frame reads correctly behind *any* image a record names
 * — including the temporary plates the library ships with.
 *
 * `data-wood` and `data-mount` carry the curator's choices from the record into
 * the stylesheet; both fall back to the library's default so a minimal record
 * still hangs a perfectly ordinary frame.
 */
export default function SampleFrame({ sample, index, labels, buttonRef, onOpen }: Props) {
  return (
    <button
      type="button"
      className="mf"
      ref={buttonRef}
      onClick={onOpen}
      data-wood={sample.wood ?? "oak"}
      data-mount={sample.mount ?? "slim"}
      aria-haspopup="dialog"
    >
      {/* The spotlight that falls on this frame from above. Painted before the
          frame so the wood always occludes it where they overlap. */}
      <span className="mf-light" aria-hidden="true" />

      <span className="mf-wood">
        <span className="mf-mount">
          <span className="mf-window">
            <Image
              src={sample.image.src}
              alt={sample.image.alt}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 860px) 46vw, (max-width: 1180px) 31vw, 23vw"
              style={{ objectFit: "cover" }}
            />
            {/* Sheen on the glass and the shadow the mount casts into the
                picture: two fixed layers, so the crop never looks pasted in. */}
            <span className="mf-glass" aria-hidden="true" />
            <span className="mf-inset" aria-hidden="true" />
          </span>
        </span>
      </span>

      <span className="mf-meta">
        <span className="mf-head">
          <span className="mf-no">{formatSampleNumber(index)}</span>
          <span className="mf-name">{sample.name}</span>
        </span>

        <span className="mf-line">
          {sample.finish ? <span className="mf-finish">{sample.finish}</span> : null}
          {sample.finish && sample.color ? <span className="mf-sep" aria-hidden="true" /> : null}
          {sample.color ? (
            <span className="mf-color">
              <i
                className="mf-chip"
                aria-hidden="true"
                style={sample.colorHex ? { background: sample.colorHex } : undefined}
              />
              {sample.color}
            </span>
          ) : null}
        </span>

        <span className="mf-foot">
          <span className="mf-tag">{sample.category}</span>
          <span className="mf-open" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <circle cx="10.8" cy="10.8" r="6.2" />
              <path d="M15.4 15.4 20.5 20.5" />
              <path d="M10.8 8.5v4.6M8.5 10.8h4.6" />
            </svg>
            {labels.open}
          </span>
        </span>
      </span>
    </button>
  );
}
