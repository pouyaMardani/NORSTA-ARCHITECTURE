import { Fragment } from "react";

import ProjectMarquee from "@/components/ProjectMarquee";
import { getFeaturedProjects, PROJECT_CONFIG, toPersianDigits } from "@/content/projects";

/**
 * Selected work — the site's project gallery.
 *
 * The section is a Server Component: it reads the projects, prints them as
 * static HTML in the section head, and hands the list to `ProjectMarquee`, the
 * only client piece of the feature. All of the copy lives in
 * `content/projects/config.ts`, so nothing here has to change when a project
 * is added, removed or re-ordered.
 *
 * The head's call-to-action is a real button, not a bare arrow: it scrolls to
 * the gallery itself (`#work-gallery`), so it works with a keyboard, a mouse
 * and a finger alike. `#work` is still the section's id, so the header, the
 * hero cue and every deep link keep working.
 */
export default function Work() {
  const projects = getFeaturedProjects();
  const { section, labels } = PROJECT_CONFIG;

  return (
    <section id="work" className="work">
      <div className="work-head" data-reveal="fade-up">
        <p className="work-lede">
          {section.introLines.map((line, index) => (
            <Fragment key={line}>
              {/* The space belongs to the line break: with the breaks hidden on
                  a phone (`globals.css`, ≤680px) the clauses still read apart. */}
              {index > 0 ? (
                <>
                  {" "}
                  <br />
                </>
              ) : null}
              {line}
            </Fragment>
          ))}
          <a href="#work-gallery" className="work-cta">
            {labels.viewGallery}
            <span aria-hidden="true">↓</span>
          </a>
        </p>

        <div>
          <span className="eyebrow">
            {toPersianDigits(projects.length)} {section.eyebrow}
          </span>
          <h2>{section.title}</h2>
        </div>
      </div>

      <ProjectMarquee
        projects={projects}
        label={section.galleryLabel}
        hint={labels.scrollHint}
        previousLabel={labels.previous}
        nextLabel={labels.next}
      />
    </section>
  );
}
