// Initial / fallback admin state.
//
// There is NO fake demo data here. All CRM lists start empty so the
// panel only ever shows real work — prospects the team actually
// researches, real form submissions, etc.
//
// The only pre-filled values are the practice's real availability
// (office hours) and settings (name, contact info, brand color), which
// are legitimate defaults and also live as singleton rows in Supabase.

import type { Availability, Settings, AdminState } from "./types";

const availability: Availability = {
  weekly: [
    { weekday: 0, enabled: false, open: "10:00", close: "16:00" },
    { weekday: 1, enabled: true, open: "10:00", close: "17:00" },
    { weekday: 2, enabled: true, open: "09:00", close: "17:00" },
    { weekday: 3, enabled: true, open: "10:00", close: "17:00" },
    { weekday: 4, enabled: true, open: "09:00", close: "17:00" },
    { weekday: 5, enabled: true, open: "10:00", close: "17:00" },
    { weekday: 6, enabled: false, open: "10:00", close: "14:00" },
  ],
  blocks: [],
  bufferMinutes: 15,
  virtualEnabled: true,
};

const settings: Settings = {
  practiceName: "Fort Wayne Direct Primary Care",
  contactEmail: "info@fortwaynedpc.com",
  contactPhone: "260-547-7543",
  address: "4630 W Jefferson Blvd, Suite 8, Fort Wayne, IN 46804",
  emailNotifications: true,
  smsNotifications: false,
  brandColor: "#2b6cb0",
};

/** Empty starting state — no fake records anywhere. */
export const SEED: AdminState = {
  prospects: [],
  submissions: [],
  appointments: [],
  customers: [],
  transactions: [],
  tasks: [],
  availability,
  settings,
  messages: [],
};
