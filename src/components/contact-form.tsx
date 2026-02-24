"use client";

import { useActionState, useRef, useEffect } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Send, CheckCircle } from "lucide-react";
import { sendContactEmail } from "../app/actions";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactEmail, {
    success: false,
    error: null,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder="// name"
          className="input-field"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="// email *"
          className="input-field"
        />
      </div>
      <textarea
        name="message"
        required
        rows={4}
        placeholder="// message *"
        className="input-field resize-none"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            options={{ theme: "dark", size: "compact" }}
          />
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-send sm:ml-auto"
        >
          {pending ? (
            "transmitting..."
          ) : state.success ? (
            <>
              <CheckCircle size={16} />
              sent
            </>
          ) : (
            <>
              <Send size={16} />
              send
            </>
          )}
        </button>
      </div>

      {state.error && (
        <p className="font-mono text-xs text-red-400">{state.error}</p>
      )}
      {state.success && (
        <p className="font-mono text-xs text-emerald-400">
          message transmitted successfully.
        </p>
      )}
    </form>
  );
}
