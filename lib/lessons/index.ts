import { gettingStarted } from "./01-getting-started.ts";
import { reliableTests } from "./02-reliable-tests.ts";
import { realWorld } from "./03-real-world.ts";
import { testDesign } from "./04-test-design.ts";
import { beyondFunctional } from "./05-beyond-functional.ts";
import { testEngineering } from "./06-test-engineering.ts";
import type { Lesson } from "./types.ts";

export * from "./types.ts";

// Array order is the curriculum order.
export const lessons: Lesson[] = [
  ...gettingStarted,
  ...reliableTests,
  ...realWorld,
  ...testDesign,
  ...beyondFunctional,
  ...testEngineering
];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function lessonNumber(lesson: Lesson): string {
  return lesson.id.slice(0, 2);
}

export function nextLesson(lesson: Lesson): Lesson | undefined {
  return lessons[lessons.indexOf(lesson) + 1];
}

export function practiceFlag(lesson: Lesson, practiceIndex: number): string {
  return `${lesson.id}:${practiceIndex + 1}`;
}
