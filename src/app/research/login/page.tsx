import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Telescope } from "lucide-react";

export const metadata: Metadata = {
  title: "Research login",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function ResearchLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
            <Telescope className="h-5 w-5" />
          </div>
          <div className="text-sm font-medium">
            Fort Wayne DPC — Research Console
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Research agent sign-in
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Scoped access. This login can add prospects to the pipeline and
            nothing else.
          </p>

          <form
            method="POST"
            action="/api/research/login"
            className="mt-6 space-y-4"
          >
            {params.next && (
              <input type="hidden" name="next" value={params.next} />
            )}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Access key
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                autoFocus
                className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-600"
              />
            </div>

            {hasError && (
              <div className="rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-xs text-red-300">
                Incorrect access key.
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-white text-slate-950 hover:bg-slate-200"
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-slate-600">
          research scope · prospects only
        </p>
      </div>
    </div>
  );
}
