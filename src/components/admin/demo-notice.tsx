"use client";

import { useState } from "react";
import { X, CloudCheck, HardDrive } from "lucide-react";
import { useAdmin } from "@/lib/admin/store";
import { SUPABASE_CONFIGURED } from "@/lib/admin/supabase";

/**
 * Banner surfacing storage mode + a reset button. Reflects whether we
 * are talking to Supabase (green — synced across devices) or falling
 * back to local demo (amber — this browser only).
 */
export function DemoNotice() {
  const [hidden, setHidden] = useState(false);
  const { resetToSeed, hydrated } = useAdmin();

  if (hidden) return null;

  const synced = SUPABASE_CONFIGURED;
  return (
    <div
      className={
        synced
          ? "border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-900"
          : "border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <span
          className={
            synced
              ? "inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800"
              : "inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800"
          }
        >
          {synced ? <CloudCheck className="h-3 w-3" /> : <HardDrive className="h-3 w-3" />}
          {synced ? "Supabase" : "Local demo"}
        </span>
        <span className="flex-1">
          {synced
            ? hydrated
              ? "Synced across devices."
              : "Loading data…"
            : "Data lives in this browser only. Set env vars to sync via Supabase."}
        </span>
        <button
          onClick={() => {
            const msg = synced
              ? "Wipe all Supabase data and reload with seed?"
              : "Reset all local data to seed?";
            if (confirm(msg)) void resetToSeed();
          }}
          className={
            synced
              ? "rounded-md border border-emerald-300 bg-white px-2 py-0.5 text-[11px] font-medium text-emerald-900 hover:bg-emerald-100"
              : "rounded-md border border-amber-300 bg-white px-2 py-0.5 text-[11px] font-medium text-amber-900 hover:bg-amber-100"
          }
        >
          Reset seed
        </button>
        <button
          onClick={() => setHidden(true)}
          aria-label="Dismiss"
          className={
            synced ? "text-emerald-700 hover:text-emerald-900" : "text-amber-700 hover:text-amber-900"
          }
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
