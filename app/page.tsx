import Link from "next/link";
import { StartButton } from "@/components/start-button";
import { lessonNumber, lessons, modules } from "@/lib/lessons";

export default function HomePage() {
  return (
    <main className="home">
      <header className="home-hero">
        <span className="brand-mark">PG</span>
        <h1>Playwright Gym</h1>
        <p className="subtitle">
          A zero-to-hero Playwright course. Twenty-nine lessons, each with three practices you solve in your editor.
          A checker proves that every test you write catches a real, planted bug.
        </p>
        <div className="button-row">
          <StartButton items={lessons.map((lesson) => ({ id: lesson.id, number: lessonNumber(lesson), practices: lesson.practices.length }))} />
          <Link className="secondary-button" href="/shop">Open the Gym Shop</Link>
        </div>
      </header>
      <ol className="module-grid">
        {modules.map((module, index) => (
          <li className="module-card" key={module.id}>
            <p className="eyebrow">Module {index + 1}</p>
            <h2>{module.title}</h2>
            <p className="muted">{module.summary}</p>
            <ul>
              {lessons
                .filter((lesson) => lesson.module === module.id)
                .map((lesson) => (
                  <li key={lesson.id}>
                    <Link href={`/lessons/${lesson.id}`}>
                      <span className="lesson-number">{lessonNumber(lesson)}</span> {lesson.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ol>
    </main>
  );
}
