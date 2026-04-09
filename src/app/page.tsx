import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { BRANDS } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Fort Wayne DPC + Indiana Weight Loss — Preview",
  description:
    "Preview environment for the Fort Wayne Direct Primary Care and Indiana Weight Loss & Aesthetics rebuild.",
};

/**
 * Root landing page. On production, the proxy rewrites requests from
 * fortwaynedpc.com and indianaloseweight.com straight to /dpc and /iwl,
 * so this page is only reached from localhost or a Vercel preview URL.
 * It acts as a brand picker for demos.
 */
export default function RootLandingPage() {
  const cards = [
    {
      brand: BRANDS.dpc,
      description:
        "Primary care practice. Direct, unhurried, monthly membership — no insurance, no copays.",
      href: "/dpc",
      domain: "fortwaynedpc.com",
    },
    {
      brand: BRANDS.iwl,
      description:
        "Physician-led weight loss, metabolic care, hormone optimization, and non-invasive aesthetics.",
      href: "/iwl",
      domain: "indianaloseweight.com",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Preview environment
          </span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            v0.1.0
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-20">
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Two brands. One codebase. One deploy.
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-5xl md:text-6xl">
            Fort Wayne DPC +
            <br />
            Indiana Weight Loss.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
            This is the demo build. Both sites live in one Next.js app and are
            routed by hostname in production. Pick a brand below to preview the
            full experience.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {cards.map(({ brand, description, href, domain }) => (
            <Link
              key={brand.id}
              href={href}
              className="group flex flex-col justify-between rounded-3xl border border-border/70 bg-surface p-8 transition-all hover:border-foreground/30 hover:shadow-sm"
            >
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {domain}
                </div>
                <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-foreground">
                  {brand.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
              <div className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                Open preview
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-5 font-mono text-[11px] text-muted-foreground">
          <span>fortwayne-dpc / preview</span>
          <span>cole marcuccilli</span>
        </div>
      </footer>
    </div>
  );
}
