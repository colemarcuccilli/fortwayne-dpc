"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LinkButton } from "@/components/ui/link-button";
import { Logo } from "@/components/brand/logo";
import { PUBLIC_NAV } from "@/components/brand/nav-items";

/** Hamburger menu shown below the lg breakpoint, where the full nav can't fit. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 text-foreground/80 hover:bg-muted lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="flex items-center">
            <Logo height={40} />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="p-3">
          <ul className="space-y-0.5">
            {PUBLIC_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 px-1">
            <LinkButton
              href="/contact"
              size="md"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Book a Meet &amp; Greet
            </LinkButton>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
