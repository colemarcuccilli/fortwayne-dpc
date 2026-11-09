// Builds and sends the two emails triggered by a public form submission:
//   1. a confirmation to the person who submitted (if they left an email)
//   2. a notification to Dr. Kal so the practice knows a form came in
//
// Called server-side from /api/public/submission after the row is saved.
// sendSubmissionEmails() never throws — email is best-effort on top of the
// submission, which has already been persisted by the time we get here.

import type { Submission, FormValue } from "@/lib/admin/types";
import { sendEmail } from "./resend";

const DOCTOR_EMAIL =
  process.env.DOCTOR_NOTIFY_EMAIL ?? "Vikimedicalllc@gmail.com";
const SITE_URL = (
  process.env.SITE_URL ?? "https://www.fortwaynedpc.com"
).replace(/\/+$/, "");
const PRACTICE = "Fort Wayne Direct Primary Care";
const ACCENT = "#1257a0";
const INK = "#0f2540";

// -------------------- small helpers --------------------

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function val(v: FormValue | undefined): string {
  if (v == null) return "";
  return Array.isArray(v) ? v.join(", ") : String(v);
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || "there";
}

const TYPE_LABEL: Record<Submission["type"], string> = {
  contact: "message",
  patient: "new patient intake",
  employer: "employer inquiry",
};

/** Branded wrapper. `preheader` is hidden inbox-preview text. */
function layout(bodyHtml: string, preheader: string): string {
  return `
<div style="margin:0;padding:0;background:#f4f6f9;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${esc(
    preheader,
  )}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e9f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="background:${INK};padding:20px 28px;">
          <div style="color:#ffffff;font-size:16px;font-weight:700;letter-spacing:0.2px;">${PRACTICE}</div>
        </td></tr>
        <tr><td style="padding:28px;color:#24303f;font-size:15px;line-height:1.6;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:18px 28px;background:#f7f9fc;border-top:1px solid #eef1f6;color:#8a97a8;font-size:12px;line-height:1.5;">
          ${PRACTICE} · Fort Wayne, Indiana<br/>
          <a href="${SITE_URL}" style="color:${ACCENT};text-decoration:none;">fortwaynedpc.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`;
}

/** A labeled detail table from [label, value] pairs (blank values skipped). */
function detailRows(pairs: [string, string][]): string {
  const rows = pairs
    .filter(([, v]) => v && v.trim())
    .map(
      ([label, v]) => `
      <tr>
        <td style="padding:6px 12px 6px 0;color:#7a8699;font-size:13px;vertical-align:top;white-space:nowrap;">${esc(
          label,
        )}</td>
        <td style="padding:6px 0;color:#1f2b3a;font-size:14px;font-weight:500;">${esc(
          v,
        )}</td>
      </tr>`,
    )
    .join("");
  if (!rows) return "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:14px 0 4px;">${rows}</table>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:18px;background:${ACCENT};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 20px;border-radius:8px;">${esc(
    label,
  )}</a>`;
}

// -------------------- client confirmation --------------------

function clientEmail(sub: Submission): { subject: string; html: string } | null {
  if (!sub.email) return null; // nothing to send to
  const hi = `Hi ${esc(firstName(sub.name))},`;

  if (sub.type === "patient") {
    const fd = sub.formData ?? {};
    const details = detailRows([
      ["Name", sub.name],
      ["Date of birth", val(fd.dob)],
      ["Phone", sub.phone ?? val(fd.cell_phone)],
      ["Email", sub.email],
      ["Reason for visit", val(fd.chief_complaint)],
    ]);
    const body = `
      <p style="margin:0 0 14px;">${hi}</p>
      <p style="margin:0 0 14px;">Thank you for completing your new patient intake with ${PRACTICE}. We've securely received your information and our team will reach out to schedule your visit.</p>
      <p style="margin:0 0 4px;color:#7a8699;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">What we received</p>
      ${details}
      <p style="margin:16px 0 0;color:#6b7688;font-size:13px;">For your privacy, your full health history isn't included in this email — it's stored securely and reviewed only by your care team. If any details above are wrong, just reply to this message.</p>`;
    return {
      subject: `We received your new patient intake — ${PRACTICE}`,
      html: layout(body, "Your new patient intake was received."),
    };
  }

  if (sub.type === "employer") {
    const meta = sub.meta ?? {};
    const details = detailRows([
      ["Company", String(meta.company ?? "")],
      ["Employees", meta.employees != null ? String(meta.employees) : ""],
      ["Contact", sub.name],
      ["Email", sub.email],
      ["Phone", sub.phone ?? ""],
    ]);
    const body = `
      <p style="margin:0 0 14px;">${hi}</p>
      <p style="margin:0 0 14px;">Thanks for your interest in offering ${PRACTICE} to your team. We received your request for a custom estimate and will follow up shortly.</p>
      <p style="margin:0 0 4px;color:#7a8699;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">What you sent</p>
      ${details}`;
    return {
      subject: `Thanks for your interest — ${PRACTICE}`,
      html: layout(body, "We received your employer inquiry."),
    };
  }

  // contact
  const details = detailRows([
    ["Name", sub.name],
    ["Email", sub.email],
    ["Phone", sub.phone ?? ""],
  ]);
  const message = sub.message
    ? `<p style="margin:0 0 4px;color:#7a8699;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Your message</p>
       <div style="background:#f7f9fc;border:1px solid #eef1f6;border-radius:8px;padding:12px 14px;color:#2a3546;font-size:14px;white-space:pre-wrap;">${esc(
         sub.message,
       )}</div>`
    : "";
  const body = `
    <p style="margin:0 0 14px;">${hi}</p>
    <p style="margin:0 0 14px;">Thanks for reaching out to ${PRACTICE}. We received your message and someone from our team will get back to you soon.</p>
    ${message}
    ${details}`;
  return {
    subject: `We got your message — ${PRACTICE}`,
    html: layout(body, "We received your message."),
  };
}

// -------------------- doctor notification --------------------

function doctorEmail(sub: Submission): { subject: string; html: string } {
  const label = TYPE_LABEL[sub.type];
  const contact = detailRows([
    ["Name", sub.name],
    ["Email", sub.email ?? ""],
    ["Phone", sub.phone ?? ""],
  ]);

  let extra = "";
  let cta = "";

  if (sub.type === "patient") {
    const fd = sub.formData ?? {};
    extra = detailRows([
      ["Date of birth", val(fd.dob)],
      ["Reason for visit", val(fd.chief_complaint)],
    ]);
    cta = button(
      `${SITE_URL}/admin/patient-forms/${sub.id}`,
      "View & download the full intake",
    );
  } else if (sub.type === "employer") {
    const meta = sub.meta ?? {};
    extra = detailRows([
      ["Company", String(meta.company ?? "")],
      ["Employees", meta.employees != null ? String(meta.employees) : ""],
      [
        "Potential savings (est.)",
        meta.potentialSavings != null
          ? `$${Number(meta.potentialSavings).toLocaleString()}`
          : "",
      ],
    ]);
    cta = button(`${SITE_URL}/admin/inbox`, "Open in admin");
  } else {
    // contact
    if (sub.message) {
      extra = `<p style="margin:14px 0 4px;color:#7a8699;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Message</p>
        <div style="background:#f7f9fc;border:1px solid #eef1f6;border-radius:8px;padding:12px 14px;color:#2a3546;font-size:14px;white-space:pre-wrap;">${esc(
          sub.message,
        )}</div>`;
    }
    const heard = sub.meta?.heardAbout ? String(sub.meta.heardAbout) : "";
    if (heard) extra += detailRows([["Heard about us", heard]]);
    cta = button(`${SITE_URL}/admin/inbox`, "Open in admin");
  }

  const body = `
    <p style="margin:0 0 4px;color:${ACCENT};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">New ${esc(
      label,
    )}</p>
    <p style="margin:0 0 14px;font-size:18px;font-weight:700;color:${INK};">${esc(
      sub.name,
    )}</p>
    ${contact}
    ${extra}
    ${cta}`;

  return {
    subject: `New ${label}: ${sub.name}`,
    html: layout(body, `New ${label} from ${sub.name}`),
  };
}

// -------------------- entry point --------------------

/** Send confirmation + doctor notification for a submission. Never throws. */
export async function sendSubmissionEmails(sub: Submission): Promise<void> {
  try {
    const client = clientEmail(sub);
    const doctor = doctorEmail(sub);
    await Promise.all([
      sendEmail({
        to: DOCTOR_EMAIL,
        subject: doctor.subject,
        html: doctor.html,
        replyTo: sub.email, // Dr. Kal can reply straight to the submitter
      }),
      client
        ? sendEmail({
            to: sub.email!,
            subject: client.subject,
            html: client.html,
            replyTo: DOCTOR_EMAIL,
          })
        : Promise.resolve(false),
    ]);
  } catch (err) {
    console.error("[email] sendSubmissionEmails failed:", err);
  }
}
