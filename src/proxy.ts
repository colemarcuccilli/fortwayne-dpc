// Hostname-based routing for the two brands.
// In Next 16 the middleware file convention was renamed to `proxy.ts`
// and the exported function is `proxy` (not `middleware`).
//
// Behavior:
//   fortwaynedpc.com/*          → rewrite to /dpc/*
//   www.fortwaynedpc.com/*      → rewrite to /dpc/*
//   indianaloseweight.com/*     → rewrite to /iwl/*
//   www.indianaloseweight.com/* → rewrite to /iwl/*
//   anything else (localhost, vercel preview domains, etc.)
//                                → pass through so you can visit /dpc and
//                                  /iwl directly to preview either brand.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveBrandFromHost } from "@/lib/brands";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  const brand = resolveBrandFromHost(host);

  // No branded hostname → let the request fall through so the dev landing
  // page and explicit /dpc /iwl paths work on localhost and preview URLs.
  if (!brand) return NextResponse.next();

  const { pathname, search } = request.nextUrl;

  // Don't double-prefix if already pointed at the brand's route.
  if (pathname.startsWith(`${brand.prefix}/`) || pathname === brand.prefix) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `${brand.prefix}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip internal Next paths, API routes, and static files.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)).*)",
  ],
};
