import Link from "next/link";

/**
 * The next-page block that closes a microcement page, in Jetton's pattern:
 * a number, a huge linked title, a mono line — and a column of single
 * letters spelling the destination's Latin name.
 *
 * The vertical word is Latin on purpose: Persian letters join, so a word
 * split into separate blocks would render in isolated forms and read as
 * broken. The Latin brand words (`MICROCEMENT`, `NORSTA`) are the section's
 * own names, and they sit the way Jetton's vertical letters do.
 */
export default function NextPageBlock({
  num,
  title,
  sub,
  href,
  vertical,
  label,
}: Readonly<{
  /** The step number, e.g. «۰۲». */
  num: string;
  /** The huge linked title. */
  title: string;
  /** The mono line under the title. */
  sub: string;
  /** Where the title links. */
  href: string;
  /** The vertical word, Latin capitals, e.g. «MICROCEMENT». */
  vertical: string;
  /** Accessible label for the block. */
  label: string;
}>) {
  return (
    <nav className="mc-next" aria-label={label}>
      <div>
        <p className="mc-next-num">پیمایش — {num}</p>
        <Link href={href} className="mc-next-title">
          {title}
        </Link>
        <p className="mc-next-sub">{sub}</p>
      </div>
      <div className="mc-vertical" aria-hidden="true">
        {vertical.split("").map((letter, index) => (
          <span key={index}>{letter}</span>
        ))}
      </div>
    </nav>
  );
}
