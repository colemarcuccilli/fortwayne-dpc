import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope } from "lucide-react";

export const metadata: Metadata = {
  title: "Member sign in",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function PortalLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2 text-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="text-sm font-medium">
            Fort Wayne DPC — Member Portal
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Sign in to your portal
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Book, reschedule, or cancel appointments and see your membership
            details.
          </p>

          <form
            method="POST"
            action="/api/portal/login"
            className="mt-6 space-y-4"
          >
            {params.next && (
              <input type="hidden" name="next" value={params.next} />
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            {hasError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                Check your email and password.
              </div>
            )}

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">
              ← Back to fortwaynedpc.com
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          Not a member yet?{" "}
          <Link href="/membership" className="text-brand hover:underline">
            See membership options
          </Link>
        </p>
      </div>
    </div>
  );
}
