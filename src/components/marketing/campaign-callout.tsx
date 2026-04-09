import { cn } from "@/lib/utils";

interface CampaignCalloutProps {
  primary: string;
  accent: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Oversized two-tone pull-quote used between major sections. The primary
 * line is rendered in brand blue, the accent line in terracotta. Together
 * they should read as one sentence.
 */
export function CampaignCallout({
  primary,
  accent,
  body,
  align = "left",
  className,
}: CampaignCalloutProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      <h2 className="font-heading text-5xl font-semibold leading-[0.95] tracking-[-0.035em] text-brand sm:text-6xl md:text-7xl lg:text-8xl">
        {primary}
        <br />
        <span className="text-brand-accent">{accent}</span>
      </h2>
      {body && (
        <p
          className={cn(
            "mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg",
            align === "center" ? "mx-auto" : "",
          )}
        >
          {body}
        </p>
      )}
    </div>
  );
}
