import { NextResponse } from "next/server";
import { SEED } from "@/lib/admin/seed";
import { requireAdmin } from "@/lib/admin/auth-server";
import { SERVICE_CONFIGURED, loadAdminState } from "@/lib/admin/supabase-server";

export const dynamic = "force-dynamic";

// GET /api/admin/state — full admin CRM state. Admin session required.
export async function GET() {
  const who = await requireAdmin();
  if (!who) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  // Bare preview without a service key: serve the seed so the demo works.
  if (!SERVICE_CONFIGURED) {
    return NextResponse.json(SEED);
  }
  try {
    const state = await loadAdminState();
    return NextResponse.json(state);
  } catch (err) {
    console.error("[api/admin/state] load failed:", err);
    return NextResponse.json({ error: "load_failed" }, { status: 500 });
  }
}
