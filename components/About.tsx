import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-image" data-reveal="image-reveal">
        <Image
          src="/images/about-courtyard.png"
          alt="فضای داخلی سنگیِ آفتاب‌گیر با درخت و پلکان"
          fill
          sizes="(max-width: 960px) 100vw, 48vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="about-copy">
        <span className="eyebrow" data-reveal="fade-up">
          استودیو
        </span>
        <h2 className="mask-title" data-reveal="mask-line" data-delay="120">
          <span className="line">
            <span>ماده</span>
          </span>
          <span className="line">
            <span>و سکوت</span>
          </span>
        </h2>
        <p className="lede" data-reveal="fade-up" data-delay="320">
          ما بناهایی طراحی می‌کنیم که آرام و استوار بر جای خود می‌ایستند. سنگ،
          چوب و نور همچون سازهایی کوک‌شده با مکان، اقلیم و ریتمِ بی‌عجله‌ی
          زندگی روزمره به کار گرفته می‌شوند.
        </p>
        <p className="sub" data-reveal="fade-up" data-delay="460">
          این استودیو که در سال 2008 میان کپنهاگ و کیوتو بنیان گذاشته شد، بیش از
          140 پروژه را در حوزه‌های مسکونی، فرهنگی و اقامتی به سرانجام رسانده است.
        </p>

        <div className="metrics" data-reveal="metrics-rule">
          <div data-reveal="fade-up" data-delay="200">
            <span className="num" data-count="2008" data-from="2000">
              2000
            </span>
            <span className="label">سال تأسیس</span>
          </div>
          <div data-reveal="fade-up" data-delay="340">
            <span className="num" data-count="140" data-suffix="+">
              0
            </span>
            <span className="label">پروژه‌های اجراشده</span>
          </div>
        </div>
      </div>
    </section>
  );
}
