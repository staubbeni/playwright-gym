import { isBug } from "@/lib/bug-server";
import { shared } from "@/lib/shop/store";

// Only used in bug mode for lesson 26: the note "leaks" through the server.
export function GET() {
  return Response.json({ note: shared.contextNote ?? null });
}

export async function POST(request: Request) {
  const { note = "" } = (await request.json().catch(() => ({}))) as { note?: string };
  if (isBug(request, ["26-contexts:2"])) shared.contextNote = note;
  return Response.json({ ok: true });
}
