import type { Metadata } from "next";
import Link from "next/link";
import { ResearchProvider } from "@/lib/admin/research-store";
import { Telescope, BookOpen, ListPlus } from "lucide-react";

export const metadata: Metadata = {
  title: {
    default: "Research Console — Fort Wayne DPC",
    template: "%s — FWDPC Research",
  },
  robots: { index: false, follow: false },
};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <ResearchProvider>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link href="/research" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Telescope className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Fort Wayne DPC
                </div>
                <div className="text-sm font-semibold tracking-tight text-slate-900">
                  Research Console
                </div>
              </div>
            </Link>

            <nav className="flex items-center gap-1.5">
              <Link
                href="/research"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                <ListPlus className="h-3.5 w-3.5" />
                Add
              </Link>
              <Link
                href="/research/instructions"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Instructions
              </Link>
              <form method="POST" action="/api/research/logout">
                <button
                  type="submit"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Sign out
                </button>
              </form>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </ResearchProvider>
    </div>
  );
}
