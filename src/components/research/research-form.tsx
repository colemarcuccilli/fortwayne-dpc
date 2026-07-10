"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X, Check } from "lucide-react";
import { useResearch, type NewProspectInput } from "@/lib/admin/research-store";
import type { ProspectContact } from "@/lib/admin/types";

interface ContactDraft extends ProspectContact {
  _id: string;
}

let counter = 0;
function blankContact(): ContactDraft {
  counter += 1;
  return { _id: `c${counter}`, name: "", title: "", email: "", phone: "", linkedin: "" };
}

export function ResearchForm() {
  const { addProspect } = useResearch();
  const [saving, setSaving] = useState(false);
  const [savedName, setSavedName] = useState<string | null>(null);

  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [location, setLocation] = useState("Fort Wayne, IN");
  const [fitScore, setFitScore] = useState("7");
  const [estValue, setEstValue] = useState("");
  const [fitReason, setFitReason] = useState("");
  const [researchNotes, setResearchNotes] = useState("");
  const [tagText, setTagText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [sourcesText, setSourcesText] = useState("");
  const [contacts, setContacts] = useState<ContactDraft[]>([blankContact()]);

  function addTag() {
    const t = tagText.trim();
    if (!t || tags.includes(t)) return;
    setTags((p) => [...p, t]);
    setTagText("");
  }

  function updateContact(id: string, patch: Partial<ContactDraft>) {
    setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, ...patch } : c)));
  }

  function resetForm() {
    setCompany("");
    setWebsite("");
    setIndustry("");
    setEmployeeCount("");
    setLocation("Fort Wayne, IN");
    setFitScore("7");
    setEstValue("");
    setFitReason("");
    setResearchNotes("");
    setTags([]);
    setSourcesText("");
    setContacts([blankContact()]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const cleanedContacts: ProspectContact[] = contacts
      .filter((c) => c.name.trim())
      .map((c) => ({
        name: c.name.trim(),
        title: c.title?.trim() || undefined,
        email: c.email?.trim() || undefined,
        phone: c.phone?.trim() || undefined,
        linkedin: c.linkedin?.trim() || undefined,
      }));

    const sources = sourcesText
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const input: NewProspectInput = {
      company: company.trim(),
      website: website.trim() || undefined,
      industry: industry.trim() || undefined,
      employeeCount: employeeCount ? Number(employeeCount) : undefined,
      location: location.trim() || undefined,
      fitScore: fitScore ? Number(fitScore) : undefined,
      estValueUsd: estValue ? Number(estValue) : undefined,
      fitReason: fitReason.trim() || undefined,
      researchNotes: researchNotes.trim() || undefined,
      tags,
      sources,
      contacts: cleanedContacts,
    };

    await addProspect(input);
    setSavedName(company.trim());
    resetForm();
    setSaving(false);
    // Scroll to top so the agent sees the confirmation + fresh form
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setSavedName(null), 6000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedName && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Check className="h-4 w-4 shrink-0" strokeWidth={3} />
          <span>
            Saved <strong>{savedName}</strong> to the pipeline (Researched
            stage). Form cleared for the next one.
          </span>
        </div>
      )}

      {/* Company */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          1 · Company
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="company">
              Company name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              placeholder="Fort Wayne Metal Products"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Manufacturing"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employees">Employee count</Label>
            <Input
              id="employees"
              type="number"
              value={employeeCount}
              onChange={(e) => setEmployeeCount(e.target.value)}
              placeholder="68"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Fit */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          2 · Fit assessment
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fit-score">Fit score (1–10)</Label>
            <Input
              id="fit-score"
              type="number"
              min={1}
              max={10}
              value={fitScore}
              onChange={(e) => setFitScore(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="est-value">Est. annual value ($)</Label>
            <Input
              id="est-value"
              type="number"
              value={estValue}
              onChange={(e) => setEstValue(e.target.value)}
              placeholder="68000"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="fit-reason">
              Why they&rsquo;re a good fit (one paragraph)
            </Label>
            <Textarea
              id="fit-reason"
              rows={3}
              value={fitReason}
              onChange={(e) => setFitReason(e.target.value)}
              placeholder="Self-funded manufacturer in Allen County, 68 employees (in the sweet spot). Physically demanding work = high musculoskeletal + chronic-disease claims. Owner is active in local Rotary — possible warm intro."
            />
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            3 · Decision-makers
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setContacts((p) => [...p, blankContact()])}
          >
            <Plus className="h-4 w-4" />
            Add contact
          </Button>
        </div>
        <div className="space-y-4">
          {contacts.map((c, i) => (
            <div
              key={c._id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Contact {i + 1}
                </span>
                {contacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setContacts((p) => p.filter((x) => x._id !== c._id))
                    }
                    className="text-slate-400 hover:text-rose-600"
                    aria-label="Remove contact"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Name"
                  value={c.name}
                  onChange={(e) => updateContact(c._id, { name: e.target.value })}
                />
                <Input
                  placeholder="Title (HR Director, CFO, Owner…)"
                  value={c.title}
                  onChange={(e) => updateContact(c._id, { title: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={c.email}
                  onChange={(e) => updateContact(c._id, { email: e.target.value })}
                />
                <Input
                  type="tel"
                  placeholder="Phone"
                  value={c.phone}
                  onChange={(e) => updateContact(c._id, { phone: e.target.value })}
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={c.linkedin}
                  onChange={(e) =>
                    updateContact(c._id, { linkedin: e.target.value })
                  }
                  className="sm:col-span-2"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notes + tags + sources */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          4 · Research notes, tags &amp; sources
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">
              Research notes (broker, triggers, warm-intro paths, anything else)
            </Label>
            <Textarea
              id="notes"
              rows={4}
              value={researchNotes}
              onChange={(e) => setResearchNotes(e.target.value)}
              placeholder="Current broker: unknown. Benefits renewal likely Jan 1. Recently added a second shift (growth signal). CEO quoted in local paper about rising insurance costs — strong trigger."
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="self-funded, manufacturer, warm-intro…"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => setTags((p) => p.filter((x) => x !== t))}
                      aria-label={`Remove ${t}`}
                      className="hover:text-slate-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sources">Sources — one URL or reference per line</Label>
            <Textarea
              id="sources"
              rows={3}
              value={sourcesText}
              onChange={(e) => setSourcesText(e.target.value)}
              placeholder={
                "https://company.com/about\nIndiana Manufacturers Association directory\nLinkedIn — Jane Doe, HR Director"
              }
              className="font-mono text-xs"
            />
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <p className="text-xs text-slate-500">
          Saves to the <strong>Researched</strong> column of the pipeline.
        </p>
        <Button type="submit" disabled={saving || !company.trim()} size="lg">
          {saving ? "Saving…" : "Save prospect"}
        </Button>
      </div>
    </form>
  );
}
