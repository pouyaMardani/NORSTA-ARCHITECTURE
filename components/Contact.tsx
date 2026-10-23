import Image from "next/image";

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact-copy" data-reveal="fade-up">
        <span className="eyebrow">GET IN TOUCH</span>
        <h2>
          Begin a<br />
          Quiet
          <br />
          Project
        </h2>
        <hr />
        <p className="addr">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13z" />
            <circle cx="12" cy="9" r="2.4" />
          </svg>
          <a
            href="https://maps.google.com/?q=Bredgade+47,+1260+Copenhagen,+Denmark"
            target="_blank"
            rel="noopener"
          >
            Bredgade 47, 1260 Copenhagen, Denmark
          </a>
        </p>
        <p className="note">
          We take on a small number of commissions each year,{" "}
          <br />
          chosen for their depth, site and shared intent.
        </p>
        <a
          href="mailto:studio@monolithatelier.com"
          className="link-underline strong"
        >
          START A CONVERSATION &nbsp;→
        </a>
      </div>

      <div className="contact-image" data-reveal="image-reveal">
        <Image
          src="/images/contact-stairs.png"
          alt="Pale stone stair with olive tree"
          fill
          sizes="(max-width: 960px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    </section>
  );
}
