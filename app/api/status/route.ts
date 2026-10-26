import { isBug, sessionId } from "@/lib/bug-server";
import { getSession } from "@/lib/shop/store";

// Reports "Degraded" for the first two checks of each session, then "Healthy".
export function GET(request: Request) {
  const session = getSession(sessionId(request));
  session.statusChecks += 1;
  const healthy = session.statusChecks > 2 && !isBug(request, ["27-config-ci:2"]);
  return Response.json({ status: healthy ? "Healthy" : "Degraded" });
}
