"use client";

import Link from "next/link";
import { useProgress } from "./use-progress";

type Item = { id: string; number: string; practices: number };

// "Start" for a new learner, "Continue" at the first lesson with an unticked practice.
export function StartButton({ items }: { items: Item[] }) {
  const { progress } = useProgress();
  const started = Object.values(progress).some(Boolean);
  const next = items.find((item) => Array.from({ length: item.practices }, (_, i) => !progress[`${item.id}:${i + 1}`]).some(Boolean));
  const target = started && next ? next : items[0];
  return (
    <Link className="primary-button" href={`/lessons/${target.id}`}>
      {started && next ? `Continue with lesson ${target.number}` : `Start with lesson ${target.number}`}
    </Link>
  );
}
