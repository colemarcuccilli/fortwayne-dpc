import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LinkButton } from "@/components/ui/link-button";
import { MobileMenu } from "@/components/brand/mobile-menu";
import { PUBLIC_NAV, withBlogLink } from "@/components/brand/nav-items";
import { hasReleasedPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";

export async function Header() {
  // Read at render time. The root layout revalidates hourly, so the Blog link
  // appears on the first post's release date without a deploy.
  const nav = withBlogLink(PUBLIC_NAV, await hasReleasedPosts());
  // The 7 original links fill the bar exactly at the lg breakpoint. With the
  // 8th (Blog) the spacing and text tighten a little between lg and xl, so
  // the nav stays on one line. Without Blog the header is unchanged.
  const compact = nav.length > PUBLIC_NAV.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-24 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center transition-opacity hover:opacity-80"
        >
          <Logo height={68} />
        </Link>

        {/* Full nav only where all the items fit on one line. */}
        <nav
          aria-label="Primary"
          className={cn(
            "hidden items-center lg:flex xl:gap-x-7",
            compact ? "gap-x-4" : "gap-x-5",
          )}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap font-medium text-foreground/70 transition-colors hover:text-foreground",
                compact ? "text-[13px] xl:text-sm" : "text-sm",
              )}
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
          <MobileMenu items={nav} />
        </div>
      </div>
    </header>
  );
}
