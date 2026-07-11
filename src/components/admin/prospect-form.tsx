"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BENEFITS_STATUSES,
  BENEFITS_STATUS_LABEL,
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABEL,
  type BenefitsStatus,
  type PipelineStage,
} from "@/lib/admin/types";
import { useAdmin } from "@/lib/admin/store";
import { X, Plus } from "lucide-react";

interface Props {
  onSaved: (id: string) => void;
  onCancel?: () => void;
  initialStage?: PipelineStage;
}

/**
 * Form for adding a new prospect. Contacts + tags are lightweight
 * inline editors so the researcher can enter everything in one pass.
 */
export function ProspectForm({ onSaved, onCancel, initialStage = "researched" }: Props) {
  const { dispatch, state } = useAdmin();

  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [location, setLocation] = useState("Fort Wayne, IN");
  const [stage, setStage] = useState<PipelineStage>(initialStage);
  const [fitScore, setFitScore] = useState("7");
  const [fitReason, setFitReason] = useState("");
  const [benefitsStatus, setBenefitsStatus] = useState<BenefitsStatus>("unknown");
  const [tagText, setTagText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  function addTag() {
    const trimmed = tagText.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags((prev) => [...prev, trimmed]);
    setTagText("");
  }
  function removeTag(t: string) {
    setTags((prev) => prev.filter((x) => x !== t));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const contacts = contactName
      ? [
          {
            name: contactName,
            title: contactTitle || undefined,
            email: contactEmail || undefined,
            phone: contactPhone || undefined,
          },
        ]
      : [];

    // Optimistic assign of temp id, real id set inside reducer
    const beforeCount = state.prospects.length;
    dispatch({
      type: "prospect_add",
      data: {
        company,
        website: website || undefined,
        industry: industry || undefined,
        employeeCount: employeeCount ? Number(employeeCount) : undefined,
        location: location || undefined,
        stage,
        fitScore: fitScore ? Number(fitScore) : undefined,
        fitReason: fitReason || undefined,
        benefitsStatus,
        contacts,
        tags,
      },
    });
    // The newest prospect will be at index 0 after add; the id is
    // generated in the reducer so we look it up.
    setTimeout(() => {
      const newest = (state.prospects.length > beforeCount ? state.prospects[0] : undefined);
      if (newest) onSaved(newest.id);
      else onSaved("_new");
    }, 0);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            placeholder="Acme Manufacturing"
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
          <Label htmlFor="employee-count">Employees</Label>
          <Input
            id="employee-count"
            type="number"
            value={employeeCount}
            onChange={(e) => setEmployeeCount(e.target.value)}
            placeholder="45"
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="stage">Stage</Label>
          <Select value={stage} onValueChange={(v) => setStage(v as PipelineStage)}>
            <SelectTrigger id="stage">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PIPELINE_STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {PIPELINE_STAGE_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          <Label htmlFor="benefits-status">Current benefits</Label>
          <Select
            value={benefitsStatus}
            onValueChange={(v) => setBenefitsStatus(v as BenefitsStatus)}
          >
            <SelectTrigger id="benefits-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BENEFITS_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {BENEFITS_STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fit-reason">Why they&rsquo;re a good fit</Label>
        <Textarea
          id="fit-reason"
          rows={3}
          value={fitReason}
          onChange={(e) => setFitReason(e.target.value)}
          placeholder="Self-funded, 40+ employees, industry match, personal connection, etc."
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
            placeholder="e.g. self-funded, manufacturer, warm-intro"
          />
          <Button type="button" variant="outline" onClick={addTag}>
            <Plus className="h-4 w-4" />
            Add
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
                  onClick={() => removeTag(t)}
                  aria-label={`Remove tag ${t}`}
                  className="hover:text-slate-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Primary contact (optional)
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Name</Label>
            <Input
              id="contact-name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-title">Title</Label>
            <Input
              id="contact-title"
              value={contactTitle}
              onChange={(e) => setContactTitle(e.target.value)}
              placeholder="HR Director"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="260-555-0100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save prospect</Button>
      </div>
    </form>
  );
}
