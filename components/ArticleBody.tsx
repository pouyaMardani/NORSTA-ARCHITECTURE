import Image from "next/image";

import type { ArticleBlock } from "@/content/articles";

/**
 * Renders an article body.
 *
 * The body is data (`ArticleBlock[]`), not markup, so this file is the single
 * place where a record's blocks become real elements. The switch below is
 * exhaustive: the `default` branch narrows to `never`, so adding a new block
 * kind to the union becomes a compile error here instead of a silently skipped
 * paragraph.
 */
type ArticleBodyProps = {
  blocks: ArticleBlock[];
};

/** Compile-time exhaustiveness guard for the block switch. */
function unhandledBlock(block: never): never {
  throw new Error(`Unhandled article block: ${JSON.stringify(block)}`);
}

export default function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="post-body">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        switch (block.kind) {
          case "heading":
            return (
              <h2 className="post-h2" key={key}>
                {block.text}
              </h2>
            );

          case "paragraph":
            return (
              <p className="post-p" key={key}>
                {block.text}
              </p>
            );

          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List
                className={`post-list${block.ordered ? " post-list-ordered" : ""}`}
                key={key}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>{item}</li>
                ))}
              </List>
            );
          }

          case "quote":
            return (
              <blockquote className="post-quote" key={key}>
                <p>{block.text}</p>
                {block.source ? <cite>{block.source}</cite> : null}
              </blockquote>
            );

          case "image":
            return (
              <figure className="post-figure" key={key}>
                {/* Fixed aspect box + `fill`: the image never shifts the text,
                    whatever its intrinsic size is. */}
                <div className="post-figure-media">
                  <Image
                    src={block.image.src}
                    alt={block.image.alt}
                    fill
                    sizes="(max-width: 820px) 100vw, 760px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                {block.image.caption ? (
                  <figcaption>{block.image.caption}</figcaption>
                ) : null}
              </figure>
            );

          default:
            return unhandledBlock(block);
        }
      })}
    </div>
  );
}
