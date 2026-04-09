import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/marketing/hero";
import { Section, Eyebrow } from "@/components/marketing/section";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Check } from "lucide-react";
import { DPC_WEIGHT_LOSS } from "@/lib/dpc-content";

export const metadata: Metadata = {
  title: "Weight Loss & Aesthetics",
  description: DPC_WEIGHT_LOSS.hero.subtitle,
};

export default function DpcWeightLossPage() {
  return (
    <>
      <Hero
        eyebrow={DPC_WEIGHT_LOSS.hero.eyebrow}
        title={DPC_WEIGHT_LOSS.hero.title}
        subtitle={DPC_WEIGHT_LOSS.hero.subtitle}
        primaryCta={{ label: "Book a Consultation", href: "/contact" }}
      />

      <Section className="py-16 md:py-20">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Programs</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Two proven paths. Real medical oversight.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {DPC_WEIGHT_LOSS.programs.map((program) => (
            <article
              key={program.name}
              className="flex flex-col rounded-3xl border border-border/70 bg-surface p-8"
            >
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {program.name}
              </h3>
              <p className="mt-1 text-sm italic text-brand">
                {program.subtitle}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {program.body}
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-border/60 pt-5 text-sm">
                {program.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span className="text-foreground/85">{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section className="py-16">
        <div className="rounded-3xl border border-border/70 bg-surface p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <Eyebrow>What you get</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {DPC_WEIGHT_LOSS.whatsIncluded.title}
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every weight-loss program, regardless of which path you choose,
                starts with the same foundation.
              </p>
            </div>
            <ul className="space-y-3 text-sm">
              {DPC_WEIGHT_LOSS.whatsIncluded.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span className="text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="py-16">
        <div className="mb-10">
          <Eyebrow>Consultations</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Two ways to start.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            DPC_WEIGHT_LOSS.consultation.inPerson,
            DPC_WEIGHT_LOSS.consultation.virtual,
          ].map((c) => (
            <div
              key={c.label}
              className="flex items-baseline justify-between rounded-2xl border border-border/70 bg-surface p-6"
            >
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {c.label}
                </div>
                <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground">
                  ${c.price}
                </div>
              </div>
              <Link
                href="/contact"
                className="text-sm font-medium text-brand hover:underline"
              >
                Book →
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-20 md:py-24">
        <CtaBanner
          title="Let&rsquo;s build your plan."
          body="A 45-minute consultation with Dr. Aluri is all it takes to get started."
          primaryCta={{ label: "Book a Consultation", href: "/contact" }}
        />
      </Section>
    </>
  );
}
