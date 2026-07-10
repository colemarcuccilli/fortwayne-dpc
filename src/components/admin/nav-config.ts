import {
  BarChart3,
  Calendar,
  CheckSquare,
  Clock,
  DollarSign,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  primary?: boolean; // shown on mobile bottom bar
  hidden?: boolean; // route still works, just unlinked from nav
}

// Full nav. `hidden: true` items are practice-management features being
// held back for the "phase 2" pitch — their routes still build and are
// reachable by direct URL, they're just not shown in the sidebar / bottom
// bar. Flip `hidden` off to bring one back.
export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, primary: true },
  { label: "Pipeline", href: "/admin/pipeline", icon: LayoutGrid, primary: true },
  { label: "Inbox", href: "/admin/inbox", icon: Inbox, primary: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, primary: true },

  // ---- Held back for phase 2 (hidden from nav, routes still live) ----
  { label: "Appointments", href: "/admin/appointments", icon: Calendar, hidden: true },
  { label: "Customers", href: "/admin/customers", icon: Users, hidden: true },
  { label: "Availability", href: "/admin/availability", icon: Clock, hidden: true },
  { label: "Transactions", href: "/admin/transactions", icon: DollarSign, hidden: true },
  { label: "Reports", href: "/admin/reports", icon: BarChart3, hidden: true },
  { label: "Tasks", href: "/admin/tasks", icon: CheckSquare, hidden: true },
  { label: "Messaging", href: "/admin/messaging", icon: MessageSquare, hidden: true },
];

/** Nav items actually shown in the sidebar + mobile bar. */
export const ADMIN_NAV_VISIBLE = ADMIN_NAV.filter((n) => !n.hidden);
