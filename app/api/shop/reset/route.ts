import { sessionId } from "@/lib/bug-server";
import { resetSession } from "@/lib/shop/store";

export function POST(request: Request) {
  resetSession(sessionId(request));
  return Response.json({ ok: true });
}
