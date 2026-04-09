import { LinkButton } from "@/components/ui/link-button";
import { Eyebrow } from "@/components/marketing/section";
import { ArrowRight } from "lucide-react";

interface CtaLink {
  label: string;
  href: string;
}

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  primaryCta?: CtaLink;
}

/**
 * Text-only page header used on inner pages. Keeps the heavy doctor PNG
 * hero for the home page only so it doesn't become visual wallpaper.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  primaryCta,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-muted/25 via-background to-background"
      />
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 pb-16 sm:px-8 md:pt-28 md:pb-20">
        <div className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-7 text-muted-foreground">
              {subtitle}
            </p>
          )}
          {primaryCta && (
            <div className="mt-8">
              <LinkButton href={primaryCta.href} variant="brand" size="lg">
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
