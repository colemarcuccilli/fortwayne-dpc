import { cn } from "@/lib/utils";
import { MARQUEE_PHRASES } from "@/lib/campaigns";

interface CampaignMarqueeProps {
  phrases?: string[];
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Seamless horizontal scrolling ticker. We duplicate the phrase list twice
 * so the CSS `animate-marquee` keyframe can translate the container by 50%
 * and loop without a visible jump.
 */
export function CampaignMarquee({
  phrases = MARQUEE_PHRASES,
  variant = "dark",
  className,
}: CampaignMarqueeProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden border-y py-4",
        isDark
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-surface text-foreground",
        className,
      )}
      aria-label="Fort Wayne Direct Primary Care highlights"
    >
      <div className="flex shrink-0 animate-marquee items-center gap-10 whitespace-nowrap pl-10 font-sans text-sm font-medium tracking-tight sm:text-base">
        {[...phrases, ...phrases].map((phrase, i) => (
          <span
            key={`${phrase}-${i}`}
            className="flex shrink-0 items-center gap-10"
          >
            <span>{phrase}</span>
            <span
              aria-hidden
              className={cn(
                "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
                isDark ? "bg-brand-accent" : "bg-brand",
              )}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
