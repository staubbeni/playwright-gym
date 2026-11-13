import type { Lesson } from "../types.ts";

// Best-effort TS → Python wording for prose the Python track doesn't override:
// camelCase API names become snake_case, `{ name: "x" }` becomes name="x".
// shortcut: regex-based, so only simple one-key option objects convert; add an
// explicit override in python/<module>.ts when a sentence reads wrong.
// Browser and DOM names that stay camelCase in Python too.
const keep = new Set(["localStorage", "sessionStorage", "postMessage", "querySelector", "shadowRoot"]);

export function toPythonText(text: string): string {
  return text
    .replace(/\bawait\s+/g, "")
    .replace(/\.(first|last)\(\)/g, ".$1")
    .replace(/\b[a-z]+(?:[A-Z]+[a-z0-9]*)+\b/g, (word) =>
      keep.has(word) ? word : word.replace(/[A-Z]+/g, (caps) => `_${caps.toLowerCase()}`)
    )
    .replace(/\.not\.to_/g, ".not_to_")
    .replace(/\{\s*([a-z_]+):\s*("[^"]*"|\/[^/]+\/|\d+|[a-z_.]+)\s*\}/g, "$1=$2");
}

// The lesson as the Python track shows it.
export function pythonLesson(lesson: Lesson): Lesson {
  const py = lesson.python;
  if (!py) return lesson;
  return {
    ...lesson,
    description: toPythonText(lesson.description),
    mission: toPythonText(lesson.mission),
    theory: py.theory ?? toPythonText(lesson.theory),
    learningGoals: py.learningGoals ?? lesson.learningGoals.map(toPythonText),
    goodExample: py.goodExample,
    badExample: py.badExample,
    commonMistakes: py.commonMistakes ?? lesson.commonMistakes.map(toPythonText),
    prerequisites: py.prerequisites ?? lesson.prerequisites,
    concepts: py.concepts ?? lesson.concepts.map(toPythonText),
    practices: lesson.practices.map((practice, index) => {
      const override = py.practices[index];
      return {
        ...practice,
        goal: override.goal ?? toPythonText(practice.goal),
        hint: override.hint ?? (practice.hint && toPythonText(practice.hint)),
        partial: override.partial,
        rubric: override.rubric
      };
    })
  };
}

// File names of the Python track: "03-selectors" → "03_selectors_test.py".
export function pythonFile(lessonId: string): string {
  return `${lessonId.replace(/-/g, "_")}_test.py`;
}
