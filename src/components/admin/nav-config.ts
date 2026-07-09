import {
  BarChart3,
  Calendar,
  CheckSquare,
  Clock,
  DollarSign,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Settings,
  LayoutGrid,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  primary?: boolean; // shown on mobile bottom bar
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, primary: true },
  { label: "Pipeline", href: "/admin/pipeline", icon: LayoutGrid, primary: true },
  { label: "Inbox", href: "/admin/inbox", icon: Inbox, primary: true },
  { label: "Appointments", href: "/admin/appointments", icon: Calendar, primary: true },
  { label: "Customers", href: "/admin/customers", icon: Users, primary: true },
  { label: "Availability", href: "/admin/availability", icon: Clock },
  { label: "Transactions", href: "/admin/transactions", icon: DollarSign },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Tasks", href: "/admin/tasks", icon: CheckSquare },
  { label: "Messaging", href: "/admin/messaging", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
