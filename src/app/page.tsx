import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/marketing/hero";
import { CampaignMarquee } from "@/components/marketing/campaign-marquee";
import { CampaignCallout } from "@/components/marketing/campaign-callout";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Section, Eyebrow } from "@/components/marketing/section";
import { Check } from "lucide-react";
import { DPC_HOME } from "@/lib/dpc-content";
import { CALLOUTS } from "@/lib/campaigns";

export const metadata: Metadata = {
  title: "Fort Wayne Direct Primary Care — Personalized care, no insurance",
  description: DPC_HOME.hero.subtitle,
};

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow={DPC_HOME.hero.eyebrow}
        title={
          <>
            Primary care
            <br />
            the way it <span className="text-brand-accent">should be.</span>
          </>
        }
        subtitle={DPC_HOME.hero.subtitle}
        primaryCta={DPC_HOME.hero.primaryCta}
        secondaryCta={DPC_HOME.hero.secondaryCta}
      />

      {/*
        Marquee is pulled up with a negative margin so its solid dark
        navy bar overlaps the bottom of the hero. That covers the hard
        cut line at the base of the eye-exam PNG cutout.
      */}
      <div className="relative z-10 -mt-12 md:-mt-16">
        <CampaignMarquee variant="dark" />
      </div>

      {/* ---- Pillars ---- */}
      <Section className="py-20 md:py-28">
        <div className="mb-14 max-w-2xl">
          <Eyebrow>What makes us different</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Direct, unhurried, and built around you.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Three things shape how we practice: time, access, and follow-through.
            Everything about our membership is designed around those.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {DPC_HOME.pillars.map((pillar, i) => (
            <article
              key={pillar.title}
              className="group relative rounded-3xl border border-border/70 bg-surface p-8 transition-colors hover:border-brand/40"
            >
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-accent">
                0{i + 1}
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* ---- Campaign callout: Text your doctor ---- */}
      <Section className="py-20 md:py-28">
        <div className="grid items-center gap-16 md:grid-cols-[1.3fr_1fr]">
          <CampaignCallout {...CALLOUTS.textYourDoctor} />
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand/5">
            <Image
              src="/assets/DoctorTalkingtoPatientNopatientVertical.jpg"
              alt="Dr. Kalyan Aluri reviewing notes with a patient"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* ---- Member promise ---- */}
      <Section className="py-16 md:py-20">
        <div className="grid gap-10 rounded-3xl border border-border/70 bg-surface p-8 md:grid-cols-[1.1fr_1fr] md:p-14">
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
      </Section>

      {/* ---- Campaign callout: No copays, no waiting rooms ---- */}
      <Section className="py-20 md:py-28">
        <CampaignCallout {...CALLOUTS.noCopays} align="left" />
      </Section>

      {/* ---- What's included + photo ---- */}
      <Section className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="/assets/DocWorkingatFrontDeskwithLogobehindVertical.jpg"
              alt="The front desk at Fort Wayne Direct Primary Care"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <Eyebrow>What&rsquo;s included</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {DPC_HOME.included.title}
            </h2>
            <p className="mt-4 text-muted-foreground">
              A flat monthly membership covers the care most people need.
              Anything beyond that is always posted in plain numbers, ahead
              of time.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {DPC_HOME.included.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-foreground/90"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ---- Community / location strip ---- */}
      <Section className="py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Eyebrow>Fort Wayne, Indiana</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Neighborhood care,
              <br />
              right here in Allen County.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
            We serve families across Fort Wayne and the surrounding
            communities from our office on West Jefferson Boulevard.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src="/assets/WideDroneShowinglocationandCloseAreasofTown.png"
            alt="Aerial view of Fort Wayne, Indiana"
            width={2400}
            height={1400}
            className="h-[520px] w-full object-cover md:h-[680px]"
            priority={false}
          />
        </div>
      </Section>

      {/* ---- Campaign callout: Same-day answers ---- */}
      <Section className="py-20 md:py-28">
        <div className="grid items-center gap-16 md:grid-cols-[1fr_1.3fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand/5">
            <Image
              src="/assets/DoctorSmilingwithMicandLabCoatVertical.jpg"
              alt="Dr. Kalyan Aluri in his lab coat"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <CampaignCallout {...CALLOUTS.sameDay} />
        </div>
      </Section>

      {/* ---- Final CTA ---- */}
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
