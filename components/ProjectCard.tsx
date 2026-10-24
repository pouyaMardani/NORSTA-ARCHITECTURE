import Image from "next/image";
import Link from "next/link";

import { formatProjectNumber, type ProjectDTO } from "@/content/projects";

/**
 * One project card — the shared unit of the home-page gallery and the
 * related-projects row under a project page.
 *
 * The card is a real link to `/projects/<slug>`: the whole plate is the target,
 * the photograph is a real <Image>, and the title, category and location are
 * real text laid over a gradient scrim, never a flattened screenshot.
 *
 * Accessibility: the link's accessible name is its own content (category,
 * title, location), so a screen reader announces what the card is. The plate
 * number and the arrow are decorative. Gallery copies pass `decorative`, which
 * takes them out of the accessibility tree and out of the tab order.
 */
type ProjectCardProps = {
  project: ProjectDTO;
  /** Position in the gallery, 1-based: printed as the plate number. */
  index: number;
  /**
   * Extra class — the gallery and the related grid size the same card
   * differently, so the box belongs to the container, not to the card.
   */
  className?: string;
  /** Rendering a duplicate of a card for the loop: hide it from AT and Tab. */
  decorative?: boolean;
  /** Responsive `sizes` hint. */
  sizes?: string;
  /** Load eagerly. Off by default: the gallery sits below the fold. */
  priority?: boolean;
};

export default function ProjectCard({
  project,
  index,
  className,
  decorative = false,
  sizes = "(max-width: 680px) 78vw, (max-width: 1100px) 46vw, 30vw",
  priority = false,
}: ProjectCardProps) {
  return (
    <Link
      className={className ? `pcard ${className}` : "pcard"}
      href={`/projects/${project.slug}`}
      tabIndex={decorative ? -1 : undefined}
      aria-hidden={decorative || undefined}
      draggable={false}
    >
      <span className="pcard-media">
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "cover" }}
        />

        {/* Scrim: keeps the type readable over every photograph. */}
        <span className="pcard-scrim" aria-hidden="true" />

        {/* Mounted plate number, the same device the site's other plates use. */}
        <span className="pcard-num" aria-hidden="true">
          {formatProjectNumber(index)}
        </span>

        <span className="pcard-meta">
          <span className="pcard-cat">{project.category}</span>
          <h3 className="pcard-title">{project.title}</h3>
          {project.location ? (
            <span className="pcard-loc">{project.location}</span>
          ) : null}

          <span className="pcard-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 12h16" />
              <path d="M14 6l6 6-6 6" />
            </svg>
          </span>
        </span>
      </span>
    </Link>
  );
}
