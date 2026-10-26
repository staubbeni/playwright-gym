import { SESSION_COOKIE, defectActive } from "@/lib/shop/server";
import { shared } from "@/lib/shop/store";

export function POST(request: Request) {
  const headers = new Headers();
  if (!defectActive("logoutKeepsSession", request)) {
    shared.lastLogin = undefined;
    headers.set("Set-Cookie", `${SESSION_COOKIE}=; Path=/; Max-Age=0`);
  }
  return Response.json({ ok: true }, { headers });
}
