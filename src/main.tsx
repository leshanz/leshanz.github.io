import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer",
} as const;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function App() {
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Leshan Zhao, home">
          LZ<span className="wordmark-dot">.</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#research">Research</a>
          <a href="#publications">Publications</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Experimental condensed matter physics</p>
            <h1 id="hero-title">
              Leshan
              <br />
              Zhao<span className="accent">.</span>
            </h1>
            <p className="hero-lede">
              I study how disorder, geometry, and interactions shape quantum
              materials—using neutron scattering, computation, and physically
              grounded data analysis.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#research">
                Explore research <span aria-hidden="true">↓</span>
              </a>
              <a className="button button-line" href="mailto:lzhao53@jhu.edu">
                Get in touch <Arrow />
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Abstract neutron scattering motif">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="beam-line" />
            <div className="data-point point-one" />
            <div className="data-point point-two" />
            <div className="data-point point-three" />
            <p className="visual-label">S(Q, ω)</p>
            <p className="visual-caption">reciprocal space / energy transfer</p>
          </div>
        </section>

        <section className="marquee" aria-label="Research areas">
          <span>Quantum magnetism</span>
          <span aria-hidden="true">✦</span>
          <span>Neutron spectroscopy</span>
          <span aria-hidden="true">✦</span>
          <span>Inverse problems</span>
          <span aria-hidden="true">✦</span>
          <span>Scientific computing</span>
        </section>

        <section className="section about" id="about" aria-labelledby="about-heading">
          <div className="section-kicker">01 / About</div>
          <div className="about-copy">
            <h2 id="about-heading">
              Looking for the physics hidden inside complex data.
            </h2>
            <div className="prose-columns">
              <p>
                I am an experimental physicist working at the intersection of
                quantum materials and data-intensive measurement. My current
                research at Johns Hopkins uses inelastic neutron scattering to
                investigate frustrated magnets, crystal-field excitations, and
                the microscopic consequences of structural disorder.
              </p>
              <p>
                My broader interests include reproducible simulation pipelines,
                machine learning for inverse problems, and analysis tools that
                connect measured spectra to interpretable physical models. I
                previously worked with the ARIANNA collaboration on radio
                detection and reconstruction for ultra-high-energy particles.
              </p>
            </div>
          </div>
        </section>

        <section className="section research" id="research" aria-labelledby="research-heading">
          <div className="section-kicker light">02 / Research</div>
          <div className="research-content">
            <div className="section-heading-row">
              <h2 id="research-heading">Questions I work on</h2>
              <p>
                Experiments, models, and computation designed to keep physical
                interpretation in view.
              </p>
            </div>
            <div className="research-grid">
              <article className="research-card featured-card">
                <span className="card-number">R.01</span>
                <div>
                  <p className="card-tag">Quantum materials</p>
                  <h3>Disorder in frustrated magnets</h3>
                  <p>
                    Resolving how site mixing and heterogeneous local
                    environments reshape crystal-field spectra and low-energy
                    magnetic behavior.
                  </p>
                </div>
              </article>
              <article className="research-card">
                <span className="card-number">R.02</span>
                <div>
                  <p className="card-tag">Neutron scattering</p>
                  <h3>Spectroscopy as a microscopic probe</h3>
                  <p>
                    Using momentum- and energy-resolved measurements to connect
                    collective excitations with Hamiltonians and local symmetry.
                  </p>
                </div>
              </article>
              <article className="research-card">
                <span className="card-number">R.03</span>
                <div>
                  <p className="card-tag">Scientific computing</p>
                  <h3>Interpretable inverse problems</h3>
                  <p>
                    Building reproducible simulation and machine-learning
                    workflows that surface uncertainty, degeneracy, and
                    identifiability.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section publication-section" id="publications" aria-labelledby="publications-heading">
          <div className="section-kicker">03 / Selected work</div>
          <div className="publication-content">
            <h2 id="publications-heading">Publications</h2>
            <article className="publication featured-publication">
              <div className="publication-year">2026</div>
              <div className="publication-copy">
                <p className="publication-label">Featured paper · Physical Review B</p>
                <h3>
                  Quenched disorder in the triangular lattice antiferromagnet
                  YbZn<sub>2</sub>GaO<sub>5</sub>
                </h3>
                <p className="authors">
                  <strong>L. Zhao</strong>, T. Chen, M. B. Stone, Q. Zhang,
                  C. L. Sarkis, S. M. Koohpayeh, and C. L. Broholm
                </p>
                <p className="publication-summary">
                  Inelastic neutron scattering, diffraction, point-charge
                  modeling, and first-principles calculations reveal how Zn/Ga
                  site mixing broadens crystal-field excitations and influences
                  the material&apos;s unusual magnetism.
                </p>
                <div className="publication-links">
                  <a href="https://journals.aps.org/prb/abstract/10.1103/xn2m-1jb5" {...externalLinkProps}>
                    Journal <Arrow />
                  </a>
                  <a href="https://arxiv.org/abs/2507.12592" {...externalLinkProps}>
                    arXiv <Arrow />
                  </a>
                </div>
              </div>
            </article>

            <article className="publication">
              <div className="publication-year">2022</div>
              <div className="publication-copy">
                <p className="publication-label">JCAP · ARIANNA Collaboration</p>
                <h3>
                  Measuring the polarization reconstruction resolution of the
                  ARIANNA neutrino detector with cosmic rays
                </h3>
                <p className="publication-summary">
                  A measurement-led study of radio-pulse polarization
                  reconstruction, validating detector performance against
                  simulation using cosmic-ray events.
                </p>
                <a className="inline-link" href="https://arxiv.org/abs/2112.01501" {...externalLinkProps}>
                  Read paper <Arrow />
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="photo-break" aria-label="Leshan Zhao presenting research">
          <div className="photo-frame">
            <img
              src="/leshan-zhao-presenting.jpg"
              alt="Leshan Zhao presenting a poster on quenched disorder in a quantum spin liquid candidate"
            />
          </div>
          <div className="photo-note">
            <span>Field notes / 2025</span>
            <p>
              Presenting at the CHRNS Summer School on Neutron Spectroscopy.
              Photograph by Yiming Qiu, NCNR / NIST.
            </p>
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-heading">
          <p className="eyebrow light">Let&apos;s connect</p>
          <h2 id="contact-heading">Research is a conversation.</h2>
          <p className="contact-lede">
            I&apos;m always interested in thoughtful discussions about quantum
            materials, neutron scattering, scientific software, and physics-aware
            machine learning.
          </p>
          <div className="contact-links">
            <a href="mailto:lzhao53@jhu.edu">Email <Arrow /></a>
            <a href="https://github.com/leshanz" {...externalLinkProps}>GitHub <Arrow /></a>
            <a href="https://www.linkedin.com/in/leshanzhao" {...externalLinkProps}>LinkedIn <Arrow /></a>
          </div>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Leshan Zhao</span>
        <span>Physics, computation, and careful questions.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
