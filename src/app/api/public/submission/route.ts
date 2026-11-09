import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { SERVICE_CONFIGURED, insertSubmission } from "@/lib/admin/supabase-server";
import { sendSubmissionEmails } from "@/lib/email/notifications";
import { clientIpFrom, verifyTurnstile } from "@/lib/turnstile-server";
import type { Submission, SubmissionType } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

const VALID_TYPES: SubmissionType[] = ["contact", "patient", "employer"];

function str(v: unknown, max = 5000): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
}

// POST /api/public/submission — the ONLY unauthenticated write. It can
// only insert into `submissions`; id / timestamps / read / archived are
// assigned server-side so a caller can't spoof them.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  // Bot check FIRST — before any parsing work, DB write, or email send.
  const captcha = await verifyTurnstile(
    typeof body.turnstileToken === "string" ? body.turnstileToken : null,
    clientIpFrom(request),
  );
  if (!captcha.ok) {
    return NextResponse.json(
      { error: "captcha_failed", codes: captcha.errors },
      { status: 403 },
    );
  }

  const type = body.type as SubmissionType;
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "bad_type" }, { status: 400 });
  }
  const name = str(body.name, 200);
  if (!name) {
    return NextResponse.json({ error: "name_required" }, { status: 400 });
  }

  // Guard against oversized form_data payloads.
  const formData =
    body.formData && typeof body.formData === "object"
      ? (body.formData as Submission["formData"])
      : undefined;
  if (formData && JSON.stringify(formData).length > 200_000) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  const submission: Submission = {
    id: `s_${nanoid(8)}`,
    type,
    name,
    email: str(body.email, 320),
    phone: str(body.phone, 60),
    subject: str(body.subject, 300),
    message: str(body.message, 20_000),
    meta:
      body.meta && typeof body.meta === "object"
        ? (body.meta as Submission["meta"])
        : undefined,
    formData,
    read: false,
    archived: false,
    createdAt: new Date().toISOString(),
  };

  if (!SERVICE_CONFIGURED) {
    // Bare preview without a service key — nothing to persist to. Still
    // fire the notification emails so the flow can be exercised.
    await sendSubmissionEmails(submission);
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    await insertSubmission(submission);
  } catch (err) {
    console.error("[api/public/submission] insert failed:", err);
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  // Best-effort notifications — never fail the request over email. Awaited
  // so the send completes before this serverless function returns.
  await sendSubmissionEmails(submission);
  return NextResponse.json({ ok: true, persisted: true });
}
