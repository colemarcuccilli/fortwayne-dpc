"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { YesNoQuestion } from "@/components/patient-form/data";

// ---------- text / email / date / tel field ----------

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  name: string;
  hint?: string;
}

export function TextField({
  label,
  required,
  name,
  hint,
  className,
  ...rest
}: TextFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-brand-accent">*</span>}
      </Label>
      <Input id={name} name={name} required={required} {...rest} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ---------- textarea ----------

interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  required?: boolean;
}

export function TextAreaField({
  label,
  required,
  name,
  className,
  ...rest
}: TextAreaFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-brand-accent">*</span>}
      </Label>
      <Textarea id={name} name={name} required={required} {...rest} />
    </div>
  );
}

// ---------- select ----------

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  required?: boolean;
  options: readonly string[];
  placeholder?: string;
}

export function SelectField({
  label,
  name,
  required,
  options,
  placeholder = "— Select —",
  className,
  ...rest
}: SelectFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-brand-accent">*</span>}
      </Label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ---------- yes / no / N-A radio row ----------

interface YesNoNaFieldProps {
  name: string;
  label: string;
  required?: boolean;
}

export function YesNoNaField({
  name,
  label,
  required,
}: YesNoNaFieldProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 py-3 last:border-b-0">
      <div className="flex-1 min-w-0 text-sm text-foreground/90">
        {label}
        {required && <span className="ml-1 text-brand-accent">*</span>}
      </div>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em]"
      >
        {["Yes", "No", "N/A"].map((value) => (
          <label
            key={value}
            className="flex h-8 cursor-pointer items-center rounded-md border border-border/60 bg-background px-3 transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand has-[:checked]:text-brand-foreground"
          >
            <input
              type="radio"
              name={name}
              value={value}
              required={required}
              className="sr-only"
            />
            {value}
          </label>
        ))}
      </div>
    </div>
  );
}

interface YesNoNaGroupProps {
  questions: YesNoQuestion[];
}

export function YesNoNaGroup({ questions }: YesNoNaGroupProps) {
  return (
    <div className="divide-y divide-border/40 rounded-2xl border border-border/60 bg-surface px-5">
      {questions.map((q) => (
        <YesNoNaField key={q.name} name={q.name} label={q.label} />
      ))}
    </div>
  );
}

// ---------- simple checkbox list ----------

interface CheckboxListProps {
  name: string;
  items: string[];
  className?: string;
}

export function CheckboxList({ name, items, className }: CheckboxListProps) {
  return (
    <ul
      className={cn(
        "grid gap-2 sm:grid-cols-2 md:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item}>
          <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand-muted">
            <input
              type="checkbox"
              name={`${name}[]`}
              value={item}
              className="mt-0.5 h-4 w-4 rounded border-border text-brand focus:ring-brand"
            />
            <span className="text-foreground/85">{item}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

// ---------- fieldset (section) wrapper ----------

interface FieldsetProps {
  legend: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Fieldset({
  legend,
  description,
  children,
  className,
}: FieldsetProps) {
  return (
    <fieldset className={cn("space-y-5", className)}>
      <legend className="text-base font-semibold tracking-tight text-foreground">
        {legend}
      </legend>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
    </fieldset>
  );
}
