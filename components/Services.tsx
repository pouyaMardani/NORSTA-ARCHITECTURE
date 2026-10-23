import Image from "next/image";

const AREAS = [
  {
    num: "01",
    title: "خانه‌های شخصی",
    body: (
      <>
        خانه‌هایی صمیمی که در پیوند با طبیعت، نور و{" "}
        <br />
        آیین‌های روزمره‌ی ساکنانشان شکل می‌گیرند.
      </>
    ),
    delay: 0,
  },
  {
    num: "02",
    title: "مهمان‌نوازی",
    body: (
      <>
        هتل‌ها و اقامتگاه‌هایی که همچون فضاهایی غوطه‌ور در سکون،{" "}
        <br />
        آهستگی و مصالحِ سنجیده طراحی می‌شوند.
      </>
    ),
    delay: 80,
  },
  {
    num: "03",
    title: "بازآفرینی بنا",
    body: (
      <>
        بیدار کردنِ دوباره‌ی بناهای تاریخی، با خویشتن‌داری،{" "}
        <br />
        حافظه و نگاهی معاصر و سنجیده.
      </>
    ),
    delay: 160,
  },
  {
    num: "04",
    title: "فضای داخلی",
    body: (
      <>
        فضاهایی که با تناسبات، بافت و{" "}
        <br />
        توجهی عمیق به کوچک‌ترین جزئیات ساخته می‌شوند.
      </>
    ),
    delay: 240,
  },
];

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="section-head" data-reveal="fade-up">
        <span className="eyebrow">حوزه فعالیت</span>
        <h2>زمینه‌های فعالیت</h2>
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
          alt="جزئیات معماری"
          fill
          sizes="34vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    </section>
  );
}
