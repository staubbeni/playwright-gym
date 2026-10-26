import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PlaygroundShell } from "@/components/playground-shell";
import { lessons } from "@/lib/lessons";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

export default function LessonPage({
  params
}: {
  params: { lessonId: string };
}) {
  if (!lessons.some((lesson) => lesson.id === params.lessonId)) notFound();
  return (
    <Suspense fallback={<main className="loading-shell">Loading playground...</main>}>
      <PlaygroundShell lessonId={params.lessonId} />
    </Suspense>
  );
}
