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
  // {
  //   num: "01",
  //   title: "خانه‌ی کنار تهرانپارس",
  //   loc: "برگن، 2024",
  //   src: "/images/project-minimal-residence.png",
  //   alt: "خانه‌ی کنار تهرانپارس",
  //   large: true,
  // },
  {
    num: "01",
    title: "دفاتر ریخته‌گری",
    loc: "کپنهاگ، 2023",
    src: "/images/project-corporate-headquarters.png",
    alt: "ساختمان مرکزی استودیو",
    delay: 120,
  },
  {
    num: "02",
    title: "پاویون چای",
    loc: "کیوتو، 2023",
    src: "/images/proj3.png",
    alt: "پاویون چای",
    delay: 240,
  },
  {
    num: "03",
    title: "دفاتر ریخته‌گری",
    loc: "کپنهاگ، 2023",
    src: "/images/project-cultural-center.png",
    alt: "ساختمان مرکزی استودیو",
    delay: 360,
  },
  {
    num: "04",
    title: "پاویون چای",
    loc: "کیوتو، 2023",
    src: "/images/proj4.png",
    alt: "پاویون چای",
    delay: 480,
    large:true
  },
];

export default function Work() {
  return (
    <section id="work" className="work">
      <div className="work-head" data-reveal="fade-up">
        <div>
          <span className="eyebrow">4 / 5 &nbsp;&nbsp; پروژه‌های منتخب</span>
          <h2>پروژه‌های اخیر</h2>
        </div>
        <p className="work-lede">
          گزیده‌ای کوچک از پروژه‌های اجراشده؛{" "}
          <br />
          پژوهش‌هایی در جرم، آستانه و نور که از{" "}
          <br />
          جست‌وجوی پیوسته‌ی استودیو برای فرمی آرام برآمده‌اند.
          <a href="#work" className="arrow-link" aria-label="پرش به پروژه‌ها">
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
              <span className="loc">{project.loc}</span>
              <h3>{project.title}</h3>
              <a href="#" className="view" data-open-lightbox="">
                مشاهده‌ی پروژه &nbsp;→
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
