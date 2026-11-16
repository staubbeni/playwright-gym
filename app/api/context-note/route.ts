import { isBug } from "@/lib/bug-server";
import { shared } from "@/lib/shop/store";

// Only used in bug mode for lesson 26: state "leaks" through the server.
export function GET() {
  return Response.json({ note: shared.contextNote ?? null, user: shared.contextUser ?? null });
}

export async function POST(request: Request) {
  const { note, user } = (await request.json().catch(() => ({}))) as { note?: string; user?: string };
  if (note !== undefined && isBug(request, ["26-contexts:2"])) shared.contextNote = note;
  if (user !== undefined && isBug(request, ["26-contexts:3.2"])) shared.contextUser = user;
  return Response.json({ ok: true });
}
