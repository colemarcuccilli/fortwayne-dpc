"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdmin } from "@/lib/admin/store";
import type { Settings } from "@/lib/admin/types";

export default function SettingsPage() {
  const { state, dispatch } = useAdmin();
  const [draft, setDraft] = useState<Settings>(state.settings);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: "settings_update", patch: draft });
    setSaved(true);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Settings"
        subtitle="Practice info, notifications, brand."
      />

      <form onSubmit={save} className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">Practice info</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="pname">Practice name</Label>
              <Input
                id="pname"
                value={draft.practiceName}
                onChange={(e) => update("practiceName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pemail">Contact email</Label>
              <Input
                id="pemail"
                type="email"
                value={draft.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pphone">Contact phone</Label>
              <Input
                id="pphone"
                type="tel"
                value={draft.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="paddress">Address</Label>
              <Textarea
                id="paddress"
                rows={2}
                value={draft.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
          <div className="mt-3 space-y-2">
            <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 p-3">
              <Checkbox
                checked={draft.emailNotifications}
                onCheckedChange={(v) => update("emailNotifications", Boolean(v))}
              />
              <div>
                <div className="text-sm font-medium">Email notifications</div>
                <div className="text-xs text-slate-500">
                  Send new-form-submission emails to the contact email.
                </div>
              </div>
            </label>
            <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 p-3">
              <Checkbox
                checked={draft.smsNotifications}
                onCheckedChange={(v) => update("smsNotifications", Boolean(v))}
              />
              <div>
                <div className="text-sm font-medium">SMS notifications</div>
                <div className="text-xs text-slate-500">
                  Send SMS alerts for high-priority events (Twilio required).
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">Branding</h2>
          <div className="mt-4 space-y-2">
            <Label htmlFor="brand-color">Primary brand color</Label>
            <div className="flex items-center gap-3">
              <Input
                id="brand-color"
                type="color"
                value={draft.brandColor}
                onChange={(e) => update("brandColor", e.target.value)}
                className="h-10 w-16 p-1"
              />
              <Input
                value={draft.brandColor}
                onChange={(e) => update("brandColor", e.target.value)}
                className="flex-1 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-emerald-700">
            {saved && "Saved."}
          </div>
          <Button type="submit">Save settings</Button>
        </div>
      </form>
    </div>
  );
}
