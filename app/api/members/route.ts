import { isBug } from "@/lib/bug-server";
import { shared } from "@/lib/shop/store";

// A deliberately global list shared by every session, like a real team database.
export function GET(request: Request) {
  if (isBug(request, ["27-config-ci:3.3"])) return Response.json({ members: [] });
  return Response.json({ members: shared.members.slice(-50) });
}

export async function POST(request: Request) {
  const { name = "" } = (await request.json().catch(() => ({}))) as { name?: string };
  if (!name.trim()) return Response.json({ error: "Name is required." }, { status: 400 });
  shared.members.push(name.trim());
  if (isBug(request, ["27-config-ci:3.1"])) shared.members.push(name.trim());
  return Response.json({ members: shared.members.slice(-50) }, { status: 201 });
}
