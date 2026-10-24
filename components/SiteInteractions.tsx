"use client";

import { useEffect } from "react";

/**
 * Faithful port of the reference page's `script.js`.
 *
 * All progressive-enhancement behaviour lives here so that the rest of the
 * page can stay a Server Component:
 *   - hero entrance + masked headline reveal
 *   - scroll reveal system (`[data-reveal]` + IntersectionObserver)
 *   - metric number counters (`[data-count]`)
 *   - hero parallax
 *   - sticky / auto-hiding navigation
 *   - project lightbox (open, close, prev, next, keyboard)
 */
export default function SiteInteractions() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeouts: number[] = [];
    const rafs: number[] = [];
    const cleanups: Array<() => void> = [];

    const later = (fn: () => void, ms: number) => {
      timeouts.push(window.setTimeout(fn, ms));
    };

    // ---------- Hero entrance ----------
    const hero = document.querySelector<HTMLElement>(".hero");
    if (hero) {
      rafs.push(
        requestAnimationFrame(() => {
          later(() => hero.classList.add("is-loaded"), 120);
        })
      );
    }

    // ---------- Reveal on scroll ----------
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let io: IntersectionObserver | null = null;

    if (reduced) {
      items.forEach((el) => el.classList.add("is-in"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.delay || "0", 10);
            if (delay) {
              later(() => el.classList.add("is-in"), delay);
            } else {
              el.classList.add("is-in");
            }
            io?.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      items.forEach((el) => io?.observe(el));

      // Safety net: if any element is still hidden after 4s, reveal it.
      later(() => {
        items.forEach((el) => {
          if (!el.classList.contains("is-in")) el.classList.add("is-in");
        });
      }, 4000);
    }

    // ---------- Reversible reveal on scroll ----------
    // `[data-reveal-cycle]` extends the system above with an exit state: the
    // marked section fades back out once it has left the viewport and fades in
    // again on the way back. It reuses the same `is-in` class name, but stays
    // observed, so one boolean per section drives both directions — there is no
    // threshold band to oscillate on and no repeated-animation glitch.
    //
    // The root is the viewport inset by 8% at the top and bottom: the section
    // counts as on-screen while it overlaps that band, which is what stops the
    // fade-out from firing while most of it is still visible.
    const cycles = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal-cycle]")
    );
    let ro: IntersectionObserver | null = null;

    if (cycles.length) {
      if (reduced) {
        cycles.forEach((el) => el.classList.add("is-in"));
      } else {
        ro = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              entry.target.classList.toggle("is-in", entry.isIntersecting);
            });
          },
          { rootMargin: "-8% 0px -8% 0px" }
        );
        cycles.forEach((el) => ro?.observe(el));
      }
    }

    // ---------- Number counters ----------
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    let co: IntersectionObserver | null = null;

    const runCount = (el: HTMLElement) => {
      const target = parseInt(el.dataset.count || "0", 10);
      const from = parseInt(el.dataset.from || "0", 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1600;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.round(from + (target - from) * eased);
        el.textContent = value + (t === 1 ? suffix : "");
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (counters.length) {
      if (reduced) {
        counters.forEach((el) => {
          el.textContent = (el.dataset.count || "") + (el.dataset.suffix || "");
        });
      } else {
        co = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                runCount(e.target as HTMLElement);
                co?.unobserve(e.target);
              }
            });
          },
          { threshold: 0.5 }
        );
        counters.forEach((el) => co?.observe(el));
      }
    }

    // ---------- Hero parallax ----------
    const heroImg = document.querySelector<HTMLElement>(".hero-image");
    if (heroImg && !reduced) {
      let raf = 0;
      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const y = Math.min(window.scrollY, 700);
          heroImg.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(${
            1 + Math.min(y, 400) * 0.0002
          })`;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        if (raf) cancelAnimationFrame(raf);
      });
    }

    // ---------- Sticky nav state ----------
    const nav = document.querySelector<HTMLElement>(".nav");
    if (nav) {
      let lastY = window.scrollY;
      let lockHide = 0;

      nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
        const onClick = () => {
          // Suppress auto-hide while smooth scrolling to a section.
          lockHide = Date.now() + 1200;
          nav.classList.remove("is-hidden");
        };
        a.addEventListener("click", onClick);
        cleanups.push(() => a.removeEventListener("click", onClick));
      });

      const onScroll = () => {
        const y = window.scrollY;
        const dy = y - lastY;
        nav.classList.toggle("is-scrolled", y > 40);
        if (Date.now() < lockHide) {
          nav.classList.remove("is-hidden");
        } else if (y > 240 && dy > 6) {
          nav.classList.add("is-hidden");
        } else if (dy < -6) {
          nav.classList.remove("is-hidden");
        }
        lastY = y;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    // ---------- Lightbox ----------
    const lb = document.getElementById("lightbox");
    if (lb) {
      const lbImg = lb.querySelector<HTMLImageElement>(".lb-img");
      const lbTitle = lb.querySelector<HTMLElement>(".lb-title");
      const lbLoc = lb.querySelector<HTMLElement>(".lb-loc");
      const btnClose = lb.querySelector<HTMLButtonElement>(".lb-close");
      const btnPrev = lb.querySelector<HTMLButtonElement>(".lb-prev");
      const btnNext = lb.querySelector<HTMLButtonElement>(".lb-next");

      const projects = Array.from(
        document.querySelectorAll<HTMLElement>(".proj")
      ).map((p) => {
        const img = p.querySelector<HTMLImageElement>("figure img");
        const title = p.querySelector("h3")?.textContent?.trim() || "";
        const loc = p.querySelector(".loc")?.textContent?.trim() || "";
        return {
          src: img?.getAttribute("src") || "",
          alt: img?.alt || "",
          title,
          loc,
          figure: p.querySelector("figure"),
          view: p.querySelector("[data-open-lightbox]"),
        };
      });

      let current = -1;
      const show = (i: number) => {
        if (i < 0 || i >= projects.length) return;
        current = i;
        const p = projects[i];
        if (lbImg) {
          lbImg.src = p.src;
          lbImg.alt = p.alt;
        }
        if (lbTitle) lbTitle.textContent = p.title;
        if (lbLoc) lbLoc.textContent = p.loc;
      };
      const open = (i: number) => {
        show(i);
        lb.classList.add("is-open");
        lb.setAttribute("aria-hidden", "false");
        document.body.classList.add("lb-open");
      };
      const close = () => {
        lb.classList.remove("is-open");
        lb.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lb-open");
      };
      const next = () => show((current + 1) % projects.length);
      const prev = () => show((current - 1 + projects.length) % projects.length);

      projects.forEach((p, i) => {
        if (p.figure) {
          const onFigureClick = (e: Event) => {
            e.preventDefault();
            open(i);
          };
          p.figure.addEventListener("click", onFigureClick);
          cleanups.push(() => p.figure?.removeEventListener("click", onFigureClick));
        }
        if (p.view) {
          const onViewClick = (e: Event) => {
            e.preventDefault();
            open(i);
          };
          p.view.addEventListener("click", onViewClick);
          cleanups.push(() => p.view?.removeEventListener("click", onViewClick));
        }
      });

      const onClose = () => close();
      const onNext = () => next();
      const onPrev = () => prev();
      const onBackdrop = (e: Event) => {
        if (e.target === lb) close();
      };
      const onKey = (e: KeyboardEvent) => {
        if (!lb.classList.contains("is-open")) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") next();
        else if (e.key === "ArrowLeft") prev();
      };

      btnClose?.addEventListener("click", onClose);
      btnNext?.addEventListener("click", onNext);
      btnPrev?.addEventListener("click", onPrev);
      lb.addEventListener("click", onBackdrop);
      document.addEventListener("keydown", onKey);

      cleanups.push(() => {
        btnClose?.removeEventListener("click", onClose);
        btnNext?.removeEventListener("click", onNext);
        btnPrev?.removeEventListener("click", onPrev);
        lb.removeEventListener("click", onBackdrop);
        document.removeEventListener("keydown", onKey);
      });
    }

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      rafs.forEach((r) => cancelAnimationFrame(r));
      io?.disconnect();
      co?.disconnect();
      ro?.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
