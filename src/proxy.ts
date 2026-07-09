// Route protection for the admin backend + member portal.
//
// Anything under /admin (except /admin/login) requires a valid signed
// admin session cookie. Anything under /portal (except /portal/login)
// requires a valid signed portal session cookie. Unauthenticated
// requests are rewritten to the appropriate login page.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, PORTAL_COOKIE, readAdminSession, readPortalSession } from "@/lib/admin/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin gate
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
    const who = readAdminSession(cookie);
    if (!who) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Portal gate
  if (pathname.startsWith("/portal") && !pathname.startsWith("/portal/login")) {
    const cookie = request.cookies.get(PORTAL_COOKIE)?.value;
    const who = readPortalSession(cookie);
    if (!who) {
      const url = request.nextUrl.clone();
      url.pathname = "/portal/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/portal/:path*",
  ],
};
