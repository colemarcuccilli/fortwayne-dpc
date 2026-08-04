import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, Eyebrow } from "@/components/marketing/section";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { SavingsCalculator } from "@/components/marketing/savings-calculator";
import { LinkButton } from "@/components/ui/link-button";
import { Check, ArrowRight, Printer } from "lucide-react";
import { EMPLOYERS } from "@/lib/employer-content";

export const metadata: Metadata = {
  title: "For Business — Employer Healthcare Partnership | $79/employee/mo",
  description:
    "Fort Wayne Direct Primary Care for employers. Unlimited same-day physician access for your team at a flat $79 per employee per month — no copays, no deductibles. Fewer ER visits, less absenteeism, a benefit employees actually use.",
};

export default function EmployersPage() {
  return (
    <>
      <PageHeader
        eyebrow={EMPLOYERS.hero.eyebrow}
        title={
          <>
            Real healthcare for your team —
            <br />
            <span className="text-brand-accent">
              for less than a missed workday a month.
            </span>
          </>
        }
        subtitle={EMPLOYERS.hero.subtitle}
      />

      {/* hero CTAs */}
      <Section className="pb-4">
        <div className="flex flex-wrap gap-3">
          <LinkButton href={EMPLOYERS.hero.primaryCta.href} variant="brand" size="lg">
            {EMPLOYERS.hero.primaryCta.label}
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton href={EMPLOYERS.hero.secondaryCta.href} variant="outline" size="lg">
            {EMPLOYERS.hero.secondaryCta.label}
          </LinkButton>
        </div>
      </Section>

      {/* ---------- The hook ---------- */}
      <Section className="py-12 md:py-16">
        <p className="mx-auto max-w-4xl text-center font-heading text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl md:text-4xl">
          &ldquo;{EMPLOYERS.hook}&rdquo;
        </p>
      </Section>

      {/* ---------- How it works: price + 3 options ---------- */}
      <Section className="py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-12">
          <div>
            <Eyebrow>{EMPLOYERS.howItWorks.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {EMPLOYERS.howItWorks.title}
            </h2>
            <div className="mt-6 rounded-3xl bg-brand p-8 text-brand-foreground">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-bold tracking-tight">
                  {EMPLOYERS.howItWorks.price.amount}
                </span>
                <span className="text-sm font-medium text-brand-foreground/80">
                  {EMPLOYERS.howItWorks.price.unit}
                </span>
              </div>
              <div className="mt-1 text-sm text-brand-foreground/80">
                {EMPLOYERS.howItWorks.price.annual}
              </div>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                {EMPLOYERS.howItWorks.price.includes.map((inc) => (
                  <li key={inc} className="flex items-center gap-1.5 text-sm text-brand-foreground/90">
                    <Check className="h-3.5 w-3.5 shrink-0 text-brand-accent" />
                    {inc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid content-center gap-4">
            {EMPLOYERS.howItWorks.options.map((opt, i) => (
              <div
                key={opt.title}
                className="rounded-2xl border border-border/70 bg-surface p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-sm font-semibold text-brand">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      {opt.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {opt.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------- What's included ---------- */}
      <Section className="py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>{EMPLOYERS.included.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {EMPLOYERS.included.title}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {EMPLOYERS.included.groups.map((g) => (
            <div key={g.title} className="rounded-3xl border border-border/70 bg-surface p-7">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-accent">
                {g.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span className="text-foreground/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- ROI: the hidden costs ---------- */}
      <Section className="py-16 md:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <Eyebrow>{EMPLOYERS.roi.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {EMPLOYERS.roi.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{EMPLOYERS.roi.subtitle}</p>
          </div>
          <LinkButton href="/employers/roi" variant="outline" size="md">
            <Printer className="h-4 w-4" />
            Printable ROI sheet
          </LinkButton>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EMPLOYERS.roi.hiddenCosts.map((c) => (
            <div key={c.label} className="rounded-2xl border border-border/70 bg-surface p-6">
              <div className="text-sm font-medium text-foreground">{c.label}</div>
              <div className="mt-2 font-mono text-2xl font-bold tracking-tight text-brand-accent">
                {c.amount}
              </div>
              <div className="mt-2 text-xs leading-5 text-muted-foreground">
                {c.detail}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-2xl bg-brand-muted/40 p-5 text-sm leading-6 text-foreground/80">
          {EMPLOYERS.roi.exampleNote}
        </p>
      </Section>

      {/* ---------- Calculator ---------- */}
      <Section id="estimate" className="scroll-mt-24 py-16 md:py-20">
        <div className="mb-8 max-w-2xl">
          <Eyebrow>Your numbers</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            See your company&rsquo;s ROI.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Enter your headcount and the costs you could realistically avoid.
            Every assumption is shown and adjustable — no hype.
          </p>
        </div>
        <SavingsCalculator />
      </Section>

      {/* ---------- Ideal groups ---------- */}
      <Section className="py-16 md:py-20">
        <div className="rounded-3xl bg-brand/5 p-8 md:p-12">
          <div className="max-w-2xl">
            <Eyebrow>{EMPLOYERS.idealGroups.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {EMPLOYERS.idealGroups.title}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {EMPLOYERS.idealGroups.subtitle}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {EMPLOYERS.idealGroups.groups.map((g) => (
              <span
                key={g}
                className="rounded-full border border-border/70 bg-surface px-4 py-2 text-sm font-medium text-foreground/85"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------- Benefits grid ---------- */}
      <Section className="py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>{EMPLOYERS.benefits.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {EMPLOYERS.benefits.title}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EMPLOYERS.benefits.items.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border/70 bg-surface p-6">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {b.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Wellness add-on ---------- */}
      <Section className="py-16 md:py-20">
        <div className="grid items-center gap-8 rounded-3xl bg-brand-accent-muted p-8 md:grid-cols-[1.3fr_1fr] md:p-12">
          <div>
            <Eyebrow>{EMPLOYERS.wellnessAddon.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {EMPLOYERS.wellnessAddon.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-foreground/85">
              {EMPLOYERS.wellnessAddon.body}
            </p>
          </div>
          <div className="md:text-right">
            <LinkButton href={EMPLOYERS.wellnessAddon.cta.href} variant="brand" size="lg">
              {EMPLOYERS.wellnessAddon.cta.label}
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </Section>

      {/* ---------- Getting started ---------- */}
      <Section className="py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>{EMPLOYERS.steps.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {EMPLOYERS.steps.title}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {EMPLOYERS.steps.steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-border/70 bg-surface p-7">
              <div className="font-mono text-[11px] font-semibold tracking-[0.16em] text-brand-accent">
                {s.n}
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section className="py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>{EMPLOYERS.faq.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {EMPLOYERS.faq.title}
          </h2>
        </div>
        <div className="mx-auto max-w-3xl divide-y divide-border/60 rounded-3xl border border-border/70 bg-surface">
          {EMPLOYERS.faq.items.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-foreground marker:content-none">
                {f.q}
                <span className="text-brand transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      {/* ---------- Final CTA ---------- */}
      <Section className="py-20 md:py-24">
        <CtaBanner
          eyebrow="Let's talk"
          title={EMPLOYERS.finalCta.title}
          body={EMPLOYERS.finalCta.body}
          primaryCta={EMPLOYERS.finalCta.primaryCta}
          secondaryCta={{ label: "See the ROI sheet", href: "/employers/roi" }}
        />
      </Section>
    </>
  );
}
