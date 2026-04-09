import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";
import type { BrandId } from "@/lib/brands";
import { PRACTICE } from "@/lib/site-data";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  brand: BrandId;
  nav: NavItem[];
  ctaLabel: string;
  ctaHref: string;
}

export function Header({ brand, nav, ctaLabel, ctaHref }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center transition-opacity hover:opacity-80"
        >
          <Logo brand={brand} />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={PRACTICE.phoneHref}
            className="hidden font-mono text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline"
          >
            {PRACTICE.phone}
          </a>
          <LinkButton href={ctaHref} size="sm">
            {ctaLabel}
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
