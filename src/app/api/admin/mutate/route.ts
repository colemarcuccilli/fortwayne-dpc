import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth-server";
import {
  SERVICE_CONFIGURED,
  applyMutation,
  isWritableTable,
  type Mutation,
} from "@/lib/admin/supabase-server";

export const dynamic = "force-dynamic";

// POST /api/admin/mutate — apply one whitelisted write. Admin session required.
// Body: { table, op: "upsert" | "delete", row?, id? }
export async function POST(request: Request) {
  const who = await requireAdmin();
  if (!who) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  // No service key (bare preview): accept as a no-op so optimistic UI works.
  if (!SERVICE_CONFIGURED) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  let body: Mutation;
  try {
    body = (await request.json()) as Mutation;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  if (
    !body ||
    typeof body.table !== "string" ||
    !isWritableTable(body.table) ||
    (body.op !== "upsert" && body.op !== "delete")
  ) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    await applyMutation(body);
    return NextResponse.json({ ok: true, persisted: true });
  } catch (err) {
    console.error("[api/admin/mutate] failed:", err);
    return NextResponse.json({ error: "mutate_failed" }, { status: 500 });
  }
}
