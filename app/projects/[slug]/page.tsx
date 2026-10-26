import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import ProjectCard from "@/components/ProjectCard";
import {
  formatProjectCounter,
  formatProjectDate,
  getAllProjectSlugs,
  getProjectBySlug,
  getRelatedProjects,
  PROJECT_CONFIG,
} from "@/content/projects";
import { detailMetadata } from "@/lib/seo";
import { projectJsonLd } from "@/lib/structured-data";

/**
 * One project.
 *
 * The route is `/projects/<slug>` for every project: one dynamic page, one URL
 * per record, no duplicated implementation. Unknown slugs fall through to
 * `notFound()`, which renders `app/projects/not-found.tsx` with a 404 status
 * rather than an empty page.
 *
 * The page is a Server Component — the record is static data, so nothing here
 * ships to the browser. The gallery's shots are marked `.proj` and carry a
 * `[data-open-lightbox]` control: that is the contract the site's existing
 * lightbox already walks (`components/SiteInteractions.tsx`), so the gallery
 * gets open / prev / next / keyboard for free instead of a second viewer.
 *
 * Metadata is per project (`seoTitle` / `seoDescription`); the gallery's name is
 * appended by the segment's layout template.
 */
type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

/** Pre-render every project at build time. */
export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return { title: PROJECT_CONFIG.labels.notFoundTitle };

  return detailMetadata({
    path: `/projects/${project.slug}`,
    title: project.seoTitle,
    description: project.seoDescription,
    image: project.coverImage,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const { labels } = PROJECT_CONFIG;
  const related = getRelatedProjects(project, 3);
  const shots = project.galleryImages;

  /**
   * Only the facts the record actually carries. A project without a location or
   * a date prints neither — the row is omitted instead of filled in with a
   * guess.
   */
  const facts = [
    project.location ? { label: labels.location, value: project.location } : null,
    project.completedAt
      ? { label: labels.completedAt, value: formatProjectDate(project.completedAt) }
      : null,
    project.materials?.length
      ? { label: labels.materials, value: project.materials.join("، ") }
      : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <article className="pj" dir="rtl">
      {/* The project as structured data: its name, summary, photographs and the
          facts its record actually carries. Inert markup. */}
      <JsonLd data={projectJsonLd(project)} />
      <header className="pj-hero">
        <div className="pj-hero-media" data-reveal="image-reveal">
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <span className="pj-hero-veil" aria-hidden="true" />
        </div>

        <div className="pj-hero-inner">
          <Link className="pj-back" href="/">
            <span className="pj-back-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M20 12H4" />
                <path d="M10 6l-6 6 6 6" />
              </svg>
            </span>
            {labels.back}
          </Link>

          <div className="pj-hero-title" data-reveal="fade-up" data-delay="160">
            <span className="pj-cat">{project.category}</span>
            <h1 className="pj-title">{project.title}</h1>
          </div>

          <p className="pj-lede" data-reveal="fade-up" data-delay="280">
            {project.shortDescription}
          </p>
        </div>
      </header>

      <div className="pj-body">
        <div className="pj-copy" data-reveal="fade-up">
          {project.description.map((paragraph) => (
            <p className="pj-p" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        {facts.length > 0 ? (
          <aside className="pj-facts">
            <dl className="pj-facts-list">
              {facts.map((fact) => (
                <div className="pj-fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        ) : null}
      </div>

      {shots.length > 0 ? (
        <section className="pj-gallery" aria-labelledby="pj-gallery-title">
          <h2 className="pj-h2" id="pj-gallery-title" data-reveal="fade-up">
            {labels.gallery}
          </h2>

          <div className="pj-shots">
            {shots.map((shot, index) => (
              /* `.proj` is the hook the site's lightbox already walks; the plate
                 styling of the home-page cards is reset for this register in
                 `globals.css` (`.pj-shots .proj`). */
              <div className="pj-shot proj" key={shot.src} data-reveal="image-reveal">
                <figure className="pj-shot-frame">
                  <div className="pj-shot-media">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </figure>

                <div className="pj-shot-meta">
                  <h3 className="pj-shot-title">{shot.caption ?? shot.alt}</h3>
                  <span className="loc">{formatProjectCounter(index, shots.length)}</span>

                  <button
                    type="button"
                    className="pj-shot-zoom"
                    data-open-lightbox
                    aria-label={`${labels.zoom}: ${shot.caption ?? shot.alt}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      aria-hidden="true"
                    >
                      <path d="M4 12h16" />
                      <path d="M14 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="pj-related" aria-labelledby="pj-related-title">
          <h2 className="pj-h2" id="pj-related-title" data-reveal="fade-up">
            {labels.related}
          </h2>

          <div className="pj-related-grid">
            {related.map((item, index) => (
              <div
                className="pj-related-item"
                key={item.id}
                data-reveal="fade-up"
                data-delay={String(index * 110)}
              >
                <ProjectCard
                  project={item}
                  index={index}
                  className="pj-related-card"
                  sizes="(max-width: 680px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
