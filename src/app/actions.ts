"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormState {
  success: boolean;
  error: string | null;
}

export async function sendContactEmail(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const token = formData.get("cf-turnstile-response") as string;

  if (!email || !message) {
    return { success: false, error: "Email and message are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 254) {
    return { success: false, error: "Invalid email address." };
  }
  if (message.length > 5000) {
    return { success: false, error: "Message too long." };
  }
  if (name && name.length > 100) {
    return { success: false, error: "Name too long." };
  }

  if (!token) {
    return { success: false, error: "Please complete the captcha." };
  }

  // Verify Turnstile token
  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
    }
  );

  const verification = await verifyRes.json();
  if (!verification.success) {
    return { success: false, error: "Captcha verification failed." };
  }

  // Send email via Resend
  const { error } = await resend.emails.send({
    from: "Portfolio <portfolio@demasi.dev>",
    to: "bruno@demasi.dev",
    subject: `Portfolio contact from ${name || "Anonymous"}`,
    replyTo: email,
    text: `From: ${name || "Anonymous"} <${email}>\n\n${message}`,
  });

  if (error) {
    return { success: false, error: "Failed to send message." };
  }

  return { success: true, error: null };
}
