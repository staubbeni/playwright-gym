"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "gym-progress";
type Progress = Record<string, boolean>;

function read(): Progress {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Progress;
  } catch {
    return {};
  }
}

// Practice progress. Keys are bug-flag ids such as "03-selectors:2".
// `manual` is what the learner ticked (kept per browser); `verified` is what
// `npm run check` last saw passing, served by /api/progress. `progress` is both.
export function useProgress() {
  const [manual, setManual] = useState<Progress>({});
  const [verified, setVerified] = useState<Progress>({});

  useEffect(() => {
    setManual(read());
    const sync = () => setManual(read());
    window.addEventListener("storage", sync);

    // The checker runs in a terminal, so poll for its results while the tab is visible.
    const load = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/progress")
        .then((response) => response.json() as Promise<Record<string, unknown>>)
        .then((data) => setVerified(Object.fromEntries(Object.keys(data).map((key) => [key, true]))))
        .catch(() => undefined);
    };
    load();
    const timer = window.setInterval(load, 3000);
    return () => {
      window.removeEventListener("storage", sync);
      window.clearInterval(timer);
    };
  }, []);

  const toggle = useCallback((key: string) => {
    const next = { ...read(), [key]: !read()[key] };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Progress is a convenience; ignore unavailable storage.
    }
    setManual(next);
  }, []);

  const progress: Progress = { ...manual, ...verified };
  return { progress, verified, toggle };
}
