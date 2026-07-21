import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, Eyebrow } from "@/components/marketing/section";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { SavingsCalculator } from "@/components/marketing/savings-calculator";
import { LinkButton } from "@/components/ui/link-button";
import { Check, ArrowRight } from "lucide-react";
import { EMPLOYERS, EMPLOYER_PRICING } from "@/lib/employer-content";

export const metadata: Metadata = {
  title: "For Business — Cut healthcare costs without cutting benefits",
  description:
    "Fort Wayne Direct Primary Care for employers. A membership that gives your team unlimited same-day care with no copays — and lowers your company's total healthcare spend. Transparent pricing, local physician.",
};

export default function EmployersPage() {
  return (
    <>
      <PageHeader
        eyebrow={EMPLOYERS.hero.eyebrow}
        title={
          <>
            Cut your company&rsquo;s healthcare costs
            <br />
            <span className="text-brand-accent">without cutting benefits.</span>
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

      {/* ---------- Dual promise ---------- */}
      <Section className="py-16 md:py-20">
        <div className="rounded-3xl bg-brand p-8 text-brand-foreground md:p-14">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-foreground/70">
              {EMPLOYERS.dualPromise.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {EMPLOYERS.dualPromise.title}
            </h2>
            <p className="mt-5 text-base leading-7 text-brand-foreground/85 md:text-lg">
              {EMPLOYERS.dualPromise.body}
            </p>
          </div>
        </div>
      </Section>

      {/* ---------- Who gets what ---------- */}
      <Section className="py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>{EMPLOYERS.whoGetsWhat.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everyone comes out ahead.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {EMPLOYERS.whoGetsWhat.columns.map((col, i) => (
            <div
              key={col.title}
              className="rounded-3xl border border-border/70 bg-surface p-7"
            >
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-accent">
                0{i + 1}
              </div>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
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

      {/* ---------- Two buyer types ---------- */}
      <Section className="py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>{EMPLOYERS.buyerTypes.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {EMPLOYERS.buyerTypes.title}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {EMPLOYERS.buyerTypes.cards.map((card) => (
            <div
              key={card.tag}
              className="flex flex-col rounded-3xl border border-border/70 bg-surface p-8"
            >
              <span className="inline-flex w-fit rounded-full bg-brand-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
                {card.tag}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                {card.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                {card.body}
              </p>
              <div className="mt-5 border-t border-border/60 pt-4 text-sm font-semibold text-brand-accent">
                {card.highlight}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Mechanism / where savings come from ---------- */}
      <Section className="py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>{EMPLOYERS.mechanism.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {EMPLOYERS.mechanism.title}
          </h2>
          <p className="mt-4 text-muted-foreground">{EMPLOYERS.mechanism.body}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EMPLOYERS.mechanism.points.map((p) => (
            <div
              key={p.label}
              className="rounded-2xl border border-border/70 bg-surface p-6"
            >
              <div className="font-mono text-2xl font-bold tracking-tight text-brand">
                {p.stat}
              </div>
              <div className="mt-2 text-sm font-medium text-foreground">
                {p.label}
              </div>
              <div className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {p.detail}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-2xl border border-border/60 bg-brand-muted/40 p-5 text-sm leading-6 text-foreground/80">
          {EMPLOYERS.mechanism.honesty}
        </p>
      </Section>

      {/* ---------- The calculator (centerpiece) ---------- */}
      <Section id="estimate" className="scroll-mt-24 py-16 md:py-20">
        <div className="mb-8 max-w-2xl">
          <Eyebrow>Your personal opportunity</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            See your company&rsquo;s number.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Enter three quick numbers for a transparent, conservative estimate
            of what direct primary care could do for your bottom line — with
            every assumption shown.
          </p>
        </div>
        <SavingsCalculator />
      </Section>

      {/* ---------- Transparent pricing ---------- */}
      <Section className="py-16 md:py-20">
        <div className="rounded-3xl border border-border/70 bg-surface p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_1.1fr]">
            <div>
              <Eyebrow>Transparent pricing</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                We publish our price.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {EMPLOYER_PRICING.note}
              </p>
              <p className="mt-3 text-xs text-muted-foreground/80">
                {EMPLOYER_PRICING.disclaimer}
              </p>
            </div>
            <div className="space-y-3">
              {EMPLOYER_PRICING.tiers.map((t) => (
                <div
                  key={t.label}
                  className="flex items-baseline justify-between rounded-2xl border border-border/70 bg-background p-5"
                >
                  <div className="text-sm font-medium text-foreground">
                    {t.label}
                    {t.note && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        ({t.note})
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-2xl font-bold tabular-nums text-brand">
                    {t.price}
                    <span className="text-sm font-medium text-muted-foreground">
                      {t.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Trust ---------- */}
      <Section className="py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>{EMPLOYERS.trust.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {EMPLOYERS.trust.title}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {EMPLOYERS.trust.points.map((p) => (
            <div key={p.title} className="rounded-3xl bg-brand/5 p-7">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {p.title}
              </h3>
              <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Weight-loss add-on ---------- */}
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
            <LinkButton
              href={EMPLOYERS.wellnessAddon.cta.href}
              variant="brand"
              size="lg"
            >
              {EMPLOYERS.wellnessAddon.cta.label}
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </Section>

      {/* ---------- Final CTA ---------- */}
      <Section className="py-20 md:py-24">
        <CtaBanner
          eyebrow="Let's talk"
          title={EMPLOYERS.finalCta.title}
          body={EMPLOYERS.finalCta.body}
          primaryCta={EMPLOYERS.finalCta.primaryCta}
          secondaryCta={{ label: "Get your estimate first", href: "#estimate" }}
        />
      </Section>
    </>
  );
}
