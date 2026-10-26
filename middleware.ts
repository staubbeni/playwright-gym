import { NextResponse, type NextRequest } from "next/server";
import {
  BUG_COOKIE,
  BUG_HEADER,
  FLAGS_HEADER,
  SID_COOKIE,
  SID_HEADER,
  parseFlags
} from "@/lib/bug";

// Resolves the active bug flags from the test header (set by playwright.config
// from GYM_BUG) and from ?bug=<flags>, which is persisted in a cookie so manual
// browsing keeps bug mode across navigations. ?bug=false clears it.
export function middleware(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("bug");
  const lessonMatch = request.nextUrl.pathname.match(/^\/(?:lessons|play)\/([^/]+)/);
  let cookieUpdate: string | undefined;
  if (query !== null) {
    if (query === "true") cookieUpdate = lessonMatch ? `${lessonMatch[1]}:*` : "*";
    else if (query === "false" || query === "") cookieUpdate = "";
    else cookieUpdate = query;
  }
  const persisted = cookieUpdate ?? request.cookies.get(BUG_COOKIE)?.value ?? "";
  const flags = [...parseFlags(request.headers.get(BUG_HEADER)), ...parseFlags(persisted)];

  const existingSid = request.cookies.get(SID_COOKIE)?.value;
  const sid = existingSid ?? crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(FLAGS_HEADER, flags.join(","));
  requestHeaders.set(SID_HEADER, sid);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (!existingSid) {
    response.cookies.set(SID_COOKIE, sid, { path: "/", sameSite: "lax", httpOnly: true });
  }
  if (cookieUpdate !== undefined) {
    if (cookieUpdate) response.cookies.set(BUG_COOKIE, cookieUpdate, { path: "/" });
    else response.cookies.delete(BUG_COOKIE);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
