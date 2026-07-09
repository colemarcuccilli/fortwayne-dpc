"use client";

import { useMemo, useState } from "react";
import { format, parseISO, startOfMonth } from "date-fns";
import { DollarSign, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdmin } from "@/lib/admin/store";
import { TXN_KINDS, TXN_KIND_LABEL, type TransactionKind } from "@/lib/admin/types";
import { formatDate, formatMoney } from "@/lib/admin/format";
import { KpiCard } from "@/components/admin/kpi-card";

const TXN_TONES: Record<TransactionKind, string> = {
  membership: "bg-emerald-100 text-emerald-700",
  aesthetics: "bg-pink-100 text-pink-700",
  occupational: "bg-orange-100 text-orange-700",
  employer_contract: "bg-violet-100 text-violet-700",
  consultation: "bg-blue-100 text-blue-700",
  refund: "bg-rose-100 text-rose-700",
};

export default function TransactionsPage() {
  const { state, dispatch } = useAdmin();
  const [filter, setFilter] = useState<"all" | TransactionKind>("all");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const all = [...state.transactions].sort(
      (a, b) =>
        parseISO(b.occurredAt).getTime() - parseISO(a.occurredAt).getTime(),
    );
    if (filter === "all") return all;
    return all.filter((t) => t.kind === filter);
  }, [state.transactions, filter]);

  const monthStart = startOfMonth(new Date());
  const monthTotal = state.transactions
    .filter((t) => parseISO(t.occurredAt) >= monthStart)
    .reduce((s, t) => s + t.amount, 0);
  const monthCount = state.transactions.filter(
    (t) => parseISO(t.occurredAt) >= monthStart,
  ).length;
  const totalRevenue = state.transactions
    .filter((t) => t.kind !== "refund")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Transactions"
        subtitle="Membership dues, aesthetics, occ-med, and employer contracts."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Log payment
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="This month"
          value={formatMoney(monthTotal)}
          hint={`${monthCount} transactions`}
          icon={DollarSign}
          tone="success"
        />
        <KpiCard
          label="Lifetime"
          value={formatMoney(totalRevenue)}
          hint="excluding refunds"
        />
        <KpiCard
          label="Memberships"
          value={String(
            state.transactions.filter((t) => t.kind === "membership").length,
          )}
        />
        <KpiCard
          label="Employer contracts"
          value={String(
            state.transactions.filter((t) => t.kind === "employer_contract")
              .length,
          )}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterChip>
        {TXN_KINDS.map((k) => (
          <FilterChip
            key={k}
            active={filter === k}
            onClick={() => setFilter(k)}
          >
            {TXN_KIND_LABEL[k]}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={DollarSign} title="No transactions" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {filtered.map((t) => (
              <li key={t.id} className="flex items-center gap-4 px-4 py-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${TXN_TONES[t.kind]}`}>
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {t.customerName ?? "—"}
                    </div>
                    <span className="rounded-full bg-slate-100 px-1.5 py-0 text-[10px] font-semibold uppercase text-slate-600">
                      {TXN_KIND_LABEL[t.kind]}
                    </span>
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    {t.description ?? "—"} · {formatDate(t.occurredAt)}
                  </div>
                </div>
                <div className="font-mono text-sm font-semibold text-slate-900">
                  {formatMoney(t.amount)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Delete this transaction?"))
                      dispatch({ type: "txn_delete", id: t.id });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log a payment</DialogTitle>
          </DialogHeader>
          <TransactionForm onSaved={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function TransactionForm({ onSaved }: { onSaved: () => void }) {
  const { dispatch, state } = useAdmin();
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [kind, setKind] = useState<TransactionKind>("membership");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({
          type: "txn_add",
          data: {
            customerId: customerId || undefined,
            customerName: customerName || undefined,
            kind,
            amount: Math.round(Number(amount) * 100),
            currency: "USD",
            description: description || undefined,
            occurredAt: new Date().toISOString(),
          },
        });
        onSaved();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label>Customer</Label>
        <Select
          value={customerId || "_none"}
          onValueChange={(v) => {
            if (v === "_none") {
              setCustomerId("");
              return;
            }
            const c = state.customers.find((c) => c.id === v);
            setCustomerId(v);
            if (c) setCustomerName(`${c.firstName} ${c.lastName}`);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="— None / freeform —" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_none">— None / freeform —</SelectItem>
            {state.customers.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cn">Customer name (or company)</Label>
        <Input
          id="cn"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="kind">Kind</Label>
          <Select value={kind} onValueChange={(v) => setKind(v as TransactionKind)}>
            <SelectTrigger id="kind">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TXN_KINDS.map((k) => (
                <SelectItem key={k} value={k}>
                  {TXN_KIND_LABEL[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amt">Amount ($)</Label>
          <Input
            id="amt"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="desc">Description</Label>
        <Input
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Standard plan — May 2026"
        />
      </div>
      <Button type="submit" className="w-full">
        Log payment
      </Button>
    </form>
  );
}
