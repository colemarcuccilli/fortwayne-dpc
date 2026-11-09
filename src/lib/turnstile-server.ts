// SERVER-ONLY Cloudflare Turnstile verification.
//
// The client widget alone proves nothing — a bot can POST straight to the
// API and skip the browser entirely. Every token must be redeemed here
// against Cloudflare's siteverify endpoint before we accept a submission.
//
// Tokens are single-use and expire after ~5 minutes.

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const SECRET = process.env.TURNSTILE_SECRET_KEY ?? "";

/** True when the secret is configured — verification is enforced. */
export const TURNSTILE_CONFIGURED = Boolean(SECRET);

export interface TurnstileResult {
  ok: boolean;
  /** Cloudflare error codes, for logging. */
  errors?: string[];
}

/**
 * Verify a Turnstile token. Returns ok:true when the challenge passed.
 *
 * If no secret is configured (local dev / bare preview) verification is
 * SKIPPED so forms keep working — it logs a warning so this can't rot
 * silently. In production the secret is set, so this always enforces.
 */
export async function verifyTurnstile(
  token: string | undefined | null,
  remoteIp?: string | null,
): Promise<TurnstileResult> {
  if (!TURNSTILE_CONFIGURED) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY not set — skipping check");
    return { ok: true };
  }
  if (!token || typeof token !== "string") {
    return { ok: false, errors: ["missing-input-response"] };
  }

  try {
    const body = new URLSearchParams();
    body.set("secret", SECRET);
    body.set("response", token);
    if (remoteIp) body.set("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      console.error("[turnstile] siteverify HTTP", res.status);
      return { ok: false, errors: [`http-${res.status}`] };
    }
    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    if (!data.success) {
      console.warn("[turnstile] rejected:", data["error-codes"]);
      return { ok: false, errors: data["error-codes"] };
    }
    return { ok: true };
  } catch (err) {
    // Network failure reaching Cloudflare. Fail CLOSED — a submission that
    // can't be verified isn't accepted; the visitor is asked to retry.
    console.error("[turnstile] verify error:", err);
    return { ok: false, errors: ["verify-unreachable"] };
  }
}

/** Best-effort client IP from proxy headers. */
export function clientIpFrom(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return request.headers.get("cf-connecting-ip");
}
