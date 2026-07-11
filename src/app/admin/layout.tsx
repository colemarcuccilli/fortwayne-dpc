import type { Metadata } from "next";
import { AdminProvider } from "@/lib/admin/store";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminMobileNav } from "@/components/admin/mobile-nav";
import { AdminTopBar } from "@/components/admin/top-bar";
import { DemoNotice } from "@/components/admin/demo-notice";

export const metadata: Metadata = {
  title: {
    default: "Admin — Fort Wayne DPC",
    template: "%s — FWDPC Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" data-admin="1">
      <AdminProvider>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="flex min-h-screen min-w-0 flex-1 flex-col pb-14 lg:pb-0">
            <AdminTopBar />
            <DemoNotice />
            <main className="w-full min-w-0 flex-1 px-4 pb-10 pt-4 lg:px-6 lg:pt-6">
              {children}
            </main>
          </div>
        </div>
        <AdminMobileNav />
      </AdminProvider>
    </div>
  );
}
