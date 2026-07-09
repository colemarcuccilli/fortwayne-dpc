// Shared type definitions for the admin backend.
// All entities have UUID-ish ids and ISO-8601 timestamps so a future
// swap to Supabase / Postgres is a straight column mapping.

export type ISODate = string;

// -------------------- PIPELINE / CRM --------------------

export const PIPELINE_STAGES = [
  "researched",
  "to_contact",
  "contacted",
  "meeting_booked",
  "proposal_sent",
  "won",
  "lost",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const PIPELINE_STAGE_LABEL: Record<PipelineStage, string> = {
  researched: "Researched",
  to_contact: "To Contact",
  contacted: "Contacted",
  meeting_booked: "Meeting Booked",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

export interface ProspectContact {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

export interface ProspectActivity {
  id: string;
  type: "note" | "call" | "email" | "meeting" | "stage_change";
  body: string;
  actor?: string;
  createdAt: ISODate;
}

export interface Prospect {
  id: string;
  company: string;
  website?: string;
  industry?: string;
  employeeCount?: number;
  location?: string;
  stage: PipelineStage;
  fitScore?: number; // 1–10
  fitReason?: string;
  contacts: ProspectContact[];
  activities: ProspectActivity[];
  ownerLabel?: string; // "researcher" | "cole" | etc.
  tags: string[];
  estValueUsd?: number;
  nextFollowUp?: ISODate;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// -------------------- FORM SUBMISSIONS --------------------

export type SubmissionType = "contact" | "patient" | "employer";

export interface Submission {
  id: string;
  type: SubmissionType;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  meta?: Record<string, string | number | boolean>;
  read: boolean;
  archived: boolean;
  createdAt: ISODate;
}

// -------------------- APPOINTMENTS --------------------

export const APPT_TYPES = [
  "new_patient",
  "follow_up",
  "annual_wellness",
  "weight_loss",
  "aesthetics",
  "business_meeting",
  "employer_pilot",
] as const;
export type AppointmentType = (typeof APPT_TYPES)[number];

export const APPT_TYPE_LABEL: Record<AppointmentType, string> = {
  new_patient: "New Patient",
  follow_up: "Follow-up",
  annual_wellness: "Annual Wellness",
  weight_loss: "Weight Loss",
  aesthetics: "Aesthetics",
  business_meeting: "Business Meeting",
  employer_pilot: "Employer Pilot",
};

export const APPT_STATUS = ["scheduled", "checked_in", "completed", "no_show", "cancelled"] as const;
export type AppointmentStatus = (typeof APPT_STATUS)[number];

export interface Appointment {
  id: string;
  customerId?: string; // null for business meetings without a linked customer
  customerName: string;
  type: AppointmentType;
  status: AppointmentStatus;
  startsAt: ISODate;
  endsAt: ISODate;
  location: "in_office" | "virtual";
  notes?: string;
  requiresIntake: boolean;
  createdAt: ISODate;
}

// -------------------- CUSTOMERS --------------------

export interface CustomerNote {
  id: string;
  body: string;
  authorLabel?: string;
  createdAt: ISODate;
}

export const MEMBERSHIP_TIERS = ["standard", "family", "platinum", "college", "employer", "none"] as const;
export type MembershipTier = (typeof MEMBERSHIP_TIERS)[number];

export const MEMBERSHIP_TIER_LABEL: Record<MembershipTier, string> = {
  standard: "Standard",
  family: "Family",
  platinum: "Platinum",
  college: "College",
  employer: "Employer-Sponsored",
  none: "Not a Member",
};

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: ISODate;
  address?: string;
  membership: MembershipTier;
  membershipStart?: ISODate;
  employerId?: string;
  notes: CustomerNote[];
  createdAt: ISODate;
}

// -------------------- TRANSACTIONS / POS --------------------

export const TXN_KINDS = [
  "membership",
  "aesthetics",
  "occupational",
  "employer_contract",
  "consultation",
  "refund",
] as const;
export type TransactionKind = (typeof TXN_KINDS)[number];

export const TXN_KIND_LABEL: Record<TransactionKind, string> = {
  membership: "Membership",
  aesthetics: "Aesthetics",
  occupational: "Occupational",
  employer_contract: "Employer Contract",
  consultation: "Consultation",
  refund: "Refund",
};

export interface Transaction {
  id: string;
  customerId?: string;
  customerName?: string;
  kind: TransactionKind;
  amount: number; // cents
  currency: "USD";
  description?: string;
  posRef?: string; // reference to POS/Stripe payment id
  occurredAt: ISODate;
}

// -------------------- TASKS --------------------

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
  id: string;
  title: string;
  detail?: string;
  priority: TaskPriority;
  done: boolean;
  linkedProspectId?: string;
  linkedCustomerId?: string;
  dueAt?: ISODate;
  createdAt: ISODate;
}

// -------------------- AVAILABILITY --------------------

export interface DayAvailability {
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sun
  enabled: boolean;
  open: string; // "HH:MM"
  close: string;
}

export interface DateBlock {
  id: string;
  date: ISODate; // "YYYY-MM-DD"
  reason: string;
}

export interface Availability {
  weekly: DayAvailability[];
  blocks: DateBlock[];
  bufferMinutes: number;
  virtualEnabled: boolean;
}

// -------------------- SETTINGS --------------------

export interface Settings {
  practiceName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  brandColor: string;
}

// -------------------- MESSAGES --------------------

export interface OutboundMessage {
  id: string;
  channel: "email" | "sms";
  to: string;
  toName?: string;
  subject?: string;
  body: string;
  status: "draft" | "sent" | "failed";
  createdAt: ISODate;
  sentAt?: ISODate;
}

// -------------------- ROOT ADMIN STATE --------------------

export interface AdminState {
  prospects: Prospect[];
  submissions: Submission[];
  appointments: Appointment[];
  customers: Customer[];
  transactions: Transaction[];
  tasks: Task[];
  availability: Availability;
  settings: Settings;
  messages: OutboundMessage[];
}
