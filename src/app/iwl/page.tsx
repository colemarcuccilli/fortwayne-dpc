import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Section, Eyebrow } from "@/components/marketing/section";
import { Check } from "lucide-react";
import { IWL_HOME } from "@/lib/iwl-content";

export const metadata: Metadata = {
  title:
    "Indiana Weight Loss & Aesthetics — Physician-led weight loss in Fort Wayne",
  description: IWL_HOME.hero.subtitle,
};

export default function IwlHomePage() {
  return (
    <>
      <Hero
        eyebrow={IWL_HOME.hero.eyebrow}
        title={IWL_HOME.hero.title}
        subtitle={IWL_HOME.hero.subtitle}
        primaryCta={IWL_HOME.hero.primaryCta}
        secondaryCta={IWL_HOME.hero.secondaryCta}
      />

      <Section className="py-20 md:py-24">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Services</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need under one roof.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Medical weight loss, metabolic care, hormone optimization, and
            non-invasive aesthetics — delivered by a board-certified physician.
          </p>
        </div>
        <FeatureGrid
          features={IWL_HOME.services.map(({ title, body }) => ({
            title,
            body,
          }))}
          columns={3}
        />
      </Section>

      <Section className="py-20">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Equipment</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Modern tools. Real measurement.
          </h2>
          <p className="mt-4 text-muted-foreground">
            We use clinical-grade equipment so your plan is built on real data —
            not guesses.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {IWL_HOME.equipment.map((item) => (
            <article
              key={item.name}
              className="rounded-3xl border border-border/70 bg-surface p-8"
            >
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {item.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="py-20">
        <div className="rounded-3xl border border-border/70 bg-surface p-10 md:p-14">
          <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <Eyebrow>Why us</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {IWL_HOME.whyUs.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                {IWL_HOME.whyUs.body}
              </p>
            </div>
            <ul className="space-y-3.5">
              {IWL_HOME.whyUs.pillars.map((pillar) => (
                <li key={pillar} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-foreground/90">{pillar}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="py-20">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {IWL_HOME.process.title}
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {IWL_HOME.process.steps.map((step) => (
            <article
              key={step.n}
              className="rounded-2xl border border-border/70 bg-surface p-6"
            >
              <div className="font-mono text-[11px] font-semibold tracking-[0.16em] text-brand">
                {step.n}
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="py-20 md:py-24">
        <CtaBanner
          eyebrow="Start today"
          title="Book a consultation with Dr. Aluri."
          body="45 – 60 minutes, in-person or virtual. We'll look at your history, run the right labs, and build a plan from there."
          primaryCta={{ label: "Book Now", href: "/contact" }}
          secondaryCta={{ label: "See All Services", href: "/services" }}
        />
      </Section>
    </>
  );
}
