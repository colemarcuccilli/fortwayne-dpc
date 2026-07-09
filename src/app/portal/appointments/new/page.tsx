import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = { title: "Book appointment" };

export default function PortalBookPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/portal/appointments"
        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Book an appointment
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Pick a preferred time and we&rsquo;ll confirm within one business
          day. For urgent needs, please call the office directly.
        </p>

        <form className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Reason for visit</Label>
              <select
                id="type"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                defaultValue="follow_up"
              >
                <option value="follow_up">Follow-up visit</option>
                <option value="annual_wellness">Annual wellness</option>
                <option value="weight_loss">Weight-loss check-in</option>
                <option value="urgent">Urgent concern</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <select
                id="location"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                defaultValue="in_office"
              >
                <option value="in_office">In office</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pref-date">Preferred date</Label>
              <Input id="pref-date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pref-time">Preferred time</Label>
              <Input id="pref-time" type="time" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Anything we should know?</Label>
            <Textarea id="notes" rows={4} placeholder="What's going on?" />
          </div>

          <Button type="submit" className="w-full">
            Request appointment
          </Button>
          <p className="text-center text-[11px] text-slate-500">
            Submitting doesn&rsquo;t confirm — the office will reach out to lock
            the time.
          </p>
        </form>
      </div>
    </div>
  );
}
