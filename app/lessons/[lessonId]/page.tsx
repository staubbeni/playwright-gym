import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BugProvider } from "@/components/bug-provider";
import { PlaygroundShell } from "@/components/playground-shell";
import { serverFlags } from "@/lib/bug-server";
import { getLesson } from "@/lib/lessons";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { lessonId: string } }): Metadata {
  const lesson = getLesson(params.lessonId);
  return { title: lesson ? `${lesson.title} · Playwright Gym` : "Playwright Gym" };
}

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  if (!getLesson(params.lessonId)) notFound();
  return (
    <BugProvider flags={serverFlags()}>
      <PlaygroundShell lessonId={params.lessonId} />
    </BugProvider>
  );
}
