"use client";

import Link from "next/link";
import { useState } from "react";
import "./home.css";

type Lang = "en" | "pt";

type Role = { title: string; period: string };
type Entry = { org: string; roles: Role[] };

const copy = {
  en: {
    lang: "PT",
    role: "Software engineer · Belém, Brazil",
    bio: "I design and build reliable systems and tools. Most of my public code is TypeScript and JavaScript, with Python for scripts and Nix for reproducible environments.",
    trajectoryLabel: "Trajectory",
    educationLabel: "Education",
    contactLabel: "Contact",
    present: "present",
    switchLabel: "Português",
    trajectory: [
      { org: "Karma", roles: [{ title: "Software Engineer", period: "Sep 2025 – present" }] },
      { org: "CI&T", roles: [{ title: "Full Stack Engineer", period: "Mar 2024 – Aug 2025" }] },
      {
        org: "Terras App Solutions",
        roles: [
          { title: "Senior Software Engineer", period: "Dec 2024 – Sep 2025" },
          { title: "Full Stack Engineer", period: "Mar 2022 – Dec 2024" },
          { title: "Junior Fullstack Developer", period: "Jul 2021 – Mar 2022" },
          { title: "Trainee Developer", period: "Jan 2021 – Jul 2021" },
        ],
      },
    ] as Entry[],
    education: [
      { org: "FIAP", roles: [{ title: "Postgraduate Certificate, Software Architecture", period: "Jul 2023 – Jun 2024" }] },
      { org: "Cesupa – Centro Universitário do Estado do Pará", roles: [{ title: "Bachelor's degree, Computer Science", period: "" }] },
    ] as Entry[],
  },
  pt: {
    lang: "EN",
    role: "Engenheiro de software · Belém, Brasil",
    bio: "Desenho e construo sistemas e ferramentas confiáveis. Grande parte do meu código público é TypeScript e JavaScript, com Python para scripts e Nix para ambientes reproduzíveis.",
    trajectoryLabel: "Trajetória",
    educationLabel: "Formação",
    contactLabel: "Contato",
    present: "atual",
    switchLabel: "English",
    trajectory: [
      { org: "Karma", roles: [{ title: "Software Engineer", period: "set 2025 – atual" }] },
      { org: "CI&T", roles: [{ title: "Full Stack Engineer", period: "mar 2024 – ago 2025" }] },
      {
        org: "Terras App Solutions",
        roles: [
          { title: "Senior Software Engineer", period: "dez 2024 – set 2025" },
          { title: "Full Stack Engineer", period: "mar 2022 – dez 2024" },
          { title: "Junior Fullstack Developer", period: "jul 2021 – mar 2022" },
          { title: "Trainee Developer", period: "jan 2021 – jul 2021" },
        ],
      },
    ] as Entry[],
    education: [
      { org: "FIAP", roles: [{ title: "Pós-graduação, Arquitetura de Software", period: "jul 2023 – jun 2024" }] },
      { org: "Cesupa – Centro Universitário do Estado do Pará", roles: [{ title: "Bacharelado, Ciência da Computação", period: "" }] },
    ] as Entry[],
  },
} as const;

function EntryList({ entries }: { entries: readonly Entry[] }) {
  return (
    <ul className="founder-trajectory">
      {entries.map((entry) => (
        <li key={entry.org}>
          <p className="founder-org">{entry.org}</p>
          <ul className="founder-roles">
            {entry.roles.map((role) => (
              <li key={role.title + role.period}>
                <span>{role.title}</span>
                {role.period && <span className="founder-period">{role.period}</span>}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function FounderPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = copy[lang];

  return (
    <main className="company-home founder-page" lang={lang === "en" ? "en" : "pt-BR"}>
      <header className="company-top">
        <Link className="company-mark" href="/">
          DE MASI<span className="company-dot" aria-hidden="true" /> SOFTWARE
        </Link>
        <button
          type="button"
          className="company-lang"
          onClick={() => setLang(lang === "en" ? "pt" : "en")}
          aria-label={t.switchLabel}
        >
          {t.lang}
        </button>
      </header>

      <section className="founder-intro">
        <figure className="founder-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/founder/bruno-400.jpg" alt="Bruno De Masi" width={400} height={400} />
        </figure>
        <div className="founder-text">
          <h1 className="company-title founder-name">Bruno De Masi</h1>
          <p className="founder-role">{t.role}</p>
          <p className="company-body">{t.bio}</p>
        </div>
      </section>

      <section className="founder-block">
        <p className="company-label">{t.trajectoryLabel}</p>
        <EntryList entries={t.trajectory} />
      </section>

      <section className="founder-block founder-block--edu">
        <p className="company-label">{t.educationLabel}</p>
        <EntryList entries={t.education} />
      </section>

      <footer className="company-footer">
        <nav aria-label={t.contactLabel}>
          <a href="mailto:bruno@demasi.dev">bruno@demasi.dev</a>
          <a href="https://github.com/brunodmsi">GitHub</a>
          <a href="https://linkedin.com/in/brunodemasi">LinkedIn</a>
        </nav>
      </footer>
    </main>
  );
}
