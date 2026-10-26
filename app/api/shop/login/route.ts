import { users } from "@/lib/shop/catalog";
import { SESSION_COOKIE, defectActive } from "@/lib/shop/server";
import { shared } from "@/lib/shop/store";

export async function POST(request: Request) {
  const { username = "", password = "" } = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };
  const valid =
    (username in users && users[username] === password) ||
    (defectActive("loginAcceptsWrongPassword", request) && username in users);
  if (!valid) {
    return Response.json({ error: "Invalid username or password." }, { status: 401 });
  }
  shared.lastLogin = username;
  const headers = new Headers();
  if (!defectActive("loginStoresNoSession", request) && !defectActive("apiLoginNoCookie", request)) {
    const path = defectActive("sessionCookieWrongPath", request) ? "/shop/login" : "/";
    headers.set("Set-Cookie", `${SESSION_COOKIE}=${encodeURIComponent(username)}; Path=${path}; HttpOnly; SameSite=Lax`);
  }
  return Response.json({ username }, { headers });
}
