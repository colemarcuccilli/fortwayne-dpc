import { blogCounts } from "@/lib/blog";

// Read at request time on purpose: this proves the blog files shipped inside
// the deployed function and that the Fort Wayne date comparison runs live.
// Counts only. No post text or titles leave this route.
export const dynamic = "force-dynamic";

export async function GET() {
  const counts = await blogCounts();
  return Response.json(counts, {
    headers: { "Cache-Control": "no-store" },
  });
}
