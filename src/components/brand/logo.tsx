import { cn } from "@/lib/utils";
import type { BrandId } from "@/lib/brands";

interface LogoProps {
  brand: BrandId;
  className?: string;
}

/**
 * Placeholder SVG wordmark for each brand. Intentionally typographic (not
 * the old logos) so the demo site has something clean to ship before Cole
 * drops in the real logo files.
 */
export function Logo({ brand, className }: LogoProps) {
  if (brand === "dpc") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2.5 font-sans leading-none",
          className,
        )}
        aria-label="Fort Wayne Direct Primary Care"
      >
        <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand text-brand-foreground">
          <span className="font-mono text-[13px] font-semibold tracking-tighter">
            fw
          </span>
        </span>
        <span className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Fort Wayne
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Direct Primary Care
          </span>
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-sans leading-none",
        className,
      )}
      aria-label="Indiana Weight Loss & Aesthetics"
    >
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand text-brand-foreground">
        <span className="font-mono text-[13px] font-semibold tracking-tighter">
          iw
        </span>
      </span>
      <span className="flex flex-col">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Indiana
        </span>
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Weight Loss &amp; Aesthetics
        </span>
      </span>
    </span>
  );
}
