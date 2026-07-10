import { NextResponse } from "next/server";
import { RESEARCH_COOKIE } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/research/login", request.url), {
    status: 303,
  });
  res.cookies.set(RESEARCH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
