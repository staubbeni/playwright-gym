import { headers } from "next/headers";
import { FLAGS_HEADER, SID_HEADER, anyActive, parseFlags } from "./bug";

export function serverFlags(): string[] {
  return parseFlags(headers().get(FLAGS_HEADER));
}

export function isBug(request: Request, flags: readonly string[]): boolean {
  return anyActive(parseFlags(request.headers.get(FLAGS_HEADER)), flags);
}

export function sessionId(request: Request): string {
  return request.headers.get(SID_HEADER) ?? "anonymous";
}
