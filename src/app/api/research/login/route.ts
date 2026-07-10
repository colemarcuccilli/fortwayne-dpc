import { NextResponse } from "next/server";
import {
  RESEARCH_COOKIE,
  createResearchSession,
  verifyResearcherPassword,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const password = form?.get("password");
  const next = form?.get("next");

  if (typeof password !== "string" || !verifyResearcherPassword(password)) {
    const url = new URL("/research/login", request.url);
    url.searchParams.set("error", "1");
    if (typeof next === "string" && next) url.searchParams.set("next", next);
    return NextResponse.redirect(url, { status: 303 });
  }

  const nextPath =
    typeof next === "string" && next.startsWith("/research") ? next : "/research";
  const res = NextResponse.redirect(new URL(nextPath, request.url), {
    status: 303,
  });
  res.cookies.set(RESEARCH_COOKIE, createResearchSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
