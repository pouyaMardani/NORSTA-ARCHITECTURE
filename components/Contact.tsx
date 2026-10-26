import Image from "next/image";

import { SITE_INSTAGRAM_HANDLE, SITE_INSTAGRAM_URL } from "@/lib/site";

/**
 * Contact — how to reach the studio, and nothing else.
 *
 * The reference composition carried the *reference studio's* own details: a
 * Copenhagen street address behind a Google Maps link, and a `mailto:` address
 * on another studio's domain. Both were removed rather than re-pointed: they
 * name a business that is not Norsta, and no replacement street address,
 * telephone number or e-mail has ever been supplied, so inventing one is not an
 * option. `lib/structured-data.ts` states no `address`, `telephone` or `email`
 * for exactly the same reason, so the page and the structured data cannot
 * disagree about how to reach the studio.
 *
 * What is left is the route that does exist. Instagram is where Norsta answers —
 * the showcase on the home page and the academy's purchase enquiry already link
 * there — so the contact line names the account and the CTA opens it. The handle
 * is the address, the CTA is the invitation, and both are live links to the same
 * profile: the block keeps its shape with no broken link, no dead `mailto:` and
 * no empty placeholder standing where the old details used to be.
 *
 * The layout is untouched: eyebrow, heading, rule, contact line, note and CTA —
 * the same six elements in the same order, under the same `.contact` rules. The
 * glyph on the contact line is the account's own mark, the drawing the showcase
 * CTA already uses, drawn at the 18 px the pin occupied.
 */
export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact-copy" data-reveal="fade-up">
        <span className="eyebrow">در تماس باشید</span>
        <h2>
          آغاز
          <br />
          پروژه‌ای
          <br />
          آرام
        </h2>
        <hr />
        <p className="addr">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5.2" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
          </svg>
          <a href={SITE_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            {`@${SITE_INSTAGRAM_HANDLE}`}
          </a>
        </p>
        <p className="note">
          هر سال شمارِ محدودی پروژه می‌پذیریم؛{" "}
          <br />
          پروژه‌هایی که برای عمق، بستر و نیتِ مشترکشان برگزیده می‌شوند.
        </p>
        <a
          href={SITE_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline strong"
        >
          آغاز گفت‌وگو &nbsp;→
        </a>
      </div>

      <div className="contact-image" data-reveal="image-reveal">
        <Image
          src="/images/contact-stairs.png"
          alt="پلکان سنگیِ روشن با درخت زیتون"
          fill
          sizes="(max-width: 960px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    </section>
  );
}
