import Link from "next/link";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

/**
 * The two bare pages — a wrong address (404) and a site briefly away (503) —
 * share one shell, so they can never drift apart.
 *
 * The register is the site's own: the ivory ground, the Latin display face for
 * the code itself (the same Cormorant the NORSTA wordmark is set in — an error
 * code is a universal mark, not a Persian sentence), the studio's broken
 * hairline with its diamond, and the Work section's own pill button for the
 * way home. No photograph, no new colour, no client JavaScript: these pages
 * have to render even when the rest of the site cannot, so nothing here
 * depends on the reveal system (`SiteInteractions` is mounted per segment,
 * not in the root layout) or on any image.
 *
 * The secondary link's arrow follows the site's RTL convention: onwards is
 * leftwards (←) for a link that stays on the site, up-left (↖) for one that
 * leaves it.
 */
type ErrorPageProps = {
  /** The HTTP code, set in the same display face as the wordmark. */
  code: "404" | "503";
  /** The small tracked label above the title, e.g. «خطای ۴۰۴». */
  eyebrow: string;
  title: string;
  lede: string;
  /** The way back: a dark pill, always an on-site route. */
  primary: { href: string; label: string };
  /** The second way out. `external` marks a link that leaves the site. */
  secondary: { href: string; label: string; external?: boolean };
};

export default function ErrorPage({
  code,
  eyebrow,
  title,
  lede,
  primary,
  secondary,
}: ErrorPageProps) {
  return (
    <div dir="rtl">
      <Nav />
      <main className="err">
        <span className="err-code" aria-hidden="true">
          {code}
        </span>
        <span className="eyebrow err-eyebrow">{eyebrow}</span>
        <h1 className="err-title">{title}</h1>
        <p className="err-lede">{lede}</p>
        <div className="err-rule" aria-hidden="true" />
        <div className="err-actions">
          <Link className="work-cta" href={primary.href}>
            {primary.label}
          </Link>
          <Link
            className="err-secondary"
            href={secondary.href}
            {...(secondary.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {secondary.label}
            <span aria-hidden="true">{secondary.external ? "↖" : "←"}</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
