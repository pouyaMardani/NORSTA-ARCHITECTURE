"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import SampleFrame from "@/components/SampleFrame";
import SampleViewer from "@/components/SampleViewer";

import { countByCategory, filterByCategory, toPersianDigits } from "@/content/samples";

import type { SampleCategory, SampleDTO, SampleLabels } from "@/content/samples";

type Props = {
  /** The curated wall, in the order `content/samples` decided. */
  samples: SampleDTO[];
  /** The families actually used by `samples`, in the library's own order. */
  categories: SampleCategory[];
  labels: SampleLabels;
  /** Accessible name of the wall itself — the section's name, from the config. */
  wallLabel: string;
  legendLabel: string;
  allLabel: string;
  wallNote: string;
};

/**
 * The wall and the viewer, and the only interactive part of the section.
 *
 * ── WHY THE STATE IS HERE ──────────────────────────────────────────────────
 * The filter and the open sample are two views of one thing: the wall. Keeping
 * both in one client component means the frames stay a pure, server-friendly
 * `<button>` (`SampleFrame` has no state at all) and the viewer never has to
 * guess which list it is showing — it is handed the *filtered* list, so its
 * prev/next walk exactly what the visitor can see.
 *
 * Opening a sample carries the wall's index into the viewer, and closing it hands
 * focus back to the frame that was opened. That round trip is the whole reason
 * the frame refs are collected here.
 *
 * ── DERIVED, NEVER STORED ──────────────────────────────────────────────────
 * The filtered wall and the per-family counts come from `content/samples`, so a
 * new record appears on the wall, gains a chip if it belongs to a new family, and
 * is counted correctly — with no change to this file.
 */
export default function SampleWall({
  samples,
  categories,
  labels,
  wallLabel,
  legendLabel,
  allLabel,
  wallNote,
}: Props) {
  const [category, setCategory] = useState<SampleCategory | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const wall = useMemo(() => filterByCategory(samples, category), [samples, category]);
  const counts = useMemo(() => countByCategory(samples), [samples]);

  /** Every frame's button, in wall order, so focus can return after a close. */
  const frames = useRef<Array<HTMLButtonElement | null>>([]);
  const openedFrom = useRef<number | null>(null);

  const open = useCallback((index: number) => {
    openedFrom.current = index;
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    const target = openedFrom.current;
    openedFrom.current = null;
    if (target === null) return;
    // After the dialog has been removed, not before: focusing a node React is
    // still tearing down would be thrown away.
    requestAnimationFrame(() => frames.current[target]?.focus());
  }, []);

  const select = useCallback((next: SampleCategory | null) => {
    setCategory(next);
    // The wall re-flows, so an open viewer would be standing over a list it no
    // longer matches. Close it and clear the stale refs in the same commit.
    setOpenIndex(null);
    openedFrom.current = null;
    frames.current = [];
  }, []);

  const openSample = openIndex === null ? null : wall[openIndex];

  return (
    <div className="mfw">
      <div className="mfw-bar">
        <fieldset className="mfw-filters">
          <legend className="mfw-legend">{legendLabel}</legend>

          <button
            type="button"
            className="mfw-chip"
            aria-pressed={category === null}
            onClick={() => select(null)}
          >
            <span className="mfw-chip-name">{allLabel}</span>
            <span className="mfw-chip-count">{toPersianDigits(samples.length)}</span>
          </button>

          {categories.map((family) => (
            <button
              key={family}
              type="button"
              className="mfw-chip"
              aria-pressed={category === family}
              onClick={() => select(family)}
            >
              <span className="mfw-chip-name">{family}</span>
              <span className="mfw-chip-count">{toPersianDigits(counts[family] ?? 0)}</span>
            </button>
          ))}
        </fieldset>

        <p className="mfw-note" aria-hidden="true">
          <span className="mfw-note-rule" />
          {wallNote}
        </p>
      </div>

      {/* Each frame carries its own reveal, so the wall arrives frame by frame
          instead of as one block. The stagger is capped, which keeps a long
          library from ending in a slow trickle. */}
      <ul className="mfw-grid" aria-label={wallLabel}>
        {wall.map((sample, index) => (
          <li
            className="mfw-cell"
            key={sample.id}
            data-reveal="fade-up"
            data-delay={String(Math.min(index, 7) * 90)}
          >
            <SampleFrame
              sample={sample}
              index={index}
              labels={labels}
              buttonRef={(node) => {
                frames.current[index] = node;
              }}
              onOpen={() => open(index)}
            />
          </li>
        ))}
      </ul>

      {openSample ? (
        <SampleViewer
          samples={wall}
          index={openIndex as number}
          labels={labels}
          onNavigate={setOpenIndex}
          onClose={close}
        />
      ) : null}
    </div>
  );
}
