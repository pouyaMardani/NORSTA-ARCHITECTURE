"use client";

import { useState } from "react";

/**
 * Frequently asked questions — the reference template's FAQ section, in the
 * studio's voice: the title column on one side, a four-item accordion on the
 * other, one open at a time, the first one open on arrival.
 *
 * The reference builds the accordion on Bootstrap's collapse; this one is a
 * small React accordion instead — a real `<button>` per question with
 * `aria-expanded`, and the panel opens with the `grid-template-rows: 0fr → 1fr`
 * transition, so the height animation is smooth at any answer length with no
 * measured pixels. The icon is the reference's own device: a plus that turns
 * into a minus when its item opens.
 *
 * The answers are the site's own facts, not the template's: the surfaces
 * microcement is applied to come from the magazine's account (“روی کف، دیوار،
 * پله و سطوح منحنی”), the samples answer from the samples catalogue, and the
 * sealer from the magazine's wet-rooms piece. Nothing here promises a
 * duration or a price the studio has not published.
 */
type FaqItem = { q: string; a: string };

const ITEMS: FaqItem[] = [
  {
    q: "روند کار شما چطور است؟",
    a: "روند ما چهار گام دارد: شناخت فضا، انتخاب نمونه و رنگ، اجرا و در پایان تحویل و نگهداری. در هر گام، تصمیم‌ها با شما و روی نمونه‌های واقعی گرفته می‌شود.",
  },
  {
    q: "میکروسمنت روی چه سطوحی اجرا می‌شود؟",
    a: "روی کف، دیوار، پله و سطوح منحنی؛ دیوارهای داخلی در فضای خشک و مرطوب، کف فضاهای مسکونی و تجاری، سرویس‌های بهداشتی و حمام با سیلر مناسب، و پله و مبلمان ثابت.",
  },
  {
    q: "آیا فقط پروژه‌های بزرگ انجام می‌دهید؟",
    a: "نه؛ از یک دیوار یا یک حمام کوچک تا یک خانه‌ی کامل، شیوه‌ی کار یکی است: شناخت فضا، نمونه و اجرا.",
  },
  {
    q: "می‌توان رنگ یا بافت سفارشی خواست؟",
    a: "بله؛ رنگ و بافت از میان نمونه‌های استودیو انتخاب می‌شود و پرداخت هر سطح را می‌توان متناسب با نور و کاربری همان فضا ساخت.",
  },
];

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toPersianDigits(value: number): string {
  return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export default function Faq() {
  // The reference opens its first item on arrival.
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="faq"
      dir="rtl"
      aria-labelledby="faq-title"
    >
      <div className="faq-grid">
        <div className="faq-intro">
          <span className="eyebrow-roll" data-reveal="fade-up">
            <span className="eyebrow-roll-text" aria-hidden="true">
              <span className="text-1">پرسش‌های متداول</span>
              <span className="text-2">پرسش‌های متداول</span>
            </span>
            <span className="eyebrow-roll-arrow" aria-hidden="true">
              <svg viewBox="0 0 11 11" fill="none">
                <path
                  d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z"
                  fill="currentColor"
                />
              </svg>
              <svg viewBox="0 0 11 11" fill="none">
                <path
                  d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="sr-only">پرسش‌های متداول</span>
          </span>
          <h2
            id="faq-title"
            className="faq-title mask-title"
            data-reveal="mask-line"
          >
            <span className="line">
              <span>پرسش‌های</span>
            </span>
            <span className="line">
              <span>پرتکرار</span>
            </span>
          </h2>
          <p className="faq-lede" data-reveal="fade-up" data-delay="120">
            پرسش‌های شما درباره‌ی روند کار، خدمات و شیوه‌ی همکاری ما — پاسخ
            داده شده است.
          </p>
        </div>

        <div className="faq-list">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="faq-item-wrap"
                data-reveal="fade-up"
                data-delay={i ? String(i * 80) : undefined}
              >
                <div className={`faq-item${isOpen ? " is-open" : ""}`}>
                <div className="faq-header">
                  <span className="faq-num" aria-hidden="true">
                    {toPersianDigits(i + 1)}
                  </span>
                  <button
                    type="button"
                    className="faq-button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {item.q}
                  </button>
                  <span className="faq-icon" aria-hidden="true" />
                </div>
                <div
                  className="faq-panel"
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                >
                  <div className="faq-panel-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
