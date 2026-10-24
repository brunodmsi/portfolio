import { NextResponse } from "next/server";

const LIMITS = { name: 120, email: 200, company: 120, message: 4000 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Honeypot: real visitors leave this field empty; bots tend to fill it.
  if (field(body.website, 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = field(body.name, LIMITS.name);
  const email = field(body.email, LIMITS.email);
  const company = field(body.company, LIMITS.company);
  const message = field(body.message, LIMITS.message);

  if (!name || !message || !EMAIL.test(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const sentAt = new Date().toISOString();
  const apiKey = process.env.MAILERSEND_API_KEY;
  const endpoint = process.env.CONTACT_WEBHOOK_URL;

  if (apiKey ? !process.env.CONTACT_FROM_EMAIL : !endpoint) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  try {
    const res = apiKey
      ? await sendWithMailerSend(apiKey, { name, email, company, message, sentAt })
      : await fetch(endpoint as string, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, email, company, message, sentAt }),
          signal: AbortSignal.timeout(8000),
        });
    if (!res.ok) {
      return NextResponse.json({ error: "delivery" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "delivery" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

type Message = { name: string; email: string; company: string; message: string; sentAt: string };

// MailerSend transactional API: https://developers.mailersend.com/api/v1/email.html
// CONTACT_FROM_EMAIL must be a sender on a domain verified in MailerSend.
// CONTACT_TO_EMAIL is where messages land (defaults to contact@demasi.dev).
function sendWithMailerSend(apiKey: string, msg: Message) {
  const from = process.env.CONTACT_FROM_EMAIL ?? "";
  const to = process.env.CONTACT_TO_EMAIL ?? "contact@demasi.dev";
  const lines = [
    `Nome: ${msg.name}`,
    `E-mail: ${msg.email}`,
    msg.company ? `Empresa: ${msg.company}` : null,
    "",
    msg.message,
    "",
    `Enviado em ${msg.sentAt}`,
  ].filter((line) => line !== null);

  return fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: { email: from, name: "DE MASI SOFTWARE" },
      to: [{ email: to }],
      reply_to: { email: msg.email, name: msg.name },
      subject: `Contato pelo site: ${msg.name}`,
      text: lines.join("\n"),
    }),
    signal: AbortSignal.timeout(8000),
  });
}
