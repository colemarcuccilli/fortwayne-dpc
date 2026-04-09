import { LinkButton } from "@/components/ui/link-button";
import { Eyebrow } from "@/components/marketing/section";
import { ArrowRight } from "lucide-react";

interface CtaLink {
  label: string;
  href: string;
}

interface HeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background wash — subtle brand tint, no stock photo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-muted/60 via-background to-background"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,var(--brand-muted)_0%,transparent_55%)] opacity-70"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 pt-20 sm:px-8 md:grid-cols-[1.3fr_1fr] md:pt-28 md:pb-28">
        <div className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-7 text-muted-foreground">
            {subtitle}
          </p>

          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {primaryCta && (
                <LinkButton href={primaryCta.href} variant="brand" size="lg">
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </LinkButton>
              )}
              {secondaryCta && (
                <LinkButton
                  href={secondaryCta.href}
                  variant="outline"
                  size="lg"
                >
                  {secondaryCta.label}
                </LinkButton>
              )}
            </div>
          )}
        </div>

        {/* Right-side decorative block — typographic, no stock photo. */}
        <div className="relative hidden md:block">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-brand/5 blur-2xl" />
          <div className="relative rounded-3xl border border-border/70 bg-surface p-8 shadow-sm">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
              Fort Wayne, Indiana
            </div>
            <p className="mt-6 font-sans text-2xl font-medium leading-tight tracking-tight text-foreground">
              &ldquo;Primary care should feel like having a doctor in the family
              &mdash; not a ten-minute appointment at the end of a fourteen-person
              waiting room.&rdquo;
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              &mdash; Dr. Kalyan Aluri, MD
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
              <Stat label="Years in practice" value="20+" />
              <Stat label="Board certs" value="2" />
              <Stat label="Panel cap" value="ltd." />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-xl font-semibold tabular-nums text-brand">
        {value}
      </div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
