export type Difficulty = "guided" | "independent" | "challenge";

// Static checks the checker runs against the learner's spec source.
export type Rubric = {
  requires?: { pattern: RegExp; message: string }[];
  forbids?: { pattern: RegExp; message: string }[];
};

// Practice N is the test (or describe) whose title starts with "practice N:".
// Its bug flag is "<lessonId>:<N>"; the checker runs it once normally (must
// pass) and once with that flag active (must fail).
export type Practice = {
  title: string;
  goal: string;
  difficulty: Difficulty;
  hint?: string;
  // Start of a solution (Stuck? step 2): the actions, not the assertions.
  partial?: string;
  rubric?: Rubric;
  // Planted defects, one label per sub-flag "<lessonId>:<N>.<k>" (k = 1..n).
  // The checker switches each on alone and your practice must catch every one.
  bugs?: string[];
};

// Python (pytest-playwright, sync API) version of a lesson. Prose that is not
// overridden is shown with camelCase API names converted (see python/view.ts).
export type PythonPractice = {
  goal?: string;
  hint?: string;
  partial?: string;
  rubric?: Rubric;
};

export type PythonLesson = {
  theory?: string;
  learningGoals?: string[];
  goodExample: string;
  badExample: string;
  commonMistakes?: string[];
  prerequisites?: string[];
  concepts?: string[];
  // One entry per practice, same order as Lesson.practices.
  practices: PythonPractice[];
};

export type Lesson = {
  id: string;
  module: ModuleId;
  title: string;
  shortDescription: string;
  description: string;
  learningGoals: string[];
  // Paragraphs separated by blank lines; `inline code` is rendered as code.
  theory: string;
  goodExample: string;
  badExample: string;
  commonMistakes: string[];
  mission: string;
  // Where the learner's tests point: "/play/<id>" or a Gym Shop page.
  target: string;
  practices: Practice[];
  python?: PythonLesson;
  concepts: string[];
  resources: { label: string; url: string }[];
  prerequisites?: string[];
  // Checker behaviour for special lessons.
  check?: {
    repeatEach?: number;
    snapshots?: boolean;
    // `--grep <tag>` (pytest: `-m <tag without @>`) must select exactly practice N's tests.
    tag?: { name: string; practice: number };
    // Capstone: the whole spec runs once per flag and must catch at least `minCaught`.
    capstone?: { minCaught: number };
  };
};

export type ModuleId =
  | "getting-started"
  | "reliable-tests"
  | "real-world"
  | "test-design"
  | "beyond-functional"
  | "test-engineering";

export const modules: { id: ModuleId; title: string; summary: string }[] = [
  {
    id: "getting-started",
    title: "Getting started",
    summary: "Install Playwright, write your first tests, and interact with pages like a user."
  },
  {
    id: "reliable-tests",
    title: "Reliable tests",
    summary: "Locators, assertions, and waiting strategies that do not flake."
  },
  {
    id: "real-world",
    title: "Real-world browser testing",
    summary: "Frames, shadow DOM, popups, network control, APIs, and authentication."
  },
  {
    id: "test-design",
    title: "Test design",
    summary: "Hooks, data-driven tests, page objects, and fixtures for maintainable suites."
  },
  {
    id: "beyond-functional",
    title: "Beyond functional",
    summary: "Visual regression, accessibility, emulation, and time control."
  },
  {
    id: "test-engineering",
    title: "Test engineering",
    summary: "Debugging, isolation, configuration, CI, flakiness, and a capstone project."
  }
];
