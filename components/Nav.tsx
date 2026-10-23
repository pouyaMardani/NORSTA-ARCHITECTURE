"use client";

import { useEffect, useState } from "react";

/**
 * Header + primary navigation.
 *
 * Desktop presentation is unchanged: the wordmark sits left and the four links
 * sit right. Below the mobile breakpoint the links collapse into a minimal
 * slide-down panel toggled by a hamburger button.
 *
 * The link elements are always mounted (the panel is shown/hidden with classes
 * rather than conditional rendering) so that `SiteInteractions` keeps its
 * delegated `#`-anchor listeners and its scroll-lock behaviour intact, and so
 * nothing re-mounts when the menu opens and closes.
 */

const LINKS = [
  { href: "#services", label: "Practice" },
  { href: "#about", label: "Studio" },
  { href: "#work", label: "Works" },
  { href: "#contact", label: "Contact" },
] as const;

/** Matches the hamburger breakpoint in `globals.css`. */
const MOBILE_QUERY = "(max-width: 680px)";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track the viewport so `inert`/`aria-hidden` are only applied on mobile.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Collapse the menu whenever the desktop layout takes over.
  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  // Close with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Freeze the page behind the open panel.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("menu-open");
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  // Only meaningful on mobile: while collapsed the links are inert and hidden
  // from assistive technology, so they can't be tabbed into or clicked.
  const collapsed = isMobile && !open;

  return (
    <header
      /* `className` is intentionally static: SiteInteractions writes
         `is-in` / `is-scrolled` / `is-hidden` onto this element imperatively,
         and a React-controlled className would wipe them on every re-render.
         Menu state is therefore exposed as a data attribute instead. */
      className="nav"
      data-reveal="fade-down"
      data-menu-open={open ? "true" : undefined}
    >
      <a href="#top" className="brand" onClick={() => setOpen(false)}>
        NORSTA HOME
      </a>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-toggle-box" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <nav
        id="primary-navigation"
        className="nav-links"
        aria-label="Primary"
        aria-hidden={collapsed}
        inert={collapsed}
      >
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
