import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectView from "@/components/microcement/ProjectView";
import {
  getAllProjects,
  getAllProjectSlugs,
  getProjectBySlug,
} from "@/content/projects";
import { absoluteUrl } from "@/lib/site";

/**
 * One project inside the microcement showcase (`/microcement/works/<slug>`).
 *
 * A server shell: the record is static data, so the page pre-renders at
 * build time and the interactive half (the reading/visual switch, the
 * thumbnail rail) lives in `ProjectView`. The next project is the following
 * record in the curated order, wrapping from the last back to the first, so
 * the ten case studies form one circular chain.
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

  return {
    title: project.seoTitle,
    description: project.seoDescription,
    alternates: {
      canonical: absoluteUrl(`/microcement/works/${project.slug}`),
    },
    openGraph: {
      type: "article",
      title: project.seoTitle,
      description: project.seoDescription,
      url: absoluteUrl(`/microcement/works/${project.slug}`),
    },
  };
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

  return <ProjectView project={project} next={next} />;
}
