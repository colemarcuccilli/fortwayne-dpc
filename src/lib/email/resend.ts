// SERVER-ONLY transactional email via the Resend HTTP API.
//
// Imported only by server code (API route handlers). Uses RESEND_API_KEY,
// which is never exposed to the browser. sendEmail() never throws — a mail
// failure must never break the request that triggered it.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const API_KEY = process.env.RESEND_API_KEY ?? "";

/** Default From. The fortwaynedpc.com domain is verified in Resend. */
export const DEFAULT_FROM =
  process.env.EMAIL_FROM ?? "Fort Wayne Direct Primary Care <noreply@fortwaynedpc.com>";

/** True when a Resend key is configured. */
export const EMAIL_CONFIGURED = Boolean(API_KEY);

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
}

/** Send one email. Returns true on success, false on any failure. Never throws. */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  if (!EMAIL_CONFIGURED) {
    console.warn("[email] RESEND_API_KEY not set — skipping send");
    return false;
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: input.from ?? DEFAULT_FROM,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[email] send failed ${res.status}: ${body}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send error:", err);
    return false;
  }
}
