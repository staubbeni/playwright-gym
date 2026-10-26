import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BugProvider } from "@/components/bug-provider";
import { playgrounds } from "@/components/playgrounds/registry";
import { serverFlags } from "@/lib/bug-server";
import { getLesson, lessonNumber } from "@/lib/lessons";

export const dynamic = "force-dynamic";
// Lesson 01 asserts a title set by its playground, so keep this one neutral.
export const metadata: Metadata = { title: "Playground · Playwright Gym" };

// The page your tests visit: only the playground, without the lesson guide.
export default function PlayPage({ params }: { params: { lessonId: string } }) {
  const lesson = getLesson(params.lessonId);
  const Playground = playgrounds[params.lessonId];
  if (!lesson || !Playground) notFound();
  return (
    <BugProvider flags={serverFlags()}>
      <div className="play-shell">
        <header className="play-bar">
          <span className="lesson-number">{lessonNumber(lesson)}</span>
          <span>{lesson.title}</span>
          <Link href={`/lessons/${lesson.id}`}>Lesson guide →</Link>
        </header>
        <main className="play-main">
          <Playground />
        </main>
      </div>
    </BugProvider>
  );
}
