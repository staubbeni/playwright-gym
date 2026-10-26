import { cookies } from "next/headers";
import { anyActive, parseFlags, FLAGS_HEADER } from "@/lib/bug";
import { serverFlags } from "@/lib/bug-server";
import { defects, type Defect } from "./defects";
import { shared } from "./store";

export const SESSION_COOKIE = "gym-session";

export function defectActive(defect: Defect, request?: Request): boolean {
  const flags = request ? parseFlags(request.headers.get(FLAGS_HEADER)) : serverFlags();
  return anyActive(flags, defects[defect]);
}

// The signed-in username for server components, or null.
export function currentUser(): string | null {
  const user = cookies().get(SESSION_COOKIE)?.value;
  if (user) return user;
  if (defectActive("loginLeaksGlobally") && shared.lastLogin) return shared.lastLogin;
  return null;
}
