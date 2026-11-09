"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSubmissionLocal } from "@/lib/admin/public-submission";
import { Turnstile, TURNSTILE_ENABLED } from "@/components/marketing/turnstile";
import { SUBMIT_ERROR } from "@/lib/submit-error";

interface ContactFormProps {
  heardAboutOptions?: string[];
}

/** Contact form. Bot-protected by Turnstile and verified server-side. */
export function ContactForm({ heardAboutOptions }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border/70 bg-surface p-8">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
          Message received
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
          Thanks — we&rsquo;ll be in touch shortly.
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The office will respond to your message the same or next business day.
          For urgent matters, please call the number listed to the right.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (sending) return;
        const data = new FormData(e.currentTarget);
        const firstName = String(data.get("firstName") ?? "");
        const lastName = String(data.get("lastName") ?? "");
        const email = String(data.get("email") ?? "");
        const phone = String(data.get("phone") ?? "");
        const message = String(data.get("message") ?? "");
        const heardAbout = String(data.get("heardAbout") ?? "");

        setSending(true);
        setError(null);
        const result = await saveSubmissionLocal(
          {
            type: "contact",
            name: `${firstName} ${lastName}`.trim(),
            email: email || undefined,
            phone: phone || undefined,
            message: message || undefined,
            meta: heardAbout ? { heardAbout } : undefined,
          },
          token,
        );
        setSending(false);

        if (result.ok) {
          setSubmitted(true);
        } else {
          setError(SUBMIT_ERROR(result.reason));
          setToken(null);
          setResetSignal((n) => n + 1); // tokens are single-use
        }
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" name="firstName" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" name="lastName" required />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">How can we help?</Label>
        <Textarea id="message" name="message" rows={5} required />
      </div>

      {heardAboutOptions && (
        <div className="space-y-2">
          <Label htmlFor="heardAbout">How did you hear about us?</Label>
          <select
            id="heardAbout"
            name="heardAbout"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Select an option
            </option>
            {heardAboutOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      <Turnstile onVerify={setToken} resetSignal={resetSignal} />

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={sending || (TURNSTILE_ENABLED && !token)}
        className="bg-brand text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
      >
        {sending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
