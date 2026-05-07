import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, Eyebrow } from "@/components/marketing/section";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { LinkButton } from "@/components/ui/link-button";
import { ArrowRight, Check, Phone, Mail, Sparkles } from "lucide-react";
import {
  AESTHETICS,
  MOTHERS_DAY_ACTIVE,
} from "@/lib/aesthetics-content";
import { PRACTICE } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Aesthetics — Botox, Fillers & Volume Restoration",
  description:
    "Physician-led aesthetic care in Fort Wayne — Botox, dermal fillers, and post-weight-loss volume restoration. Performed by an AAFE-certified provider under direct medical supervision.",
};

export default function AestheticsPage() {
  return (
    <>
      <PageHeader
        eyebrow={AESTHETICS.hero.eyebrow}
        title={
          <>
            Aesthetic care,
            <br />
            <span className="text-brand-accent">physician-led.</span>
          </>
        }
        subtitle={AESTHETICS.hero.subtitle}
        primaryCta={{ label: "Book a Consultation", href: "/contact" }}
      />

      {/* ---------- Mother's Day promo ---------- */}
      {MOTHERS_DAY_ACTIVE && (
        <Section className="py-10 md:py-14">
          <div className="relative overflow-hidden rounded-3xl bg-brand-dark px-8 py-12 text-brand-foreground sm:px-14 md:py-16">
            <div
              aria-hidden
              className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-accent/35 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-accent/25 blur-3xl"
            />

            <div className="relative mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-accent/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
                <Sparkles className="h-3 w-3" />
                {AESTHETICS.mothersDay.eyebrow}
              </div>

              <h2 className="mt-6 font-heading text-5xl font-semibold leading-[0.95] tracking-[-0.035em] sm:text-7xl md:text-8xl">
                {AESTHETICS.mothersDay.headline}
              </h2>
              <p className="mt-4 text-base font-medium text-brand-accent sm:text-lg">
                {AESTHETICS.mothersDay.headlineAccent}
              </p>

              <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-brand-foreground/80 sm:text-base sm:leading-7">
                {AESTHETICS.mothersDay.body}
              </p>

              <div className="mt-10 inline-flex flex-col items-center gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-foreground/70">
                  Reserve by phone
                </span>
                <a
                  href={AESTHETICS.mothersDay.phoneHref}
                  className="font-mono text-3xl font-bold tabular-nums text-brand-foreground transition-colors hover:text-brand-accent sm:text-4xl"
                >
                  {AESTHETICS.mothersDay.phone}
                </a>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* ---------- Service overview ---------- */}
      <Section className="py-16 md:py-20">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>What we do</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Three services. One medical roof.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Aesthetic treatments designed and overseen by a board-certified
            physician — not delivered by a chain or a med spa.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {AESTHETICS.services.map((service, i) => (
            <article
              key={service.title}
              className="rounded-3xl border border-border/70 bg-surface p-7 transition-colors hover:border-brand/40"
            >
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-accent">
                0{i + 1}
              </div>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                {service.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------- Who's performing your treatment ---------- */}
      <Section className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl bg-brand-muted p-8 md:p-12">
            <Eyebrow>{AESTHETICS.providers.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {AESTHETICS.providers.title}
            </h2>
            <p className="mt-5 text-base leading-7 text-foreground/85">
              {AESTHETICS.providers.body}
            </p>
          </div>

          <div className="self-center">
            <ul className="space-y-4">
              {AESTHETICS.providers.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface px-5 py-4 text-sm"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-foreground/90">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ---------- Pain-controlled fillers ---------- */}
      <Section className="py-16 md:py-20">
        <div className="rounded-3xl border border-border/70 bg-surface p-8 md:p-14">
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
            <div>
              <Eyebrow>{AESTHETICS.painControl.eyebrow}</Eyebrow>
              <h2 className="mt-4 font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Fillers without the{" "}
                <span className="text-brand-accent">fear.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
                {AESTHETICS.painControl.body}
              </p>
            </div>
            <ul className="space-y-3.5 self-center text-sm">
              {AESTHETICS.painControl.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-foreground/90">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ---------- Volume restoration after weight loss ---------- */}
      <Section className="py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow>{AESTHETICS.volumeRestoration.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Restore what
              <br />
              weight loss{" "}
              <span className="text-brand-accent">took.</span>
            </h2>
          </div>
          <div className="self-end">
            <p className="text-base leading-7 text-foreground/85">
              {AESTHETICS.volumeRestoration.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton
                href={AESTHETICS.volumeRestoration.cta.href}
                variant="brand"
                size="md"
              >
                {AESTHETICS.volumeRestoration.cta.label}
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <Link
                href={AESTHETICS.volumeRestoration.weightLossLink.href}
                className="text-sm font-medium text-brand-accent hover:underline"
              >
                {AESTHETICS.volumeRestoration.weightLossLink.label} →
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Weekend appointments ---------- */}
      <Section className="py-16 md:py-20">
        <div className="rounded-3xl bg-brand-muted p-8 md:p-14">
          <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <Eyebrow>{AESTHETICS.weekend.eyebrow}</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {AESTHETICS.weekend.title}
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-foreground/85">
                {AESTHETICS.weekend.body}
              </p>
            </div>

            <div className="grid gap-4 self-center sm:grid-cols-1">
              <a
                href={PRACTICE.phoneHref}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-surface p-5 transition-colors hover:border-brand"
              >
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-brand" />
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Call
                    </div>
                    <div className="mt-0.5 font-mono text-base font-semibold tabular-nums text-foreground">
                      {PRACTICE.phone}
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </a>

              <a
                href={PRACTICE.aestheticsEmailHref}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-surface p-5 transition-colors hover:border-brand"
              >
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-brand" />
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Email
                    </div>
                    <div className="mt-0.5 text-sm font-semibold text-foreground">
                      {PRACTICE.aestheticsEmail}
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Final CTA ---------- */}
      <Section className="py-20 md:py-24">
        <CtaBanner
          eyebrow="Book today"
          title="Ready to talk options?"
          body="A consultation is the easiest way to figure out what — if anything — would actually help you. No pressure, no obligation, no upsell."
          primaryCta={{ label: "Book a Consultation", href: "/contact" }}
          secondaryCta={{ label: "See Weight Loss", href: "/weight-loss" }}
        />
      </Section>
    </>
  );
}
