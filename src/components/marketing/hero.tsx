import Image from "next/image";
import { LinkButton } from "@/components/ui/link-button";
import { Eyebrow } from "@/components/marketing/section";
import { ArrowRight } from "lucide-react";

interface CtaLink {
  label: string;
  href: string;
}

interface HeroProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
}

/**
 * Homepage hero. The no-background doctor-and-patient PNG is anchored to
 * the bottom-right of the section so the figures appear to be standing on
 * the base of the hero. A subtle dotted grid sits behind everything, and
 * an SVG curve divider at the bottom transitions to the next section
 * (matching the curved wave the live site already uses).
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden pt-16 md:pt-20">
      {/* soft light-blue wash */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-b from-brand-muted/80 via-background to-background"
      />
      {/* dotted grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(43,108,176,0.35)_1px,transparent_0)] [background-size:22px_22px]"
      />
      {/* soft terracotta glow behind the doctor */}
      <div
        aria-hidden
        className="absolute right-0 top-1/3 -z-10 h-[520px] w-[520px] -translate-y-1/4 translate-x-1/4 rounded-full bg-brand-accent/25 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-end gap-10 px-5 pb-0 sm:px-8 md:min-h-[640px] md:grid-cols-[1.25fr_1fr]">
        {/* ---------- copy ---------- */}
        <div className="max-w-2xl pb-20 md:pb-28">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-foreground sm:text-5xl md:text-[64px] md:leading-[1.02]">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
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

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-8">
            <Stat label="Years in practice" value="20+" />
            <Stat label="Board certifications" value="2" />
            <Stat label="Insurance required" value="None" />
          </dl>
        </div>

        {/* ---------- doctor PNG, anchored bottom-right ---------- */}
        <div className="relative h-[420px] w-full self-end sm:h-[540px] md:h-[640px]">
          <Image
            src="/assets/DoctorwithPatientNoBackground.png"
            alt="Dr. Kalyan Aluri listening to a patient's heart at Fort Wayne Direct Primary Care"
            fill
            priority
            sizes="(max-width: 768px) 90vw, 45vw"
            className="object-contain object-bottom drop-shadow-[0_30px_60px_rgba(10,37,64,0.25)]"
          />
        </div>
      </div>

      {/* ---------- curve divider ---------- */}
      <svg
        aria-hidden
        className="block h-12 w-full text-background md:h-16"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-brand">
        {value}
      </dd>
    </div>
  );
}
