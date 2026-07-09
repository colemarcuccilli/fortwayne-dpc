import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSession, verifyAdminPassword } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const password = form?.get("password");
  const next = form?.get("next");

  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("error", "1");
    if (typeof next === "string" && next) url.searchParams.set("next", next);
    return NextResponse.redirect(url, { status: 303 });
  }

  const nextPath =
    typeof next === "string" && next.startsWith("/admin") ? next : "/admin";
  const destination = new URL(nextPath, request.url);
  const res = NextResponse.redirect(destination, { status: 303 });
  res.cookies.set(ADMIN_COOKIE, createAdminSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
