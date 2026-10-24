"use client";

import { useState } from "react";
import "./home.css";

type Lang = "en" | "pt";

const copy = {
  en: {
    lang: "PT",
    title: "Tools for problems that deserve their own software.",
    body: "Some work does not fit a ready-made product. DE MASI exists to design and build those tools and, when a problem repeats often enough, to create products of its own.",
    principlesLabel: "Principles",
    principles: [
      "Custom when the problem belongs to a client.",
      "Its own when the problem belongs to many.",
      "No product exists only to look good in a portfolio.",
    ],
    founder: "Founder",
    contact: "Contact",
    registryLabel: "Registry",
    registry:
      "DE MASI SOFTWARE SOLUTIONS AND SERVICES LTDA · trading name DE MASI DEVELOPMENT · Belém, Pará, Brazil · active since March 27, 2023",
    switchLabel: "Português",
  },
  pt: {
    lang: "EN",
    title: "Ferramentas para problemas que merecem software próprio.",
    body: "Algumas tarefas não cabem num produto pronto. A DE MASI existe para desenhar e construir essas ferramentas e, quando um problema se repete o bastante, para criar produtos próprios.",
    principlesLabel: "Princípios",
    principles: [
      "Sob medida quando o problema é de um cliente.",
      "Próprio quando o problema é de muitos.",
      "Nenhum produto existe só para aparecer num portfólio.",
    ],
    founder: "Fundador",
    contact: "Contato",
    registryLabel: "Registro",
    registry:
      "DE MASI SOFTWARE SOLUTIONS AND SERVICES LTDA · nome fantasia DE MASI DEVELOPMENT · Belém (PA) · ativa desde 27/03/2023",
    switchLabel: "English",
  },
} as const;

export function CompanyHome() {
  const [lang, setLang] = useState<Lang>("en");
  const t = copy[lang];

  return (
    <main className="company-home" lang={lang === "en" ? "en" : "pt-BR"}>
      <header className="company-top">
        <a className="company-mark" href="#top" aria-label="DE MASI SOFTWARE">
          DE MASI<span className="company-dot" aria-hidden="true" /> SOFTWARE
        </a>
        <button
          type="button"
          className="company-lang"
          onClick={() => setLang(lang === "en" ? "pt" : "en")}
          aria-label={t.switchLabel}
        >
          {t.lang}
        </button>
      </header>

      <section id="top" className="company-intro">
        <h1 className="company-title">{t.title}</h1>
        <p className="company-body">{t.body}</p>
      </section>

      <section className="company-principles" aria-label={t.principlesLabel}>
        <p className="company-label">{t.principlesLabel}</p>
        <ol>
          {t.principles.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <footer className="company-footer">
        <nav aria-label="Links">
          <a href="/founder">{t.founder}</a>
          <a href="mailto:bruno@demasi.dev">{t.contact}</a>
        </nav>
        <p className="company-registry">
          <span className="company-label">{t.registryLabel}</span> {t.registry}
        </p>
      </footer>
    </main>
  );
}
