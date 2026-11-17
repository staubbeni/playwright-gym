import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const dynamic = "force-dynamic";

// Practices the checker has verified (written by scripts/check.ts), keyed like
// "03-selectors:2". An absent or unreadable file just means nothing is verified.
export async function GET() {
  try {
    const file = resolve(process.cwd(), process.env.GYM_PROGRESS_FILE ?? ".gym-progress.json");
    return Response.json(JSON.parse(await readFile(file, "utf8")));
  } catch {
    return Response.json({});
  }
}
