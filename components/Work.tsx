import Image from "next/image";

type Project = {
  num: string;
  title: string;
  loc: string;
  src: string;
  alt: string;
  large?: boolean;
  delay?: number;
};

const PROJECTS: Project[] = [
  {
    num: "01",
    title: "House on the Fjord",
    loc: "BERGEN, 2024",
    src: "/images/project-minimal-residence.png",
    alt: "House on the Fjord",
    large: true,
  },
  {
    num: "02",
    title: "Foundry Offices",
    loc: "COPENHAGEN, 2023",
    src: "/images/project-corporate-headquarters.png",
    alt: "Atelier Headquarters",
    delay: 120,
  },
  {
    num: "03",
    title: "Tea Pavilion",
    loc: "KYOTO, 2023",
    src: "/images/project-cultural-center.png",
    alt: "Tea Pavilion",
    delay: 240,
  },
];

export default function Work() {
  return (
    <section id="work" className="work">
      <div className="work-head" data-reveal="fade-up">
        <div>
          <span className="eyebrow">4 / 5 &nbsp;&nbsp; SELECTED WORKS</span>
          <h2>Recent Projects</h2>
        </div>
        <p className="work-lede">
          A small selection of built work — studies in{" "}
          <br />
          mass, threshold and light, drawn from the{" "}
          <br />
          atelier&rsquo;s ongoing pursuit of quiet form.
          <a href="#work" className="arrow-link" aria-label="Jump to works">
            →
          </a>
        </p>
      </div>

      <div className="work-grid">
        {PROJECTS.map((project) => (
          <article
            key={project.num}
            className={`proj${project.large ? " proj-large" : ""}`}
          >
            <figure
              data-reveal="image-reveal"
              data-delay={project.delay ? String(project.delay) : undefined}
            >
              <Image
                src={project.src}
                alt={project.alt}
                fill
                sizes={project.large ? "(max-width: 960px) 100vw, 50vw" : "(max-width: 960px) 100vw, 42vw"}
                style={{ objectFit: "cover" }}
              />
            </figure>
            <div className="proj-meta">
              <span className="num">{project.num}</span>
              <h3>{project.title}</h3>
              <span className="loc">{project.loc}</span>
              <a href="#" className="view" data-open-lightbox="">
                VIEW PROJECT &nbsp;→
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
