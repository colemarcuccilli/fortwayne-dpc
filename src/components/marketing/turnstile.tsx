"use client";

// Cloudflare Turnstile widget (privacy-preserving CAPTCHA).
//
// Uses EXPLICIT rendering rather than the implicit `class="cf-turnstile"`
// scan: the implicit scan only runs once when the script loads, which
// misses widgets mounted later via client-side navigation. Explicit
// render + remove keeps it correct no matter how the form is reached.
//
// The site key is public by design (NEXT_PUBLIC_*). The secret key lives
// server-side only and is never referenced here.

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** True when a site key is configured — forms gate on this. */
export const TURNSTILE_ENABLED = Boolean(SITE_KEY);

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Singleton loader — many widgets, one <script>.
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile")));
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile script failed to load"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

interface TurnstileProps {
  /** Called with a token when solved, or null when expired / errored. */
  onVerify: (token: string | null) => void;
  /** Bump this number to force a fresh challenge (e.g. after a failed submit). */
  resetSignal?: number;
  className?: string;
}

export function Turnstile({
  onVerify,
  resetSignal = 0,
  className,
}: TurnstileProps) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  // Keep the latest callback without re-rendering the widget.
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;

  useEffect(() => {
    if (!TURNSTILE_ENABLED) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !boxRef.current || !window.turnstile) return;
        // Guard against double-render (React strict mode mounts twice).
        if (widgetIdRef.current) return;
        widgetIdRef.current = window.turnstile.render(boxRef.current, {
          sitekey: SITE_KEY,
          callback: (token: string) => onVerifyRef.current(token),
          "expired-callback": () => onVerifyRef.current(null),
          "error-callback": () => onVerifyRef.current(null),
          theme: "light",
        });
      })
      .catch((err) => {
        console.error("[turnstile]", err);
        onVerifyRef.current(null);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* widget already gone */
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  // Re-challenge on demand.
  useEffect(() => {
    if (resetSignal > 0 && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onVerifyRef.current(null);
    }
  }, [resetSignal]);

  if (!TURNSTILE_ENABLED) return null;
  return <div ref={boxRef} className={className} />;
}
