"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ArrowLeft, Download, Mail, Phone, Printer, Archive } from "lucide-react";
import { AdminButton } from "@/components/admin/admin-button";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin/store";
import { formatDateTime } from "@/lib/admin/format";
import {
  PATIENT_SECTIONS,
  patientFieldLabel,
  formatFieldValue,
} from "@/components/patient-form/labels";
import { downloadText, rowsToCsv, slugify } from "@/lib/admin/download";

export default function PatientFormDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, dispatch } = useAdmin();
  const sub = state.submissions.find((s) => s.id === params.id);

  // Mark read on open.
  useEffect(() => {
    if (sub && !sub.read) {
      dispatch({ type: "submission_mark_read", id: sub.id, read: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub?.id]);

  // Group the answers into sections; collect anything unmapped into "Other".
  const grouped = useMemo(() => {
    const data = sub?.formData ?? {};
    const used = new Set<string>();
    const sections = PATIENT_SECTIONS.map((sec) => {
      const rows = sec.keys
        .filter((k) => data[k] != null && data[k] !== "")
        .map((k) => {
          used.add(k);
          return { label: patientFieldLabel(k), value: formatFieldValue(data[k]!) };
        });
      return { title: sec.title, rows };
    }).filter((s) => s.rows.length > 0);

    const other = Object.keys(data)
      .filter((k) => !used.has(k))
      .map((k) => ({ label: patientFieldLabel(k), value: formatFieldValue(data[k]!) }));
    if (other.length) sections.push({ title: "Other", rows: other });
    return sections;
  }, [sub?.formData]);

  const allRows = useMemo(() => grouped.flatMap((s) => s.rows), [grouped]);

  if (!sub) {
    return (
      <div className="space-y-4">
        <AdminButton href="/admin/patient-forms" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" /> Back to patient forms
        </AdminButton>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          Form not found.
        </div>
      </div>
    );
  }

  function exportCsv() {
    if (!sub) return;
    const header = [
      { label: "Submitted", value: formatDateTime(sub.createdAt) },
      { label: "Name", value: sub.name },
      { label: "Email", value: sub.email ?? "" },
      { label: "Phone", value: sub.phone ?? "" },
    ];
    const csv = rowsToCsv([...header, ...allRows]);
    downloadText(`patient-intake-${slugify(sub.name)}.csv`, csv, "text/csv");
  }

  return (
    <div className="space-y-5">
      {/* Print rule: hide everything but #printable when printing */}
      <style>{`
        @media print {
          body { visibility: hidden; }
          #printable, #printable * { visibility: visible; }
          #printable { position: absolute; left: 0; top: 0; width: 100%; padding: 0; }
          .no-print { display: none !important; }
          @page { margin: 0.5in; }
        }
      `}</style>

      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <AdminButton href="/admin/patient-forms" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" /> Back to patient forms
        </AdminButton>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-1.5 h-4 w-4" />
            Print / PDF
          </Button>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="mr-1.5 h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              dispatch({ type: "submission_archive", id: sub.id });
              router.push("/admin/patient-forms");
            }}
          >
            <Archive className="mr-1.5 h-4 w-4" />
            Archive
          </Button>
        </div>
      </div>

      <div id="printable" className="space-y-5">
        {/* Header card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            New patient intake
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {sub.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-slate-600">
            {sub.email && (
              <a href={`mailto:${sub.email}`} className="flex items-center gap-1.5 hover:text-slate-900">
                <Mail className="h-3.5 w-3.5" /> {sub.email}
              </a>
            )}
            {sub.phone && (
              <a href={`tel:${sub.phone}`} className="flex items-center gap-1.5 font-mono hover:text-slate-900">
                <Phone className="h-3.5 w-3.5" /> {sub.phone}
              </a>
            )}
            <span>Submitted {formatDateTime(sub.createdAt)}</span>
          </div>
        </div>

        {allRows.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            This form was submitted before full answers were captured, so only
            the contact details above are available.
          </div>
        ) : (
          grouped.map((section) => (
            <div key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-brand-accent">
                {section.title}
              </h2>
              <dl className="divide-y divide-slate-100">
                {section.rows.map((r) => (
                  <div
                    key={r.label}
                    className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-4"
                  >
                    <dt className="text-sm text-slate-500">{r.label}</dt>
                    <dd className="text-sm font-medium text-slate-900">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
