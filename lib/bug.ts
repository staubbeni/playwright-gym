// Bug flags look like "<lessonId>:<practice>" (e.g. "03-selectors:2") or, for a
// practice with several planted defects, "<lessonId>:<practice>.<k>".
// "<lessonId>:*" enables every flag of a lesson and "*" enables everything.
export const BUG_HEADER = "x-gym-bug";
export const FLAGS_HEADER = "x-gym-bug-flags";
export const BUG_COOKIE = "gym-bug";
export const SID_COOKIE = "gym-sid";
export const SID_HEADER = "x-gym-sid";

export function parseFlags(value: string | null | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((flag) => flag.trim())
    .filter(Boolean);
}

export function flagActive(active: readonly string[], flag: string): boolean {
  return active.some(
    (entry) =>
      entry === "*" ||
      entry === flag ||
      flag.startsWith(`${entry}.`) || // "03:2" also switches on its sub-bugs "03:2.1", "03:2.2"
      (entry.endsWith(":*") && flag.startsWith(entry.slice(0, -1)))
  );
}

export function anyActive(active: readonly string[], flags: readonly string[]): boolean {
  return flags.some((flag) => flagActive(active, flag));
}
