// Minimal auth layer for the admin panel.
//
// Signed session cookie (HMAC-SHA256) — no external auth provider,
// no database. The password + secret come from env vars with dev
// fallbacks so the branch preview works out of the box.
//
// This is a first-pass auth for a private admin surface behind a
// hidden URL. If this becomes patient-facing production infra, swap
// to Clerk / NextAuth / Supabase Auth.

import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "fwdpc_admin_session";
const PORTAL_COOKIE_NAME = "fwdpc_portal_session";
const RESEARCH_COOKIE_NAME = "fwdpc_research_session";

// Dev fallbacks — override in Vercel env for production
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "fwdpc-admin-2026";
// Separate, lower-privilege password for the research agent. It can only
// reach /research (add prospects). It cannot see customers, transactions,
// charts, or any patient data.
const RESEARCHER_PASSWORD =
  process.env.RESEARCHER_PASSWORD ?? "fwdpc-research-2026";
const AUTH_SECRET = process.env.AUTH_SECRET ?? "dev-secret-not-for-production-6a5f";
const SESSION_TTL_HOURS = 24 * 7;

function sign(payload: string): string {
  return createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
}

function encode(scope: "admin" | "portal" | "research", who: string): string {
  const expiresAt = Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000;
  const payload = `${scope}:${who}:${expiresAt}`;
  const sig = sign(payload);
  return `${payload}:${sig}`;
}

function decode(token: string | undefined | null): { scope: string; who: string; expiresAt: number } | null {
  if (!token) return null;
  const parts = token.split(":");
  if (parts.length !== 4) return null;
  const [scope, who, expiresAtStr, sig] = parts;
  const payload = `${scope}:${who}:${expiresAtStr}`;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  const expiresAt = Number(expiresAtStr);
  if (Number.isNaN(expiresAt) || expiresAt < Date.now()) return null;
  return { scope, who, expiresAt };
}

function constantTimeEquals(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function verifyAdminPassword(pw: string): boolean {
  if (!pw) return false;
  return constantTimeEquals(pw, ADMIN_PASSWORD);
}

export function verifyResearcherPassword(pw: string): boolean {
  if (!pw) return false;
  return constantTimeEquals(pw, RESEARCHER_PASSWORD);
}

export function createAdminSession(who = "admin"): string {
  return encode("admin", who);
}

export function createPortalSession(email: string): string {
  return encode("portal", email);
}

export function createResearchSession(who = "research-agent"): string {
  return encode("research", who);
}

export function readAdminSession(cookieValue: string | undefined): string | null {
  const decoded = decode(cookieValue);
  if (!decoded || decoded.scope !== "admin") return null;
  return decoded.who;
}

export function readPortalSession(cookieValue: string | undefined): string | null {
  const decoded = decode(cookieValue);
  if (!decoded || decoded.scope !== "portal") return null;
  return decoded.who;
}

export function readResearchSession(
  cookieValue: string | undefined,
): string | null {
  const decoded = decode(cookieValue);
  if (!decoded || decoded.scope !== "research") return null;
  return decoded.who;
}

export const ADMIN_COOKIE = COOKIE_NAME;
export const PORTAL_COOKIE = PORTAL_COOKIE_NAME;
export const RESEARCH_COOKIE = RESEARCH_COOKIE_NAME;
