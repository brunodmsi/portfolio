"use client";

import Link from "next/link";
import { useState } from "react";
import "./home.css";

type Lang = "en" | "pt";

const copy = {
  en: {
    lang: "PT",
    back: "DE MASI SOFTWARE",
    role: "Senior software engineer · Belém, Brazil",
    bio: "I build tools that make everyday workflows smaller. Most of my work is in Rust and TypeScript, from command-line utilities to product code.",
    trajectoryLabel: "Trajectory",
    trajectory: ["Karma", "Terras", "CI&T"],
    contactLabel: "Contact",
    switchLabel: "Português",
  },
  pt: {
    lang: "EN",
    back: "DE MASI SOFTWARE",
    role: "Engenheiro de software sênior · Belém, Brasil",
    bio: "Construo ferramentas que tornam o trabalho do dia a dia mais simples. Grande parte do meu trabalho é em Rust e TypeScript, de utilitários de linha de comando ao código de produto.",
    trajectoryLabel: "Trajetória",
    trajectory: ["Karma", "Terras", "CI&T"],
    contactLabel: "Contato",
    switchLabel: "English",
  },
} as const;

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
        <ul className="founder-trajectory">
          {t.trajectory.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
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
