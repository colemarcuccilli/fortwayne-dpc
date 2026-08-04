import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LinkButton } from "@/components/ui/link-button";
import { MobileMenu } from "@/components/brand/mobile-menu";
import { PUBLIC_NAV } from "@/components/brand/nav-items";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-24 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center transition-opacity hover:opacity-80"
        >
          <Logo height={68} />
        </Link>

        {/* Full nav only where all 7 items fit on one line. */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-x-5 lg:flex xl:gap-x-7"
        >
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LinkButton
            href="/contact"
            size="sm"
            className="hidden whitespace-nowrap sm:inline-flex"
          >
            Book a Meet &amp; Greet
          </LinkButton>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
