import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/marketing/section";
import { PatientForm } from "@/components/patient-form/patient-form";

export const metadata: Metadata = {
  title: "New Patient Form",
  description:
    "Patient intake form for Fort Wayne Direct Primary Care. Five short steps — fill it out before your first visit so Dr. Aluri has what he needs.",
};

export default function PatientFormPage() {
  return (
    <>
      <PageHeader
        eyebrow="New patient intake"
        title={
          <>
            New patient <span className="text-brand-accent">form.</span>
          </>
        }
        subtitle="Fill this out before your first visit. Five short steps — about 10 minutes. Your answers go directly to Dr. Aluri's office."
      />

      <Section className="py-16 md:py-20">
        <PatientForm />
      </Section>
    </>
  );
}
