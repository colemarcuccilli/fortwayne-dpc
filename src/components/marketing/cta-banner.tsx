import { LinkButton } from "@/components/ui/link-button";

interface CtaBannerProps {
  eyebrow?: string;
  title: string;
  body?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function CtaBanner({
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCta,
}: CtaBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-14 text-brand-foreground sm:px-12 md:py-20">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12)_0%,transparent_60%)]"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-foreground/70">
            {eyebrow}
          </span>
        )}
        <h2 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {body && (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-brand-foreground/85">
            {body}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href={primaryCta.href} variant="inverse" size="lg">
            {primaryCta.label}
          </LinkButton>
          {secondaryCta && (
            <LinkButton
              href={secondaryCta.href}
              variant="outline-inverse"
              size="lg"
            >
              {secondaryCta.label}
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );
}
