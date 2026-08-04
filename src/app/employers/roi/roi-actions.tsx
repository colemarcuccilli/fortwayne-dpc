"use client";

import { Printer } from "lucide-react";

/** Print / save-as-PDF button. Hidden when the page is actually printing. */
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 print:hidden"
    >
      <Printer className="h-4 w-4" />
      Print / Save as PDF
    </button>
  );
}
