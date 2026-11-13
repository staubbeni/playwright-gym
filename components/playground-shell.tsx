"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { playgrounds } from "@/components/playgrounds/registry";
import { ShopLauncher } from "@/components/playgrounds/shop-launcher";
import { RichText } from "@/components/rich-text";
import { type Language, useLanguage } from "@/components/use-language";
import { useProgress } from "@/components/use-progress";
import { getLesson, lessonNumber, lessons, modules, nextLesson, practiceFlag, pythonFile, pythonLesson } from "@/lib/lessons";
import type { Practice } from "@/lib/lessons/types";

// Help in three clicks, so a learner sees the smallest nudge first.
function StuckLadder({ lessonId, practice, language }: { lessonId: string; practice: Practice; language: Language }) {
  const [step, setStep] = useState(0);
  const steps = [
    <p key="hint"><RichInline text={practice.hint ?? "Reread the goal and name the one thing to click and the one thing to assert."} /></p>,
    practice.partial && <RichText key="partial" text={practice.partial} />,
    <p key="example">Full solution: <code>tests/examples/{language === "python" ? pythonFile(lessonId) : `${lessonId}.spec.ts`}</code></p>
  ].filter(Boolean);
  return (
    <div className="stuck">
      {steps.slice(0, step)}
      {step < steps.length && (
        <button type="button" className="stuck-button" onClick={() => setStep(step + 1)}>
          {step === 0 ? "Stuck?" : "Still stuck?"}
        </button>
      )}
    </div>
  );
}

export function PlaygroundShell({ lessonId }: { lessonId: string }) {
  const baseLesson = getLesson(lessonId) ?? lessons[0];
  const [language, setLanguage] = useLanguage();
  const lesson = language === "python" ? pythonLesson(baseLesson) : baseLesson;
  const bug = useLessonBugs(lesson.id);
  const next = nextLesson(baseLesson);
  const Playground = playgrounds[lesson.id];
  const { progress, toggle } = useProgress();
  const [showInstructions, setShowInstructions] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(460);
  const resizing = useRef(false);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!resizing.current) return;
      const maxWidth = Math.min(760, window.innerWidth * 0.6);
      setDrawerWidth(Math.min(maxWidth, Math.max(340, window.innerWidth - event.clientX)));
    };
    const stopResize = () => {
      resizing.current = false;
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
    };
  }, []);

  const doneCount = (id: string) => {
    const item = getLesson(id);
    return item ? item.practices.filter((_, index) => progress[practiceFlag(item, index)]).length : 0;
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">PG</span>
          <div>
            <strong>Playwright Gym</strong>
            <span>Zero to hero, by testing</span>
          </div>
        </Link>
        <nav aria-label="Lessons">
          <p className="nav-label">Lessons</p>
          {modules.map((module) => (
            <div className="lesson-module" key={module.id}>
              <p className="module-label">{module.title}</p>
              {lessons
                .filter((item) => item.module === module.id)
                .map((item) => {
                  const done = doneCount(item.id);
                  return (
                    <Link className={`lesson-link ${item.id === lesson.id ? "selected" : ""}`} href={`/lessons/${item.id}`} key={item.id}>
                      <span className="lesson-number">{lessonNumber(item)}</span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.shortDescription}</small>
                      </span>
                      {done > 0 && (
                        <span className="lesson-progress" aria-label={`${done} of ${item.practices.length} practices done`}>
                          {done === item.practices.length ? "✓" : `${done}/${item.practices.length}`}
                        </span>
                      )}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>
      </aside>

      <section className="content" style={showInstructions ? { paddingRight: `calc(${drawerWidth}px + 3rem)` } : undefined}>
        <header className="page-header">
          <div>
            <p className="eyebrow">Lesson {lessonNumber(lesson)}</p>
            <h1>{lesson.title}</h1>
            <p className="subtitle">{lesson.description}</p>
          </div>
          <div className="header-actions">
            <Link className="bug-toggle" href={`/lessons/${lesson.id}?bug=${bug.any ? "false" : "true"}`}>
              {bug.any ? "Open normal app" : "Open bug mode"}
            </Link>
            <button
              className="instructions-toggle"
              onClick={() => setShowInstructions((visible) => !visible)}
              type="button"
              aria-expanded={showInstructions}
              aria-controls="lesson-instructions"
            >
              {showInstructions ? "Hide instructions" : "Show instructions"}
            </button>
          </div>
        </header>

        <section className="mission-banner" aria-labelledby="mission-heading">
          <p className="eyebrow" id="mission-heading">Your mission</p>
          <p>{lesson.mission}</p>
          <p className="target-line">
            Tests start at <Link href={lesson.target}><code>{lesson.target}</code></Link>
          </p>
        </section>

        <div className="workspace">
          <div className="playground-column">{Playground ? <Playground /> : <ShopLauncher lesson={lesson} />}</div>
          <aside
            className={`instructions-drawer ${showInstructions ? "open" : ""}`}
            id="lesson-instructions"
            aria-hidden={!showInstructions}
            style={{ width: `${drawerWidth}px` }}
          >
            <button className="drawer-resize-handle" onPointerDown={() => { resizing.current = true; }} type="button" aria-label="Resize lesson instructions" />
            <div className="drawer-header">
              <p className="eyebrow">Lesson guide</p>
              <div className="language-switch" role="group" aria-label="Test language">
                {(["ts", "python"] as const).map((option) => (
                  <button key={option} type="button" aria-pressed={language === option} onClick={() => setLanguage(option)}>
                    {option === "ts" ? "TypeScript" : "Python"}
                  </button>
                ))}
              </div>
            </div>
            <article className="instructions">
              <div className="instruction-section">
                <p className="eyebrow">What you&apos;ll learn</p>
                <ul className="goal-list">{lesson.learningGoals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
              </div>
              <div className="instruction-section">
                <p className="eyebrow">Key concepts</p>
                <ul className="concept-chips">{lesson.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul>
              </div>
              <div className="instruction-section">
                <p className="eyebrow">Theory</p>
                <RichText text={lesson.theory} />
                <div className="example-grid">
                  <div>
                    <span className="example-label good">Prefer</span>
                    <pre><code>{lesson.goodExample}</code></pre>
                  </div>
                  <div>
                    <span className="example-label avoid">Avoid</span>
                    <pre><code>{lesson.badExample}</code></pre>
                  </div>
                </div>
              </div>
              <div className="instruction-section">
                <p className="eyebrow">Common mistakes</p>
                <ul className="mistake-list">{lesson.commonMistakes.map((item) => <li key={item}><RichInline text={item} /></li>)}</ul>
              </div>
              <div className="instruction-section">
                <p className="eyebrow">Practice set</p>
                <ol className="practice-list">
                  {lesson.practices.map((practice, index) => {
                    const key = practiceFlag(lesson, index);
                    return (
                      <li className={`practice-card ${progress[key] ? "done" : ""}`} key={practice.title}>
                        <div className="practice-head">
                          <strong>{index + 1}. {practice.title}</strong>
                          <span className={`difficulty ${practice.difficulty}`}>{practice.difficulty}</span>
                        </div>
                        <p><RichInline text={practice.goal} /></p>
                        <StuckLadder key={language} lessonId={lesson.id} practice={practice} language={language} />
                        <label className="checkbox-row">
                          <input type="checkbox" checked={Boolean(progress[key])} onChange={() => toggle(key)} />
                          Mark as done
                        </label>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="instruction-section">
                <p className="eyebrow">Workflow</p>
                <pre className="command-block"><code>{commands(lesson.id, language)}</code></pre>
                <p className="muted small">
                  Name each test {language === "python" ? <code>test_practice_N_…</code> : <code>practice N: …</code>}. The checker runs practice N normally (it must pass) and with
                  bug flag <code>{lesson.id}:N</code> (it must fail).
                </p>
              </div>
              {lesson.prerequisites && (
                <div className="instruction-section">
                  <p className="eyebrow">Before you start</p>
                  <ul className="goal-list">{lesson.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              )}
              <div className="instruction-section">
                <p className="eyebrow">Read in the docs</p>
                <ul className="resource-list">
                  {lesson.resources.map((resource) => (
                    <li key={resource.url}><a href={resource.url} target="_blank" rel="noreferrer">{resource.label}</a></li>
                  ))}
                </ul>
              </div>
              {next && (
                <div className="instruction-section next-lesson">
                  <p className="eyebrow">Next step</p>
                  <Link href={`/lessons/${next.id}`}>Continue to lesson {lessonNumber(next)} →</Link>
                </div>
              )}
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}

function RichInline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, index) =>
        part.startsWith("`") && part.endsWith("`") ? <code key={index}>{part.slice(1, -1)}</code> : part
      )}
    </>
  );
}

function commands(id: string, language: Language) {
  if (language === "python") {
    return [
      `cp tests/lessons/${pythonFile(id)} tests/solutions/`,
      `pytest tests/solutions/${pythonFile(id)}`,
      `npm run check -- ${id} --python`
    ].join("\n");
  }
  return [
    `cp tests/lessons/${id}.spec.ts tests/solutions/`,
    `npx playwright test tests/solutions/${id}.spec.ts`,
    `npm run check -- ${id}`
  ].join("\n");
}
