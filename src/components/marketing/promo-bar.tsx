import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { MOTHERS_DAY_ACTIVE } from "@/lib/aesthetics-content";

/**
 * Sitewide promo strip for the Mother's Day $9/unit Botox campaign.
 * Sits above the sticky header on every page.
 *
 * Visibility is controlled by MOTHERS_DAY_ACTIVE in
 * src/lib/aesthetics-content.ts, flip that to false after May 31
 * to remove the bar everywhere.
 */
export function PromoBar() {
  if (!MOTHERS_DAY_ACTIVE) return null;

  return (
    <Link
      href="/aesthetics"
      className="group block bg-brand-accent text-brand-foreground transition-colors hover:bg-brand-accent/90"
      aria-label="Mother's Day Special: nine dollars per unit Botox, May only, go to aesthetics page"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2.5 px-5 py-2.5 text-xs sm:gap-4 sm:text-sm">
        <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="hidden font-medium sm:inline">
          Mother&rsquo;s Day Special:
        </span>
        <span className="font-mono font-semibold tabular-nums">
          $9/unit Botox
        </span>
        <span className="font-medium text-brand-foreground/80">
          May only
        </span>
        <ArrowRight
          className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </Link>
  );
}
