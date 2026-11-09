// Server-side session checks for API route handlers.
//
// The /admin, /research, /portal *pages* are gated by proxy.ts, but API
// routes need their own check — a route handler is reachable directly by
// URL regardless of the page middleware. These read the same signed
// cookies and return the session subject (or null).

import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  RESEARCH_COOKIE,
  readAdminSession,
  readResearchSession,
} from "./auth";

/** Returns the admin subject, or null if there's no valid admin session. */
export async function requireAdmin(): Promise<string | null> {
  const jar = await cookies();
  return readAdminSession(jar.get(ADMIN_COOKIE)?.value);
}

/**
 * Research console is lower-privilege: an admin OR research session
 * satisfies it (mirrors the proxy.ts rule).
 */
export async function requireResearchOrAdmin(): Promise<string | null> {
  const jar = await cookies();
  const admin = readAdminSession(jar.get(ADMIN_COOKIE)?.value);
  if (admin) return admin;
  return readResearchSession(jar.get(RESEARCH_COOKIE)?.value);
}
