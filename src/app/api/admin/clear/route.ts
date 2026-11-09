import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth-server";
import { SERVICE_CONFIGURED, clearAllData } from "@/lib/admin/supabase-server";

export const dynamic = "force-dynamic";

// POST /api/admin/clear — permanently wipe every CRM record. Admin only.
export async function POST() {
  const who = await requireAdmin();
  if (!who) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!SERVICE_CONFIGURED) {
    return NextResponse.json({ ok: true, persisted: false });
  }
  try {
    await clearAllData();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/clear] failed:", err);
    return NextResponse.json({ error: "clear_failed" }, { status: 500 });
  }
}
