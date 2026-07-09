"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminButton } from "@/components/admin/admin-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { useAdmin } from "@/lib/admin/store";
import {
  APPT_TYPE_LABEL,
  MEMBERSHIP_TIER_LABEL,
  TXN_KIND_LABEL,
} from "@/lib/admin/types";
import {
  formatDate,
  formatDateTime,
  formatMoney,
  initials,
  timeAgo,
} from "@/lib/admin/format";
import { CustomerForm } from "@/components/admin/customer-form";

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, dispatch } = useAdmin();
  const customer = state.customers.find((c) => c.id === params.id);
  const [editOpen, setEditOpen] = useState(false);
  const [noteBody, setNoteBody] = useState("");

  if (!customer) {
    return (
      <div className="space-y-4">
        <AdminButton href="/admin/customers" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" /> Back to customers
        </AdminButton>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          Customer not found.
        </div>
      </div>
    );
  }

  const appts = state.appointments
    .filter((a) => a.customerId === customer.id)
    .sort(
      (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
    );

  const txns = state.transactions.filter((t) => t.customerId === customer.id);

  function addNote() {
    if (!customer || !noteBody.trim()) return;
    dispatch({
      type: "customer_add_note",
      id: customer.id,
      note: { body: noteBody.trim(), authorLabel: "Admin" },
    });
    setNoteBody("");
  }

  function deleteCustomer() {
    if (!customer) return;
    if (!confirm(`Delete ${customer.firstName} ${customer.lastName}?`)) return;
    dispatch({ type: "customer_delete", id: customer.id });
    router.push("/admin/customers");
  }

  return (
    <div className="space-y-6">
      <AdminButton href="/admin/customers" variant="ghost" size="sm">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </AdminButton>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
              {initials(`${customer.firstName} ${customer.lastName}`)}
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                {customer.firstName} {customer.lastName}
              </h1>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-700">
                  {MEMBERSHIP_TIER_LABEL[customer.membership]}
                </span>
                {customer.membershipStart && (
                  <span>Since {formatDate(customer.membershipStart, "MMM d, yyyy")}</span>
                )}
                {customer.dob && (
                  <span>DOB {formatDate(customer.dob, "MMM d, yyyy")}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" onClick={deleteCustomer}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <ContactRow icon={Mail} label="Email">
            <a href={`mailto:${customer.email}`}>{customer.email}</a>
          </ContactRow>
          <ContactRow icon={Phone} label="Phone">
            <a href={`tel:${customer.phone}`} className="font-mono">
              {customer.phone}
            </a>
          </ContactRow>
          {customer.address && (
            <ContactRow icon={MapPin} label="Address">
              {customer.address}
            </ContactRow>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Appointments */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Calendar className="h-4 w-4" /> Appointment history
          </h2>
          {appts.length === 0 ? (
            <EmptyState title="No appointments" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {appts.map((a) => (
                <li key={a.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {APPT_TYPE_LABEL[a.type]}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatDateTime(a.startsAt)}
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
                      {a.status.replace("_", " ")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notes + payments */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Notes</h2>
              <span className="text-[11px] text-slate-500">
                {customer.notes.length}
              </span>
            </div>
            <div className="space-y-2">
              <Textarea
                rows={3}
                placeholder="Add a note (visible only in admin)"
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
              />
              <Button
                onClick={addNote}
                disabled={!noteBody.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4" /> Add note
              </Button>
            </div>
            {customer.notes.length > 0 && (
              <ul className="mt-4 space-y-3">
                {customer.notes.map((n) => (
                  <li key={n.id} className="rounded-lg bg-slate-50 p-3">
                    <div className="text-sm text-slate-800">{n.body}</div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {n.authorLabel ?? "Admin"} · {timeAgo(n.createdAt)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <DollarSign className="h-4 w-4" /> Payments
            </h2>
            {txns.length === 0 ? (
              <p className="text-xs text-slate-500">No transactions.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {txns.map((t) => (
                  <li key={t.id} className="py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {TXN_KIND_LABEL[t.kind]}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatDate(t.occurredAt)}
                        </div>
                      </div>
                      <div className="font-mono text-sm font-semibold text-slate-900">
                        {formatMoney(t.amount)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit customer</DialogTitle>
          </DialogHeader>
          <CustomerForm
            editing={customer}
            onSaved={() => setEditOpen(false)}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 text-sm text-slate-800">{children}</div>
    </div>
  );
}
