/**
 * One `application/ld+json` block of structured data.
 *
 * Rendered on the server, so the data is inside the HTML a crawler receives
 * without running any JavaScript. The only escaping it needs is `<`, which would
 * otherwise be able to close the script element early — the payload is otherwise
 * ordinary JSON, and the prose inside it is Persian text that is never
 * interpreted as markup.
 *
 * The shapes themselves are built in `lib/structured-data.ts`; this component
 * only writes them out.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
