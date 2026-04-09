import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LinkButton } from "@/components/ui/link-button";
import { PRACTICE } from "@/lib/site-data";
import { Phone } from "lucide-react";

const NAV = [
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Weight Loss", href: "/weight-loss" },
  { label: "Patient Form", href: "/patient-form" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-24 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center transition-opacity hover:opacity-80"
        >
          <Logo height={68} />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={PRACTICE.phoneHref}
            className="hidden items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" />
            {PRACTICE.phone}
          </a>
          <LinkButton href="/contact" size="sm">
            Book a Meet &amp; Greet
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
