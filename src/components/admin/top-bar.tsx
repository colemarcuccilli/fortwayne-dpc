"use client";

import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "./nav-config";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Stethoscope } from "lucide-react";

export function AdminTopBar() {
  const pathname = usePathname();
  const current = ADMIN_NAV.find((n) =>
    n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href),
  );

  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-3 px-4 lg:h-16 lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            aria-label="Admin home"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white lg:hidden"
          >
            <Stethoscope className="h-4 w-4" />
          </Link>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {current?.label ? "Admin" : "Fort Wayne DPC"}
            </div>
            <div className="text-base font-semibold tracking-tight text-slate-900 lg:text-lg">
              {current?.label ?? "Dashboard"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-48 pl-9 lg:w-64"
            />
          </div>
          <button
            aria-label="Notifications"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
