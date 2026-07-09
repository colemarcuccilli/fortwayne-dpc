import { NextResponse } from "next/server";
import { PORTAL_COOKIE, createPortalSession } from "@/lib/admin/auth";

// Demo portal login — accepts any known-format email + non-empty password.
// Swap for real member auth (Supabase) when membership db is wired.

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const email = form?.get("email");
  const password = form?.get("password");
  const next = form?.get("next");

  const emailOk =
    typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passOk = typeof password === "string" && password.length >= 4;

  if (!emailOk || !passOk) {
    const url = new URL("/portal/login", request.url);
    url.searchParams.set("error", "1");
    if (typeof next === "string" && next) url.searchParams.set("next", next);
    return NextResponse.redirect(url, { status: 303 });
  }

  const nextPath =
    typeof next === "string" && next.startsWith("/portal") ? next : "/portal";
  const destination = new URL(nextPath, request.url);
  const res = NextResponse.redirect(destination, { status: 303 });
  res.cookies.set(PORTAL_COOKIE, createPortalSession(email as string), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
