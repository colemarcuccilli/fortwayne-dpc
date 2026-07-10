// Route protection for the admin backend, member portal, and research
// console.
//
//   /admin/*     → requires admin session (except /admin/login)
//   /portal/*    → requires portal session (except /portal/login)
//   /research/*  → requires research OR admin session (except /research/login)
//
// The research scope is lower-privilege: the cowork research agent can
// reach /research to add prospects but nothing else. An admin session
// also satisfies the research gate so Cole can use it without a second
// login.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  PORTAL_COOKIE,
  RESEARCH_COOKIE,
  readAdminSession,
  readPortalSession,
  readResearchSession,
} from "@/lib/admin/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin gate
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const who = readAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);
    if (!who) return redirectTo(request, "/admin/login", pathname);
  }

  // Research gate — admin OR research session satisfies it
  if (
    pathname.startsWith("/research") &&
    !pathname.startsWith("/research/login")
  ) {
    const admin = readAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);
    const researcher = readResearchSession(
      request.cookies.get(RESEARCH_COOKIE)?.value,
    );
    if (!admin && !researcher)
      return redirectTo(request, "/research/login", pathname);
  }

  // Portal gate
  if (pathname.startsWith("/portal") && !pathname.startsWith("/portal/login")) {
    const who = readPortalSession(request.cookies.get(PORTAL_COOKIE)?.value);
    if (!who) return redirectTo(request, "/portal/login", pathname);
  }

  return NextResponse.next();
}

function redirectTo(request: NextRequest, loginPath: string, next: string) {
  const url = request.nextUrl.clone();
  url.pathname = loginPath;
  url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/research/:path*"],
};
