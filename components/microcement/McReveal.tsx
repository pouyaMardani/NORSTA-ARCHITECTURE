"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reveal-on-scroll for the microcement section.
 *
 * The stylesheet only hides `[data-mc-reveal]` elements once `mc-js` is on
 * the shell, so a reader without scripting still sees everything. On mount —
 * and again on every route change inside the section, because the layout
 * persists across them — the observer fades each marked element in the first
 * time it enters the viewport, then stops watching it.
 *
 * Persian copy is never split into letters: the reveal moves whole blocks,
 * so the script's joining is never broken.
 */
export default function McReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const shell = document.querySelector(".mc");
    if (!shell) return;
    shell.classList.add("mc-js");

    const elements = Array.from(shell.querySelectorAll("[data-mc-reveal]"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("mc-revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("mc-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
