"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  ACTIVITY_LEVELS,
  BASIC_HEALTH_QUESTIONS,
  FAMILY_HISTORY_ITEMS,
  FEMALE_QUESTIONS,
  HEARD_ABOUT_OPTIONS,
  IMPORTANT_ELEMENT_OPTIONS,
  MEDICATION_QUESTIONS,
  MENTAL_HEALTH_QUESTIONS,
  PAST_WEIGHT_LOSS_PROGRAMS,
  PSYCHOSOCIAL_QUESTIONS,
  RACE_OPTIONS,
  REVIEW_OF_SYSTEMS,
  SEX_OPTIONS,
  SOCIAL_QUESTIONS,
  STEPS,
  type StepId,
} from "@/components/patient-form/data";
import {
  CheckboxList,
  Fieldset,
  SelectField,
  TextAreaField,
  TextField,
  YesNoNaGroup,
} from "@/components/patient-form/fields";

export function PatientForm() {
  const [step, setStep] = useState<StepId>(1);
  const [submitted, setSubmitted] = useState(false);

  function next() {
    if (step < 5) setStep((s) => (s + 1) as StepId);
  }
  function prev() {
    if (step > 1) setStep((s) => (s - 1) as StepId);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border/70 bg-surface p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Check className="h-7 w-7" strokeWidth={3} />
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight">
          Thanks — your form is on its way.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Our office will review your intake and reach out within one business
          day. In the meantime, you&rsquo;ll receive a confirmation at the
          email address you provided.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <LinkButton href="/" variant="brand" size="md">
            Back to home
          </LinkButton>
          <LinkButton href="/contact" variant="outline" size="md">
            Contact the office
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (step < 5) {
          next();
          return;
        }
        setSubmitted(true);
      }}
      className="space-y-10"
    >
      <StepIndicator current={step} />

      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      {step === 4 && <Step4 />}
      {step === 5 && <Step5 />}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prev}
          disabled={step === 1}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Step {step} of 5
        </div>
        <Button type="submit">
          {step === 5 ? "Submit form" : "Continue"}
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

// ---------- Step indicator ----------

function StepIndicator({ current }: { current: StepId }) {
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {STEPS.map((s) => {
        const state =
          s.id < current ? "complete" : s.id === current ? "current" : "todo";
        return (
          <li
            key={s.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
              state === "current" &&
                "border-brand bg-brand/5 text-foreground",
              state === "complete" &&
                "border-brand/30 bg-brand/5 text-muted-foreground",
              state === "todo" &&
                "border-border/60 bg-surface text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold",
                state === "current" && "bg-brand text-brand-foreground",
                state === "complete" && "bg-brand/20 text-brand",
                state === "todo" && "bg-muted text-muted-foreground",
              )}
            >
              {state === "complete" ? <Check className="h-3 w-3" /> : s.id}
            </span>
            <span className="truncate">{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

// ---------- Step 1: Health & Wellness History ----------

function Step1() {
  return (
    <div className="space-y-12">
      <SectionHeading
        title="Patient information"
        body="This form collects the information Dr. Aluri needs for your first visit. Fields marked with an asterisk are required."
      />

      <Fieldset legend="Basic information">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="first_name" label="First name" required />
          <TextField name="last_name" label="Last name" required />
          <TextField name="form_date" label="Date" type="date" required />
          <TextField name="dob" label="Date of birth" type="date" required />
          <TextField
            name="home_phone"
            label="Home phone"
            type="tel"
            placeholder="(260) 555-0100"
          />
          <TextField
            name="cell_phone"
            label="Cell phone"
            type="tel"
            required
            placeholder="(260) 555-0100"
          />
          <TextField name="email" label="Email" type="email" required />
          <SelectField name="sex" label="Sex" required options={SEX_OPTIONS} />
          <SelectField name="race" label="Race" options={RACE_OPTIONS} />
          <TextField name="occupation" label="Occupation" required />
        </div>
      </Fieldset>

      <Fieldset legend="Address">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="address" label="Street address" required className="sm:col-span-2" />
          <TextField name="city" label="City" required />
          <TextField name="state" label="State" required />
          <TextField name="zip" label="Zip" required />
        </div>
      </Fieldset>

      <Fieldset legend="How did you hear about us?">
        <SelectField
          name="heard_about"
          label="Referral source"
          options={HEARD_ABOUT_OPTIONS}
        />
      </Fieldset>

      <Fieldset legend="Pharmacy">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="pharmacy_name" label="Pharmacy name" />
          <TextField name="pharmacy_phone" label="Phone" type="tel" />
          <TextField
            name="pharmacy_address"
            label="Street address"
            className="sm:col-span-2"
          />
          <TextField name="pharmacy_city" label="City" />
          <TextField name="pharmacy_state" label="State" />
          <TextField name="pharmacy_zip" label="Zip" />
        </div>
      </Fieldset>

      <Fieldset legend="Primary care physician">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="pcp_name" label="Physician name" />
          <TextField name="pcp_phone" label="Phone" type="tel" />
          <TextField
            name="pcp_address"
            label="Street address"
            className="sm:col-span-2"
          />
          <TextField name="pcp_city" label="City" />
          <TextField name="pcp_state" label="State" />
          <TextField name="pcp_zip" label="Zip" />
        </div>
      </Fieldset>

      <Fieldset legend="Basic health history">
        <p className="text-xs text-muted-foreground">
          Select <em>N/A</em> if you don&rsquo;t know the answer.
        </p>
        <YesNoNaGroup questions={BASIC_HEALTH_QUESTIONS} />
      </Fieldset>

      <Fieldset legend="About your visit today">
        <div className="grid gap-5 md:grid-cols-2">
          <TextAreaField
            name="chief_complaint"
            label="Describe the main reason for your visit today"
            rows={4}
            className="md:col-span-2"
          />
          <TextAreaField
            name="weight_affects_life"
            label="How does your weight affect your daily life?"
            rows={3}
          />
          <TextAreaField
            name="caused_weight_gain"
            label="What changed that caused the weight gain?"
            rows={3}
          />
          <TextAreaField
            name="main_reason_treatment"
            label="Main reason you're seeking treatment now"
            rows={3}
          />
          <TextField name="goal_weight" label="Goal weight" placeholder="lbs" />
          <TextField
            name="last_ideal_weight"
            label="Last time you were at your ideal weight"
          />
          <TextField name="amount_to_lose" label="How much do you want to lose?" placeholder="lbs" />
          <TextField
            name="diet_frequency"
            label="How often do you diet?"
            placeholder="per year"
          />
          <TextAreaField
            name="motivation"
            label="What motivates you to lose weight?"
            rows={2}
          />
          <TextAreaField
            name="hardest_part"
            label="Hardest part about managing your weight"
            rows={2}
          />
          <TextAreaField
            name="challenges"
            label="Challenges we need to overcome together"
            rows={2}
            className="md:col-span-2"
          />
        </div>
      </Fieldset>

      <Fieldset legend="Past weight-loss programs">
        <YesNoNaGroup questions={PAST_WEIGHT_LOSS_PROGRAMS} />
      </Fieldset>

      <Fieldset legend="Adult weight history">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="lowest_weight" label="Lowest adult weight" />
          <TextField name="lowest_weight_when" label="When?" />
          <TextField name="heaviest_weight" label="Heaviest adult weight" />
          <TextField name="heaviest_weight_when" label="When?" />
        </div>
      </Fieldset>
    </div>
  );
}

// ---------- Step 2: Psychosocial ----------

function Step2() {
  return (
    <div className="space-y-12">
      <SectionHeading
        title="Psychosocial assessment"
        body="Your honest answers help us build a plan that actually fits your life."
      />

      <Fieldset legend="Eating behaviors">
        <YesNoNaGroup questions={PSYCHOSOCIAL_QUESTIONS} />
      </Fieldset>

      <Fieldset legend="In your own words">
        <div className="grid gap-5">
          <TextAreaField
            name="eating_pattern"
            label="Briefly describe your eating behaviors and pattern"
            rows={4}
          />
          <TextField
            name="commitment_rating"
            label="Your commitment to losing weight (1 low — 10 high)"
            type="number"
            min={1}
            max={10}
          />
        </div>
      </Fieldset>

      <Fieldset legend="Activity level">
        <div className="space-y-2">
          {ACTIVITY_LEVELS.map((level) => (
            <label
              key={level.value}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-surface px-4 py-3 text-sm transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand/5"
            >
              <input
                type="radio"
                name="activity_level"
                value={level.value}
                className="mt-0.5 h-4 w-4 text-brand focus:ring-brand"
              />
              <span className="text-foreground/90">{level.label}</span>
            </label>
          ))}
        </div>
      </Fieldset>
    </div>
  );
}

// ---------- Step 3: Social History ----------

function Step3() {
  return (
    <div className="space-y-12">
      <SectionHeading
        title="Social history"
        body="Substances, habits, and daily routines. Your answers stay between you and Dr. Aluri."
      />
      <Fieldset legend="Tobacco, alcohol, and more">
        <YesNoNaGroup questions={SOCIAL_QUESTIONS} />
      </Fieldset>

      <Fieldset legend="Details (if applicable)">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="smoking_packs" label="Smoking — packs per day" />
          <TextField name="smoking_duration" label="Smoking — how long?" />
          <TextField
            name="quit_smoking_date"
            label="Quit smoking — when?"
          />
          <TextField
            name="smokeless_duration"
            label="Smokeless tobacco — how long?"
          />
          <TextField
            name="alcohol_amount"
            label="Alcohol — how much and how often?"
            className="sm:col-span-2"
          />
          <TextField
            name="caffeine_amount"
            label="Caffeine — amount and frequency"
            className="sm:col-span-2"
          />
          <TextAreaField
            name="exercise_habits"
            label="Exercise habits"
            rows={3}
            className="sm:col-span-2"
          />
          <TextField
            name="recreational_drug_details"
            label="Recreational drugs — name and frequency (if any)"
            className="sm:col-span-2"
          />
        </div>
      </Fieldset>
    </div>
  );
}

// ---------- Step 4: Medication History ----------

function Step4() {
  return (
    <div className="space-y-12">
      <SectionHeading
        title="Medication history"
        body="Allergies, prior hospitalizations, and women/men-specific history."
      />

      <Fieldset legend="Allergies and prior surgery">
        <YesNoNaGroup questions={MEDICATION_QUESTIONS} />
      </Fieldset>

      <Fieldset legend="Medication allergy details">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="allergy_medication" label="Medication" />
          <TextField name="allergy_dosage" label="Dosage" />
          <TextField name="allergy_frequency" label="Frequency" />
          <TextField name="allergy_reaction" label="Reaction type" />
        </div>
      </Fieldset>

      <Fieldset legend="Surgery / hospitalization details">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="surgery_type" label="Surgery or illness" />
          <TextField name="surgery_date" label="Date" type="date" />
          <TextField name="surgery_physician" label="Physician" />
          <TextField name="surgery_hospital" label="Hospital" />
        </div>
      </Fieldset>

      <Fieldset legend="Females only">
        <YesNoNaGroup questions={FEMALE_QUESTIONS} />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField
            name="last_pap_date"
            label="Last Pap smear — date"
            type="date"
          />
          <TextField
            name="last_mammogram_date"
            label="Last mammogram — date"
            type="date"
          />
          <TextField name="last_period" label="Last menstrual period" />
          <TextField
            name="birth_control_method"
            label="Birth control method"
          />
        </div>
      </Fieldset>

      <Fieldset legend="Males only">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="last_physical_date"
            label="Last physical exam — date"
            type="date"
          />
          <TextField
            name="last_prostate_exam"
            label="Last prostate / rectal exam — date"
            type="date"
          />
        </div>
      </Fieldset>
    </div>
  );
}

// ---------- Step 5: Mental Health + review + family history ----------

function Step5() {
  return (
    <div className="space-y-12">
      <SectionHeading
        title="Mental health, review of systems & consent"
        body="Last step. Answer honestly — it helps us help you."
      />

      <Fieldset legend="Mental health">
        <YesNoNaGroup questions={MENTAL_HEALTH_QUESTIONS} />
      </Fieldset>

      <Fieldset legend="Review of systems">
        <p className="text-xs text-muted-foreground">
          Check any symptoms you have experienced recently.
        </p>
        <div className="space-y-6">
          {REVIEW_OF_SYSTEMS.map((group) => (
            <div key={group.title}>
              <h4 className="mb-2 text-sm font-semibold text-brand">
                {group.title}
              </h4>
              <CheckboxList
                name={`ros_${group.title.toLowerCase().replace(/[^a-z]+/g, "_")}`}
                items={group.items}
              />
            </div>
          ))}
        </div>
      </Fieldset>

      <Fieldset legend="Family or personal history">
        <p className="text-xs text-muted-foreground">
          Check anything that applies to you personally or to a close family
          member.
        </p>
        <CheckboxList name="family_history" items={FAMILY_HISTORY_ITEMS} />
      </Fieldset>

      <Fieldset legend="What matters most to you?">
        <div className="grid gap-3 sm:grid-cols-2">
          {IMPORTANT_ELEMENT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/60 bg-surface p-5 transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand/5"
            >
              <input
                type="radio"
                name="most_important"
                value={option.value}
                className="mt-0.5 h-4 w-4 text-brand focus:ring-brand"
              />
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {option.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {option.body}
                </div>
              </div>
            </label>
          ))}
        </div>
      </Fieldset>

      <Fieldset legend="Anything else?">
        <TextAreaField
          name="additional_notes"
          label="If there's anything else Dr. Aluri should know, share it here"
          rows={4}
        />
      </Fieldset>

      <Fieldset legend="Consent & signature">
        <div className="space-y-4 rounded-2xl border border-border/60 bg-surface p-5 text-sm leading-6 text-foreground/85">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="consent_medication"
              className="mt-1 h-4 w-4 text-brand focus:ring-brand"
            />
            <span>
              I understand that I may be prescribed medication for appetite
              suppression or weight loss, and I have been advised of the
              potential side effects. I will stop the medication and contact
              the office immediately if I experience an adverse reaction. If I
              become pregnant, I will stop the medication and notify the
              physician.
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="consent_records"
              className="mt-1 h-4 w-4 text-brand focus:ring-brand"
            />
            <span>
              I swear that the medical information I provided above is
              accurate. I give permission for any physician hired by Fort
              Wayne Direct Primary Care to review my medical records. I
              acknowledge that I have received a copy of the Notice of Privacy
              Practices.
            </span>
          </label>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField
            name="signature"
            label="Full name (digital signature)"
            required
          />
          <TextField
            name="signature_date"
            label="Date"
            type="date"
            required
          />
          <TextField
            name="relationship"
            label="Relationship to patient (if completing on behalf of someone else)"
            className="sm:col-span-2"
          />
        </div>
      </Fieldset>
    </div>
  );
}

// ---------- small helpers ----------

function SectionHeading({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
