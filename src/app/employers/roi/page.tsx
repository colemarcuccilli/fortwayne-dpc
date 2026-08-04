import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { PRACTICE } from "@/lib/site-data";
import { PrintButton } from "./roi-actions";

export const metadata: Metadata = {
  title: "Employer ROI Sheet — $79/employee/month",
  description:
    "The Fort Wayne DPC employer ROI advantage — how a $79/month membership compares to the cost of urgent care, ER visits, and missed workdays.",
};

const EMPLOYEE_BENEFITS = [
  "Unlimited primary care visits",
  "Same-day or next-day appointments",
  "Direct physician access",
  "Telehealth visits",
  "Preventive & annual wellness care",
  "Chronic disease management",
  "Discounted labs & medications",
  "30–60 minute personalized visits",
];

/**
 * Print-optimized one-page ROI leave-behind for employer sales meetings.
 * Screen: light gray backdrop with a "page". Print: clean white A4-ish
 * sheet, nav/footer hidden via a body-level style.
 */
export default function EmployerRoiSheet() {
  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      {/* Hide the site header/footer + set print margins when printing */}
      <style>{`
        @media print {
          header, footer { display: none !important; }
          main { padding: 0 !important; }
          @page { margin: 0.5in; }
        }
      `}</style>

      <div className="mx-auto mb-4 flex max-w-[8.5in] items-center justify-between px-4 print:hidden">
        <Link href="/employers" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to For Business
        </Link>
        <PrintButton />
      </div>

      <div className="mx-auto max-w-[8.5in] bg-white px-8 py-8 shadow-sm print:max-w-none print:px-0 print:py-0 print:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-brand pb-4">
          <Image
            src="/assets/FortWayneDPCLogoPNG.png"
            alt="Fort Wayne Direct Primary Care"
            width={190}
            height={60}
            className="h-14 w-auto object-contain"
          />
          <div className="text-right">
            <div className="font-mono text-3xl font-bold tracking-tight text-brand">
              $79
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              per employee / month
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-accent">
            The Employer ROI Advantage
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Healthcare that works for your employees and your bottom line.
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Investment: <strong>$79 per employee / month — $948 / year.</strong>{" "}
            The question isn&rsquo;t whether you can afford Direct Primary Care.
            It&rsquo;s whether you can afford the cost of delayed care,
            absenteeism, and unnecessary healthcare utilization.
          </p>
        </div>

        {/* Hidden costs */}
        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            The hidden cost of traditional healthcare
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Cost label="One urgent care visit" amount="$150–$250+" />
            <Cost label="One ER visit" amount="$1,500–$3,000+" />
            <Cost label="One missed workday" amount="$200–$400+" />
          </div>
        </div>

        {/* Worked example */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            Example — a 20-employee company
          </div>
          <div className="mt-3 grid grid-cols-2 gap-5">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                Annual investment
              </div>
              <div className="mt-1 font-mono text-2xl font-bold text-slate-900">
                $18,960
              </div>
              <div className="text-xs text-slate-500">20 × $79/mo</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                Potential annual savings
              </div>
              <ul className="mt-1 space-y-0.5 text-sm text-slate-700">
                <li>10 urgent-care visits avoided — $2,000+</li>
                <li>2 ER visits avoided — $4,000–$6,000+</li>
                <li>20 missed workdays avoided — $4,000–$8,000+</li>
                <li>Retaining one employee — thousands</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 border-t border-slate-200 pt-3 text-sm font-medium text-slate-800">
            Potential savings can easily exceed the annual membership
            investment — before counting a healthier, more productive team.
          </p>
        </div>

        {/* Two columns: how it helps + employee benefits */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              How Fort Wayne DPC helps
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {[
                "Same-day / next-day access — care when they need it",
                "Direct physician contact by message, phone, telehealth",
                "Unlimited care with no copays — people seek care early",
                "Better chronic-disease control, fewer complications",
                "Preventive focus catches problems before they get expensive",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Every employee gets
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-1.5 text-sm text-slate-700">
              {EMPLOYEE_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="mt-8 flex items-center justify-between border-t-2 border-brand pt-4">
          <div>
            <div className="text-sm font-bold text-slate-900">
              Fort Wayne Direct Primary Care
            </div>
            <div className="text-xs text-slate-500">
              Simple. Accessible. Affordable.
            </div>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div className="font-mono font-semibold text-slate-900">
              {PRACTICE.phone}
            </div>
            <div>{PRACTICE.email}</div>
            <div>{PRACTICE.address.street}, {PRACTICE.address.city}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cost({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="mt-1 font-mono text-lg font-bold text-brand-accent">
        {amount}
      </div>
    </div>
  );
}
