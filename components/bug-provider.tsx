"use client";

import { createContext, useContext } from "react";
import { anyActive, flagActive } from "@/lib/bug";

const BugContext = createContext<string[]>([]);

export function BugProvider({ flags, children }: { flags: string[]; children: React.ReactNode }) {
  return <BugContext.Provider value={flags}>{children}</BugContext.Provider>;
}

export function useBug(flags: readonly string[]): boolean {
  return anyActive(useContext(BugContext), flags);
}

// Returns a checker for one lesson: bug(2) is true when "<lessonId>:2" is active.
export function useLessonBugs(lessonId: string) {
  const active = useContext(BugContext);
  const bug = (practice: number | string) => flagActive(active, `${lessonId}:${practice}`);
  bug.any = active.some((flag) => flag === "*" || flag.startsWith(`${lessonId}:`));
  return bug;
}
