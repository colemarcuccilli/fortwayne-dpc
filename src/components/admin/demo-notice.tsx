"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAdmin } from "@/lib/admin/store";

/**
 * Small banner that surfaces the demo-mode state and offers a reset.
 * Dismissible per session.
 */
export function DemoNotice() {
  const [hidden, setHidden] = useState(false);
  const { resetToSeed } = useAdmin();

  if (hidden) return null;
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
          Demo
        </span>
        <span className="flex-1">
          Data lives in this browser. Wire to Supabase to persist across
          devices.
        </span>
        <button
          onClick={() => {
            if (confirm("Reset all admin data to seed?")) resetToSeed();
          }}
          className="rounded-md border border-amber-300 bg-white px-2 py-0.5 text-[11px] font-medium text-amber-900 hover:bg-amber-100"
        >
          Reset seed
        </button>
        <button
          onClick={() => setHidden(true)}
          aria-label="Dismiss"
          className="text-amber-700 hover:text-amber-900"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
