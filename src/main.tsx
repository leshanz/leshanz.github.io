import React from "react";
import { createRoot } from "react-dom/client";
import publicationData from "./data/publications.json";
import talkData from "./data/talks.json";
import "./styles.css";

const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer",
} as const;

type PageId = "home" | "research" | "publications";

type Publication = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  citations: number;
  scholarUrl: string;
  journalUrl?: string;
};

const publications = publicationData.publications as Publication[];

type Talk = {
  id: string;
  title: string;
  event: string;
  location?: string;
  date: string;
  type?: string;
  url?: string;
  slidesUrl?: string;
};

const talks = [...(talkData.talks as Talk[])]
  .sort((left, right) => right.date.localeCompare(left.date));

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Header({ currentPage }: { currentPage: PageId }) {
  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="Leshan Zhao, home">
        Leshan Zhao
      </a>
      <nav aria-label="Primary navigation">
        <a href="/#about">About</a>
        <a href="/research/" aria-current={currentPage === "research" ? "page" : undefined}>
          Research
        </a>
        <a href="/publications/" aria-current={currentPage === "publications" ? "page" : undefined}>
          Publications
        </a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function ResearchCards() {
  const projects: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  }> = [
    {
      id: "disorder",
      title: "Disorder in frustrated quantum magnets",
      description: "Resolving how structural site mixing and heterogeneous local environments mimic many-body effects in quantum magnets.",
      image: "/research/disorder.png",
      imageAlt: "Research figure illustrating disorder in frustrated quantum magnets",
    },
    {
      id: "spectroscopy",
      title: "Emergent phases and collective excitations",
      description: "Using momentum- and energy-resolved spectroscopy to connect collective excitations with microscopic interactions.",
      image: "/research/spectroscopy.png",
      imageAlt: "Research figure illustrating emergent phases and collective excitations"
    },
    {
      id: "inverse-problems",
      title: "Machine learning for inverse problems",
      description: "Building simulation and machine-learning workflows that accelerate the extraction of microscopic physics from complex measurements.",
      image: "/research/machine-learning.png",
      imageAlt: "Research figure illustrating machine learning for inverse problems"
    },
  ];

  return (
    <>
      {projects.map((project, index) => (
        <article className={`project-card surface-card${index === 1 ? " project-card-reverse" : ""}`} key={project.id}>
          <div className="project-figure">
            <img
              src={project.image}
              alt={project.imageAlt}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="project-copy">
            <div className="project-meta">
              <span>R.{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
          </div>
        </article>
      ))}
    </>
  );
}

function PublicationList() {
  return (
    <ol className="publication-list">
      {publications.map((publication, index) => (
        <li className="publication" key={publication.id}>
          <div className="publication-year">{publication.year}</div>
          <div className="publication-copy">
            <h3>
              <span className="publication-number" aria-hidden="true">{index + 1}.</span>
              <span>{publication.title}</span>
            </h3>
            <p className="publication-citation">
              {publication.authors}{publication.venue ? `, ${publication.venue}` : ""}
            </p>
            <div className="publication-links">
              {publication.journalUrl && (
                <a href={publication.journalUrl} {...externalLinkProps}>
                  Journal <Arrow />
                </a>
              )}
              <a href={publication.scholarUrl} {...externalLinkProps}>
                Google Scholar <Arrow />
              </a>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function TalksList() {
  if (talks.length === 0) {
    return (
      <p className="talks-empty">
        Talks and presentations will be added here.
      </p>
    );
  }

  return (
    <ol className="publication-list">
      {talks.map((talk, index) => {
        const year = /^\d{4}/.test(talk.date) ? talk.date.slice(0, 4) : "";
        const details = [talk.type, talk.event, talk.location].filter(Boolean).join(" · ");

        return (
          <li className="publication talk" key={talk.id}>
            <div className="publication-year">{year}</div>
            <div className="publication-copy">
              <h3>
                <span className="publication-number" aria-hidden="true">{index + 1}.</span>
                <span>{talk.title}</span>
              </h3>
              <p className="publication-citation">{details}</p>
              {(talk.url || talk.slidesUrl) && (
                <div className="publication-links">
                  {talk.url && (
                    <a href={talk.url} {...externalLinkProps}>Event <Arrow /></a>
                  )}
                  {talk.slidesUrl && (
                    <a href={talk.slidesUrl} {...externalLinkProps}>Slides <Arrow /></a>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ContactSection() {
  return (
    <section className="contact surface-card" id="contact" aria-labelledby="contact-heading">
      <div className="contact-layout">
        <div className="contact-details">
          <p className="eyebrow light" id="contact-heading">Contact</p>
          <p className="contact-lede">
            <a href="mailto:lzhao53@jhu.edu">lzhao53@jhu.edu</a>
          </p>
          <address className="contact-address">
            Johns Hopkins University<br />
            Physics and Astronomy<br />
            3701 San Martin Dr<br />
            Baltimore, MD 21218, USA
          </address>
        </div>

        <div className="contact-social">
          <div className="contact-links">
            <a href="https://scholar.google.com/citations?user=IcP_P_sAAAAJ&hl=en" {...externalLinkProps}>Google Scholar <Arrow /></a>
            <a href="https://github.com/leshanz" {...externalLinkProps}>GitHub <Arrow /></a>
            <a href="https://www.linkedin.com/in/leshanzhao" {...externalLinkProps}>LinkedIn <Arrow /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <main id="top">
      <section className="hero surface-card" aria-labelledby="hero-title">
        <div className="hero-portrait">
          <img src="/leshan-zhao-head.jpg" alt="Leshan Zhao headshot" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Condensed matter physics</p>
          <h1 id="hero-title">Leshan Zhao</h1>
          <p className="hero-lede">
            Experimental condensed matter physicist studying quantum magnetic
            materials through precision measurements, neutron scattering, and data-intensive analysis.
          </p>
          <div className="hero-actions">
            <a className="button button-rust" href="/Leshan_Zhao_CV.pdf" {...externalLinkProps}>
              View CV <Arrow />
            </a>
            <a className="button button-line" href="/research/">
              View research <Arrow />
            </a>
            <a className="button button-line" href="#contact">
              Get in touch <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section className="marquee surface-card" aria-label="Research areas">
        <span aria-hidden="true">✦</span>
        <span>Quantum magnetism</span><span aria-hidden="true">✦</span>
        <span>Neutron scattering</span><span aria-hidden="true">✦</span>
        <span>Inverse problems</span><span aria-hidden="true">✦</span>
        <span>Scientific computing</span><span aria-hidden="true">✦</span>
      </section>

      <section className="section about surface-card" id="about" aria-labelledby="about-heading">
        <div className="about-copy">
          <h2 id="about-heading">About</h2>
          <h3 className="about-headline">
            Extracting quantum physics from complex experiments
          </h3>
          <p className="about-intro">
            I am a Ph.D. candidate at Johns Hopkins University in the department of Physics and Astronomy working with professor <a href="https://physics-astronomy.jhu.edu/directory/collin-l-broholm/">Collin Broholm</a>, with a focus on frustrated quantum magnetism and neutron scattering. I received my B.S. in Physics from the University of California, Irvine, where I worked with professor <a href="https://ps.uci.edu/fprofile/steven-w-barwick/">Steven Barwick</a> on the <a href="https://arianna.ps.uci.edu/">ARIANNA collaboration</a> for radio detection of ultra-high-energy neutrinos and cosmic rays.
            </p>
            <p className="about-intro">
            I am an experimental physicist working at the intersection of
            quantum materials and data-intensive measurement. My current
            research at Johns Hopkins uses cryogenic precision measurements and neutron scattering to
            investigate frustrated magnets, collective excitations, and novel phases of matter due to competing interactions. My broader
            interests include data-intensive analysis such as machine
            learning for inverse problems and analysis tools that connect
            measurements to interpretable physical models. My previous
            work with the ARIANNA collaboration involved radio detection and
            reconstruction for ultra-high-energy cosmic particles.
          </p>

        </div>
      </section>

      <section className="section about-experience surface-card" aria-labelledby="experience-heading">
        <div className="experience-copy">
            <h3 id="experience-heading">Experience</h3>

            <article className="experience-item">
              <div className="experience-meta">
                <p className="experience-time">Aug 2022 — Present</p>
                <p className="experience-field">Quantum materials</p>
              </div>
              <div className="experience-role">
                <h4>Johns Hopkins University</h4>
                <p>Ph.D. candidate</p>
              </div>
              <ul className="experience-points">
                <li>
                  Frustrated quantum magnets, collective excitations, and
                  novel phases of matter due to competing interactions.
                </li>
                <li>
                  Neutron scattering, physical modeling,
                  and machine-learning-enabled analysis.
                </li>
              </ul>
            </article>

            <article className="experience-item">
              <div className="experience-meta">
                <p className="experience-time">Jun 2026 — Aug 2026</p>
                <p className="experience-field">Quantum Computing</p>
              </div>
              <div className="experience-role">
                <h4>Nokia Bell Labs</h4>
                <p>Advanced Sensing & Quantum Devices Intern</p>
              </div>
              <ul className="experience-points">
                <li>GaAs/AlGaAs quantum well and fractional quantum Hall devices</li>
                <li>Cryogenic measurements of topological qubits</li>
              </ul>
            </article>

            <article className="experience-item">
              <div className="experience-meta">
                <p className="experience-time">Feb 2020 — Aug 2022</p>
                <p className="experience-field">Astroparticle physics</p>
              </div>
              <div className="experience-role">
                <h4>UC Irvine · ARIANNA Collaboration</h4>
                <p>Undergraduate researcher</p>
              </div>
              <ul className="experience-points">
                <li>
                  Classification and reconstruction of rare cosmic-ray radio signals
                </li>
                <li>
                  Machine-learning-assisted rejection of background events
                </li>
              </ul>
            </article>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}

function ResearchPage() {
  return (
    <main id="top">
      <section className="page-hero surface-card" aria-labelledby="research-page-title">
        <h1 id="research-page-title">Research</h1>
        <p>
          Microscopic physics of frustrated and correlated quantum magnetic materials through complex measurements and data-intensive analysis
        </p>
      </section>
      <ResearchCards />
      <ContactSection />
    </main>
  );
}

function PublicationsPage() {
  return (
    <main id="top">
      <section className="page-hero surface-card" aria-labelledby="publications-page-title">
        <h1 id="publications-page-title">Publications and Talks</h1>
        <div className="profile-links" aria-label="Academic profiles">
          <a className="profile-link" href="https://scholar.google.com/citations?user=IcP_P_sAAAAJ&hl=en" {...externalLinkProps}>
            <span>Google Scholar</span><Arrow />
          </a>
          <a className="profile-link" href="https://orcid.org/0000-0003-2418-4660" {...externalLinkProps}>
            <span>ORCID</span><Arrow />
          </a>
        </div>
      </section>
      <section className="section publication-section standalone-publications surface-card" aria-label="Publication list">
        <h2 className="section-kicker">Journal articles</h2>
        <div className="publication-content">
          <PublicationList />
        </div>
      </section>
      <section className="section publication-section standalone-publications surface-card" aria-label="Talks and presentations">
        <h2 className="section-kicker">Talks / Presentations</h2>
        <div className="publication-content">
          <TalksList />
        </div>
      </section>
      <ContactSection />
    </main>
  );
}

function Footer() {
  return (
    <footer>
      <span>© {new Date().getFullYear()} Leshan Zhao</span>
      <a href="#top">Back to top ↑</a>
    </footer>
  );
}

function App() {
  const currentPage = (document.body.dataset.page ?? "home") as PageId;
  const page = currentPage === "research"
    ? <ResearchPage />
    : currentPage === "publications"
      ? <PublicationsPage />
      : <HomePage />;

  return (
    <>
      <Header currentPage={currentPage} />
      {page}
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
