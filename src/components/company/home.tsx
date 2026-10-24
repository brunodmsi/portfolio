"use client";

import { useState } from "react";
import { ContactForm } from "./contact-form";
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
    howLabel: "How we work",
    how: [
      "We start from the problem, with the people who live it, before choosing a tool.",
      "We design and build end to end, and stay involved from the first draft to delivery.",
      "We keep what we build understandable, so the team that uses it can keep it going.",
    ],
    contactLabel: "Contact",
    contactTitle: "Tell us what needs to exist.",
    contactBody: "Describe the problem in your own words. A short message is enough to start.",
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
    howLabel: "Como trabalhamos",
    how: [
      "Partimos do problema, com quem vive o problema, antes de escolher uma ferramenta.",
      "Desenhamos e construímos ponta a ponta, e acompanhamos desde o primeiro rascunho até a entrega.",
      "Deixamos o que construímos compreensível, para que quem usa consiga mantê-lo.",
    ],
    contactLabel: "Contato",
    contactTitle: "Conte o que precisa existir.",
    contactBody: "Descreva o problema com as suas palavras. Uma mensagem curta basta para começar.",
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

      <section className="company-how" aria-label={t.howLabel}>
        <p className="company-label">{t.howLabel}</p>
        <ol>
          {t.how.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section id="contact" className="company-contact" aria-labelledby="contact-title">
        <div className="company-contact-intro">
          <p className="company-label">{t.contactLabel}</p>
          <h2 id="contact-title" className="company-contact-title">{t.contactTitle}</h2>
          <p className="company-body">{t.contactBody}</p>
        </div>
        <ContactForm lang={lang} />
      </section>

      <footer className="company-footer">
        <nav aria-label="Links">
          <a href="/founder">{t.founder}</a>
          <a href="#contact">{t.contact}</a>
          <a href="mailto:bruno@demasi.dev">bruno@demasi.dev</a>
        </nav>
        <p className="company-registry">
          <span className="company-label">{t.registryLabel}</span> {t.registry}
        </p>
      </footer>
    </main>
  );
}
