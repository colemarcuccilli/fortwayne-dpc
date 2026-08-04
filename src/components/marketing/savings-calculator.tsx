"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Info, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveSubmissionLocal } from "@/lib/admin/public-submission";
import { EMPLOYER_ECONOMICS } from "@/lib/employer-content";

const E = EMPLOYER_ECONOMICS;

function money(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

/**
 * Employer ROI calculator, the avoided-cost model from the program doc.
 *
 * Investment = employees × $79 × 12. Potential savings = the downstream
 * costs the membership heads off (urgent care, ER, missed workdays,
 * turnover), each with a transparent per-unit cost the employer can
 * adjust. Honest: it's labeled "potential," every input is theirs, and
 * the assumptions are shown. Submitting sends an employer inquiry into
 * the admin inbox with the modeled numbers attached.
 */
export function SavingsCalculator() {
  const [employees, setEmployees] = useState("20");

  // Avoidable events per year (prefilled from per-employee defaults, editable)
  const n0 = 20;
  const [urgent, setUrgent] = useState(
    String(Math.round(n0 * E.defaultUrgentCarePerEmp)),
  );
  const [er, setEr] = useState(String(Math.round(n0 * E.defaultErPerEmp)));
  const [workdays, setWorkdays] = useState(
    String(Math.round(n0 * E.defaultWorkdaysPerEmp)),
  );
  const [turnover, setTurnover] = useState("1");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const m = useMemo(() => {
    const n = Math.max(0, Number(employees) || 0);
    const investment = n * E.pepm * 12;
    const uc = Math.max(0, Number(urgent) || 0) * E.costPerUrgentCare;
    const erc = Math.max(0, Number(er) || 0) * E.costPerErVisit;
    const wd = Math.max(0, Number(workdays) || 0) * E.costPerMissedWorkday;
    const to = Math.max(0, Number(turnover) || 0) * E.costPerTurnover;
    const savings = uc + erc + wd + to;
    const net = savings - investment;
    return { n, investment, uc, erc, wd, to, savings, net };
  }, [employees, urgent, er, workdays, turnover]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveSubmissionLocal({
      type: "employer",
      name: name.trim() || company.trim() || "Employer inquiry",
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      subject: `Employer ROI request, ${company.trim() || "company"} (${m.n} employees)`,
      message: "Requested a custom employer ROI estimate from the website.",
      meta: {
        company: company.trim(),
        employees: m.n,
        annualInvestment: m.investment,
        avoidedUrgentCare: Number(urgent) || 0,
        avoidedErVisits: Number(er) || 0,
        avoidedWorkdays: Number(workdays) || 0,
        retainedEmployees: Number(turnover) || 0,
        potentialSavings: Math.round(m.savings),
      },
    });
    setSubmitted(true);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border/70 bg-surface">
      <div className="grid lg:grid-cols-2">
        {/* ---------- Inputs ---------- */}
        <div className="border-b border-border/60 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Your company
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            Estimate your ROI
          </h3>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="calc-employees">Number of employees</Label>
              <Input
                id="calc-employees"
                type="number"
                min={1}
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
              />
            </div>

            <div className="rounded-xl border border-border/60 bg-background p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Costs you could avoid in a year
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Prefilled with conservative estimates, adjust to your team.
              </p>
              <div className="mt-4 space-y-3">
                <MiniField
                  label="Urgent-care visits avoided"
                  hint={`× ${money(E.costPerUrgentCare)} each`}
                  value={urgent}
                  onChange={setUrgent}
                />
                <MiniField
                  label="ER visits avoided"
                  hint={`× ${money(E.costPerErVisit)} each`}
                  value={er}
                  onChange={setEr}
                />
                <MiniField
                  label="Missed workdays avoided"
                  hint={`× ${money(E.costPerMissedWorkday)} each`}
                  value={workdays}
                  onChange={setWorkdays}
                />
                <MiniField
                  label="Employees retained"
                  hint={`× ${money(E.costPerTurnover)} each`}
                  value={turnover}
                  onChange={setTurnover}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Output ---------- */}
        <div className="bg-brand-muted/40 p-6 sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Your estimate
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/60 bg-surface p-4">
              <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Annual investment
              </div>
              <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-foreground">
                {money(m.investment)}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {m.n} × $79/mo
              </div>
            </div>
            <div className="rounded-2xl bg-brand p-4 text-brand-foreground">
              <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-brand-foreground/70">
                Potential savings
              </div>
              <div className="mt-1 font-mono text-2xl font-bold tabular-nums">
                {money(m.savings)}
              </div>
              <div className="mt-0.5 text-[11px] text-brand-foreground/80">
                costs headed off
              </div>
            </div>
          </div>

          <dl className="mt-4 space-y-2 rounded-2xl border border-border/60 bg-surface p-4 text-sm">
            <Row label="Urgent-care visits avoided" value={money(m.uc)} />
            <Row label="ER visits avoided" value={money(m.erc)} />
            <Row label="Missed workdays avoided" value={money(m.wd)} />
            <Row label="Turnover avoided" value={money(m.to)} />
          </dl>

          {m.net >= 0 ? (
            <div className="mt-3 rounded-xl bg-brand/5 px-4 py-3 text-sm text-foreground">
              Estimated to <strong>offset the full cost and then some</strong> ,
              about <strong>{money(m.net)}</strong> ahead, before counting a
              healthier, more productive team.
            </div>
          ) : (
            <div className="mt-3 rounded-xl bg-brand/5 px-4 py-3 text-sm text-foreground">
              These avoided costs cover about{" "}
              <strong>
                {m.investment > 0
                  ? Math.round((m.savings / m.investment) * 100)
                  : 0}
                %
              </strong>{" "}
              of the investment, and your team still gets unlimited same-day
              care they&rsquo;ll actually use.
            </div>
          )}

          <div className="mt-4 rounded-xl border border-border/60 bg-surface p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
              And every employee gets
            </div>
            <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {[
                "Unlimited visits, no copays",
                "Same-day access",
                "A real doctor by text",
                "Labs & meds at cost",
              ].map((b) => (
                <li key={b} className="flex items-center gap-1.5 text-xs text-foreground/85">
                  <Check className="h-3 w-3 shrink-0 text-brand" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-5 text-muted-foreground">
            <Info className="mt-0.5 h-3 w-3 shrink-0" />
            A transparent estimate you control, not a guarantee. Higher-utilization workforces (manufacturing, trades, logistics) typically
            avoid far more. We&rsquo;ll refine it against your real numbers on
            the call.
          </p>
        </div>
      </div>

      {/* ---------- Lead capture ---------- */}
      <div className="border-t border-border/60 bg-surface p-6 sm:p-8">
        {submitted ? (
          <div className="flex items-start gap-3 rounded-2xl bg-brand/5 p-5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <div>
              <div className="text-sm font-semibold text-foreground">
                Got it, we&rsquo;ll be in touch.
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                We&rsquo;ll follow up within one business day to confirm your
                numbers and set up a 15-minute consult.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Want this tailored to your team?
              </h3>
              <p className="text-sm text-muted-foreground">
                Send it over and we&rsquo;ll build your ROI on your real
                numbers, no obligation.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="calc-name">Your name</Label>
                <Input id="calc-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calc-company">Company</Label>
                <Input id="calc-company" value={company} onChange={(e) => setCompany(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calc-email">Email</Label>
                <Input id="calc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calc-phone">Phone</Label>
                <Input id="calc-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <Button type="submit" size="lg" className="mt-5 bg-brand text-brand-foreground hover:bg-brand/90">
              <Send className="mr-1.5 h-4 w-4" />
              Send me my ROI estimate
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function MiniField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="truncate text-sm text-foreground/90">{label}</div>
        <div className="text-[11px] text-muted-foreground">{hint}</div>
      </div>
      <Input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-20 shrink-0 text-right"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="shrink-0 font-mono font-semibold tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  );
}
