import Image from "next/image";

const AREAS = [
  {
    num: "01",
    title: "Private Houses",
    body: (
      <>
        Intimate dwellings rooted in landscape, light,
        <br />
        and the daily rituals of those who inhabit them.
      </>
    ),
    delay: 0,
  },
  {
    num: "02",
    title: "Hospitality",
    body: (
      <>
        Hotels and retreats designed as immersive places
        <br />
        of stillness, slowness, and considered material.
      </>
    ),
    delay: 80,
  },
  {
    num: "03",
    title: "Adaptive Reuse",
    body: (
      <>
        Reawakening historic structures with restraint,
        <br />
        memory, and a careful contemporary hand.
      </>
    ),
    delay: 160,
  },
  {
    num: "04",
    title: "Interiors",
    body: (
      <>
        Atmospheres composed through proportion, texture,
        <br />
        and a deep attention to the smallest details.
      </>
    ),
    delay: 240,
  },
];

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="section-head" data-reveal="fade-up">
        <span className="eyebrow">PRACTICE</span>
        <h2>Areas of Work</h2>
      </div>

      <ul className="service-list">
        {AREAS.map((area) => (
          <li
            key={area.num}
            data-reveal="fade-up"
            data-delay={area.delay ? String(area.delay) : undefined}
          >
            <span className="num">{area.num}</span>
            <h3>{area.title}</h3>
            <p>{area.body}</p>
          </li>
        ))}
      </ul>

      <div className="services-edge" data-reveal="fade-left">
        <Image
          src="/images/services-arch.png"
          alt="Architectural detail"
          fill
          sizes="34vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    </section>
  );
}
