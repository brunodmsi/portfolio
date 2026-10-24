"use client";

import { FormEvent, useState } from "react";

type Lang = "en" | "pt";
type Status = "idle" | "sending" | "sent" | "invalid" | "unavailable" | "error";

const copy = {
  en: {
    name: "Name",
    email: "Email",
    company: "Company (optional)",
    message: "What do you need built?",
    honeypot: "Leave this field empty",
    submit: "Send message",
    sending: "Sending…",
    sent: "Message sent. I will reply by email.",
    invalid: "Check the fields: name, a valid email and a message are required.",
    unavailable: "The form is not connected yet. Write to bruno@demasi.dev instead.",
    error: "The message could not be sent. Try again or write to bruno@demasi.dev.",
  },
  pt: {
    name: "Nome",
    email: "E-mail",
    company: "Empresa (opcional)",
    message: "O que você precisa construir?",
    honeypot: "Deixe este campo vazio",
    submit: "Enviar mensagem",
    sending: "Enviando…",
    sent: "Mensagem enviada. Respondo por e-mail.",
    invalid: "Confira os campos: nome, um e-mail válido e a mensagem são obrigatórios.",
    unavailable: "O formulário ainda não está conectado. Escreva para bruno@demasi.dev.",
    error: "Não foi possível enviar. Tente de novo ou escreva para bruno@demasi.dev.",
  },
} as const;

export function ContactForm({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.reset();
        setStatus("sent");
        return;
      }
      if (res.status === 400) setStatus("invalid");
      else if (res.status === 503) setStatus("unavailable");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="contact-row">
        <label className="contact-field">
          <span>{t.name}</span>
          <input name="name" type="text" autoComplete="name" maxLength={120} required />
        </label>
        <label className="contact-field">
          <span>{t.email}</span>
          <input name="email" type="email" autoComplete="email" maxLength={200} required />
        </label>
      </div>
      <label className="contact-field">
        <span>{t.company}</span>
        <input name="company" type="text" autoComplete="organization" maxLength={120} />
      </label>
      <label className="contact-field">
        <span>{t.message}</span>
        <textarea name="message" rows={6} maxLength={4000} required />
      </label>
      <label className="contact-honeypot" aria-hidden="true">
        <span>{t.honeypot}</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="contact-actions">
        <button type="submit" className="contact-submit" disabled={sending}>
          {sending ? t.sending : t.submit}
        </button>
        <p className="contact-status" role="status" aria-live="polite">
          {status === "sent" && t.sent}
          {status === "invalid" && t.invalid}
          {status === "unavailable" && t.unavailable}
          {status === "error" && t.error}
        </p>
      </div>
    </form>
  );
}
