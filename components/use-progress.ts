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

// Learner-ticked practice progress, kept per browser. Keys are bug-flag ids
// such as "03-selectors:2".
export function useProgress() {
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    setProgress(read());
    const sync = () => setProgress(read());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const toggle = useCallback((key: string) => {
    const next = { ...read(), [key]: !read()[key] };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Progress is a convenience; ignore unavailable storage.
    }
    setProgress(next);
  }, []);

  return { progress, toggle };
}
