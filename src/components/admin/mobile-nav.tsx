"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_VISIBLE } from "./nav-config";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Stethoscope, LogOut } from "lucide-react";

export function AdminMobileNav() {
  const pathname = usePathname();
  const primaries = ADMIN_NAV_VISIBLE.filter((n) => n.primary);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white lg:hidden">
      <div className="mx-auto flex max-w-screen-md items-stretch">
        {primaries.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 px-1 pb-2 pt-2 text-[10px] font-medium transition-colors",
                active ? "text-slate-900" : "text-slate-400 hover:text-slate-700",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <Sheet>
          <SheetTrigger
            className="flex flex-1 flex-col items-center gap-0.5 px-1 pb-2 pt-2 text-[10px] font-medium text-slate-400 transition-colors hover:text-slate-700"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
            <span>Menu</span>
          </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetHeader className="border-b border-slate-200 px-5 py-4">
                <SheetTitle className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <span>Menu</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="p-3">
                <ul className="space-y-0.5">
                  {ADMIN_NAV_VISIBLE.map((item) => {
                    const active =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                            active
                              ? "bg-slate-900 font-medium text-white"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <form
                method="POST"
                action="/api/admin/logout"
                className="border-t border-slate-200 p-3"
              >
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </SheetContent>
          </Sheet>
      </div>
    </div>
  );
}
