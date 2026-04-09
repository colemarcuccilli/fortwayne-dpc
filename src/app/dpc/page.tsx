import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Section, Eyebrow } from "@/components/marketing/section";
import { Check } from "lucide-react";
import { DPC_HOME } from "@/lib/dpc-content";

export const metadata: Metadata = {
  title: "Fort Wayne Direct Primary Care — Primary care the way it should be",
  description: DPC_HOME.hero.subtitle,
};

export default function DpcHomePage() {
  return (
    <>
      <Hero
        eyebrow={DPC_HOME.hero.eyebrow}
        title={DPC_HOME.hero.title}
        subtitle={DPC_HOME.hero.subtitle}
        primaryCta={DPC_HOME.hero.primaryCta}
        secondaryCta={DPC_HOME.hero.secondaryCta}
      />

      <Section className="py-20 md:py-28">
        <div className="mb-14 max-w-2xl">
          <Eyebrow>What makes us different</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Direct, unhurried, and built around you.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Three things shape how we practice: time, access, and follow-through.
            Everything in our membership is designed around those.
          </p>
        </div>
        <FeatureGrid features={DPC_HOME.pillars} columns={3} />
      </Section>

      <Section className="py-16 md:py-20">
        <div className="rounded-3xl border border-border/70 bg-surface p-8 md:p-14">
          <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <Eyebrow>Our promise</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {DPC_HOME.memberPromise.title}
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                These aren&rsquo;t nice-to-haves. They&rsquo;re non-negotiables.
                Every member gets every one of them, every time.
              </p>
            </div>
            <ul className="space-y-3.5">
              {DPC_HOME.memberPromise.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-20">
        <div className="max-w-2xl">
          <Eyebrow>What&rsquo;s included</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {DPC_HOME.included.title}
          </h2>
          <p className="mt-4 text-muted-foreground">
            A flat monthly membership covers the care most people need. Anything
            beyond that is always posted in plain numbers, ahead of time.
          </p>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {DPC_HOME.included.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-border/70 bg-surface px-4 py-3 text-sm text-foreground/90"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section className="py-20 md:py-24">
        <CtaBanner
          eyebrow="Ready to start?"
          title="Meet Dr. Aluri — the visit is on us."
          body="A free meet-and-greet is the best way to see if direct primary care is a fit for your family. No pressure, no paperwork."
          primaryCta={{ label: "Schedule a Meet & Greet", href: "/contact" }}
          secondaryCta={{ label: "See Pricing", href: "/membership" }}
        />
      </Section>
    </>
  );
}
