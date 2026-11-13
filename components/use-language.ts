"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "gym-language";
export type Language = "ts" | "python";

function read(): Language {
  try {
    return window.localStorage.getItem(KEY) === "python" ? "python" : "ts";
  } catch {
    return "ts";
  }
}

// The learner's track (TypeScript or Python), kept per browser like progress.
export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("ts");

  useEffect(() => {
    setLanguageState(read());
    const sync = () => setLanguageState(read());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const setLanguage = useCallback((next: Language) => {
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // A convenience; ignore unavailable storage.
    }
    setLanguageState(next);
  }, []);

  return [language, setLanguage] as const;
}
