import { NextResponse } from "next/server";
import { requireResearchOrAdmin } from "@/lib/admin/auth-server";
import { SEED } from "@/lib/admin/seed";
import {
  SERVICE_CONFIGURED,
  insertProspect,
  loadProspects,
} from "@/lib/admin/supabase-server";

export const dynamic = "force-dynamic";

// GET /api/research/prospects — prospects only. Admin OR research session.
export async function GET() {
  const who = await requireResearchOrAdmin();
  if (!who) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!SERVICE_CONFIGURED) {
    return NextResponse.json({ prospects: SEED.prospects });
  }
  try {
    const prospects = await loadProspects(50);
    return NextResponse.json({ prospects });
  } catch (err) {
    console.error("[api/research/prospects] load failed:", err);
    return NextResponse.json({ error: "load_failed" }, { status: 500 });
  }
}

// POST /api/research/prospects — insert one prospect. Admin OR research.
export async function POST(request: Request) {
  const who = await requireResearchOrAdmin();
  if (!who) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!SERVICE_CONFIGURED) {
    return NextResponse.json({ ok: true, persisted: false });
  }
  let body: { prospect?: unknown };
  try {
    body = (await request.json()) as { prospect?: unknown };
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  if (!body?.prospect) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  try {
    await insertProspect(body.prospect);
    return NextResponse.json({ ok: true, persisted: true });
  } catch (err) {
    console.error("[api/research/prospects] insert failed:", err);
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }
}
