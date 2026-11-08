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
 * The head is one centred column on every width: eyebrow and title, then the
 * intro, then the call-to-action. The intro lines flow as a single justified
 * paragraph — the old hard line breaks are gone, because a justified block
 * cannot have both fixed breaks and even edges. `#work` is still the
 * section's id, so the header, the hero cue and every deep link keep working.
 *
 * The head's call-to-action is a real button, not a bare arrow: it scrolls to
 * the gallery itself (`#work-gallery`), so it works with a keyboard, a mouse
 * and a finger alike.
 */
export default function Work() {
  const projects = getFeaturedProjects();
  const { section, labels } = PROJECT_CONFIG;

  return (
    <section id="work" className="work">
      <div className="work-head" data-reveal="fade-up">
        <div>
          <span className="eyebrow">
            {toPersianDigits(projects.length)} {section.eyebrow}
          </span>
          <h2>{section.title}</h2>
        </div>

        <p className="work-lede">{section.introLines.join(" ")}</p>

        <a href="#work-gallery" className="work-cta">
          {labels.viewGallery}
          <span aria-hidden="true">↓</span>
        </a>
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
