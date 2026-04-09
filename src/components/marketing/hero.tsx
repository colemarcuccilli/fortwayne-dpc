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
 * Homepage hero with the no-background doctor-and-patient PNG on the
 * right. The PNG sits inside a deep-blue brand blob that bleeds
 * intentionally off the grid to keep the composition asymmetric and
 * "editorial" rather than flat marketing.
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* soft warm background wash */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-muted/30 via-background to-background"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pt-20 pb-12 sm:px-8 md:grid-cols-[1.15fr_1fr] md:pt-28 md:pb-20">
        {/* copy column */}
        <div className="max-w-2xl">
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

        {/* photo column */}
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          {/* brand blob background */}
          <div
            aria-hidden
            className="absolute inset-x-4 top-6 bottom-4 -z-10 rounded-[38%_62%_48%_52%/_52%_36%_64%_48%] bg-brand"
          />
          <div
            aria-hidden
            className="absolute -left-8 -top-8 -z-10 h-24 w-24 rounded-full bg-brand-accent/20 blur-2xl md:h-32 md:w-32"
          />
          <div
            aria-hidden
            className="absolute bottom-0 right-6 -z-10 h-20 w-20 rounded-full bg-brand-accent/40 blur-2xl md:h-28 md:w-28"
          />

          <Image
            src="/assets/DoctorwithPatientNoBackground.png"
            alt="Dr. Kalyan Aluri speaking with a patient at Fort Wayne Direct Primary Care"
            width={900}
            height={1100}
            priority
            className="relative mx-auto w-full max-w-md object-contain drop-shadow-[0_30px_50px_rgba(10,37,64,0.25)] md:max-w-none"
          />
        </div>
      </div>
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
