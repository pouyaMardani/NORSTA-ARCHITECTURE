import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import ProjectView from "@/components/microcement/ProjectView";
import {
  getAllProjects,
  getAllProjectSlugs,
  getProjectBySlug,
} from "@/content/projects";
import { detailMetadata } from "@/lib/seo";
import { projectJsonLd } from "@/lib/structured-data";

/**
 * One project inside the microcement showcase (`/microcement/works/<slug>`).
 *
 * A server shell: the record is static data, so the page pre-renders at
 * build time and the interactive half (the reading/visual switch, the
 * thumbnail rail) lives in `ProjectView`. The next project is the following
 * record in the curated order, wrapping from the last back to the first, so
 * the ten case studies form one circular chain.
 *
 * The metadata comes from `detailMetadata`, the same helper the classic
 * project page uses: a canonical address, a share image (the project's own
 * cover) and a large card, with the site's name and language. The structured
 * data names this page itself as the main entity (the same project also lives
 * at `/projects/<slug>`, whose node names that address).
 */
type MicrocementProjectPageProps = {
  params: Promise<{ slug: string }>;
};

/** Pre-render every project at build time. */
export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: MicrocementProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return {};

  return detailMetadata({
    path: `/microcement/works/${project.slug}`,
    title: project.seoTitle,
    description: project.seoDescription,
    image: project.coverImage,
  });
}

export default async function MicrocementProjectPage({
  params,
}: MicrocementProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const all = getAllProjects();
  const index = all.findIndex((item) => item.slug === project.slug);
  const next = all[(index + 1) % all.length];

  return (
    <>
      {/* The project as structured data, naming this page as its main entity.
          Inert markup. */}
      <JsonLd
        data={projectJsonLd(project, `/microcement/works/${project.slug}`)}
      />
      <ProjectView project={project} next={next} />
    </>
  );
}
