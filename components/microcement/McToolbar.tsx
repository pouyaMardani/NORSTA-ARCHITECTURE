import type { ReactNode } from "react";

/**
 * The toolbar strip under a hero: a hairline top border with three mono
 * items spread across it. Rendered in order; in the section's RTL the first
 * item sits on the right, as Jetton's sits on the left.
 */
export default function McToolbar({
  items,
}: Readonly<{ items: [ReactNode, ReactNode, ReactNode] }>) {
  return (
    <div className="mc-toolbar">
      {items.map((item, index) => (
        <span key={index} className="mc-mono">
          {item}
        </span>
      ))}
    </div>
  );
}
