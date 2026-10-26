"use client";

import { useLessonBugs } from "@/components/bug-provider";

export function PlaygroundCard({
  lessonId,
  title,
  intro,
  children
}: {
  lessonId: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  const bug = useLessonBugs(lessonId);
  return (
    <section className="playground-card" aria-labelledby={`${lessonId}-heading`}>
      <div className="card-heading">
        <div>
          <p className="eyebrow">Playground</p>
          <h2 id={`${lessonId}-heading`}>{title}</h2>
        </div>
        <span className="status-pill">{bug.any ? "Bug mode" : "Normal mode"}</span>
      </div>
      {intro && <p className="muted">{intro}</p>}
      {children}
    </section>
  );
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="play-panel">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
