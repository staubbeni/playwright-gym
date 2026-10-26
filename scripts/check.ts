// Lesson checker.
//
//   npm run check -- <lesson-id>              checks tests/solutions/<id>.spec.ts
//   npm run check -- <lesson-id> --examples   checks tests/examples/<id>.spec.ts
//   npm run check -- --all --examples         checks every reference example
//
// For each practice N the checker runs the spec normally (practice N must
// pass) and again with the bug flag "<id>:N" active (practice N must fail).
// A practice that stays green with its bug switched on is a false positive.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import ts from "typescript";
import { getLesson, lessons, type Lesson } from "../lib/lessons/index.ts";

const root = process.cwd();
const args = process.argv.slice(2);
const useExamples = args.includes("--examples");
const checkAll = args.includes("--all");
const port = Number(process.env.PORT ?? 3000);
const baseURL = `http://127.0.0.1:${port}`;

type PracticeResult = { name: string; ok: boolean; notes: string[] };

function usage(message: string): never {
  console.error(`\n❌ ${message}\n\nUsage: npm run check -- <lesson-id> [--examples]\n       npm run check -- --all --examples`);
  process.exit(2);
}

// ---------------------------------------------------------------- static checks

function callName(call: ts.CallExpression): string | undefined {
  const expression = call.expression;
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isPropertyAccessExpression(expression)) {
    const target = expression.expression;
    return ts.isIdentifier(target) ? `${target.text}.${expression.name.text}` : expression.name.text;
  }
  return undefined;
}

function staticFindings(path: string, source: string) {
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const calls: ts.CallExpression[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node)) calls.push(node);
    ts.forEachChild(node, visit);
  };
  visit(file);
  const names = calls.map(callName);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (names.includes("page.waitForTimeout") || names.includes("waitForTimeout")) {
    errors.push("waitForTimeout() is a fixed sleep. Wait for a state with a web-first assertion instead.");
  }
  if (names.includes("test.only") || names.includes("describe.only")) {
    errors.push(".only() would make CI run a single test.");
  }
  if (!names.some((name) => name === "expect" || name === "expect.soft" || name === "expect.poll")) {
    errors.push("No expect() assertion found.");
  }
  const isSnapshotRead = (call: ts.CallExpression) =>
    ["isVisible", "isHidden", "isChecked", "isEnabled", "isDisabled"].includes(callName(call)?.split(".").pop() ?? "");
  for (const call of calls) {
    if (callName(call) === "expect" && call.arguments[0]) {
      let inner: ts.Expression = call.arguments[0];
      if (ts.isAwaitExpression(inner)) inner = inner.expression;
      if (ts.isCallExpression(inner) && isSnapshotRead(inner)) {
        warnings.push("expect(await locator.isX()) reads once and does not retry. Use toBeVisible()/toBeChecked()/...");
        break;
      }
    }
  }
  if (/\bpage\.\$\$?\(/.test(source)) warnings.push("page.$ / page.$$ are legacy element handles. Use locators.");
  if (/force:\s*true/.test(source)) warnings.push("{ force: true } skips actionability checks and can hide real bugs.");
  if (/nth-child/.test(source)) warnings.push("nth-child selectors depend on layout. Prefer role, label, or filter().");
  if (/networkidle/.test(source)) warnings.push("\"networkidle\" is discouraged. Assert the UI state you need.");
  if (/toBeTruthy\(\)/.test(source) && !/\.ok\(\)\)\.toBeTruthy/.test(source)) {
    warnings.push("toBeTruthy() is vague. Use a matcher that states the expected UI state.");
  }
  return { errors, warnings };
}

// Source of practice N: its own top-level statements plus shared ones (imports,
// helpers) that belong to no practice, so rules can't be met by another practice.
function practiceSource(source: string, index: number): string {
  const file = ts.createSourceFile("spec.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const own = new RegExp(`practice ${index + 1}:`);
  return file.statements
    .map((statement) => statement.getText(file))
    .filter((text) => own.test(text) || !/practice \d+:/.test(text))
    .join("\n");
}

function rubricFindings(lesson: Lesson, index: number, fullSource: string): string[] {
  const rubric = lesson.practices[index].rubric;
  if (!rubric) return [];
  const source = practiceSource(fullSource, index);
  const notes: string[] = [];
  for (const rule of rubric.requires ?? []) if (!rule.pattern.test(source)) notes.push(rule.message);
  for (const rule of rubric.forbids ?? []) if (rule.pattern.test(source)) notes.push(rule.message);
  return notes;
}

// ---------------------------------------------------------------- test runs

type JsonSuite = { title: string; specs?: JsonSpec[]; suites?: JsonSuite[] };
type JsonSpec = { title: string; tests: { status: string }[] };
type RunResult = { exitCode: number; tests: { title: string; passed: boolean }[]; output: string };

function flatten(suite: JsonSuite, prefix: string[], out: RunResult["tests"]) {
  const path = suite.title ? [...prefix, suite.title] : prefix;
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      out.push({ title: [...path, spec.title].join(" › "), passed: test.status === "expected" || test.status === "flaky" });
    }
  }
  for (const child of suite.suites ?? []) flatten(child, path, out);
}

function runSpec(specPath: string, options: { bug?: string; grep?: string; repeatEach?: number; updateSnapshots?: boolean } = {}): RunResult {
  const cliArgs = ["playwright", "test", specPath, "--reporter=json", "--retries=0"];
  if (options.grep) cliArgs.push("--grep", options.grep);
  if (options.repeatEach) cliArgs.push(`--repeat-each=${options.repeatEach}`);
  if (options.updateSnapshots) cliArgs.push("--update-snapshots=missing");
  const result = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", cliArgs, {
    cwd: root,
    env: { ...process.env, GYM_BUG: options.bug ?? "", PORT: String(port) },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  const tests: RunResult["tests"] = [];
  try {
    const json = JSON.parse(result.stdout.slice(result.stdout.indexOf("{"))) as { suites: JsonSuite[] };
    for (const suite of json.suites) flatten(suite, [], tests);
  } catch {
    // Compile errors and crashes produce no JSON; the exit code tells the story.
  }
  return { exitCode: result.status ?? 1, tests, output };
}

function errorSummary(output: string): string {
  const match = output.match(/"message":\s*"((?:[^"\\]|\\.)*)"/);
  if (!match) return "";
  const message = JSON.parse(`"${match[1]}"`) as string;
  return message.replace(/\u001b\[[0-9;]*m/g, "").split("\n").slice(0, 4).join("\n      ");
}

// ---------------------------------------------------------------- dev server

let server: ChildProcess | undefined;

async function serverUp(): Promise<boolean> {
  try {
    const response = await fetch(baseURL, { signal: AbortSignal.timeout(2_000) });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function ensureServer() {
  if (await serverUp()) return;
  console.log(`Starting the dev server on ${baseURL} ...`);
  server = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "dev", "--", "-p", String(port)], {
    cwd: root,
    stdio: "ignore",
    detached: process.platform !== "win32"
  });
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await serverUp()) return;
    await new Promise((done) => setTimeout(done, 1_000));
  }
  stopServer();
  usage("The dev server did not start. Is the port already in use?");
}

function stopServer() {
  if (!server?.pid) return;
  try {
    process.kill(process.platform === "win32" ? server.pid : -server.pid);
  } catch {
    // Already gone.
  }
}

// ---------------------------------------------------------------- lesson check

function specPathFor(lesson: Lesson): string {
  const examplePath = resolve(root, "tests", "examples", `${lesson.id}.spec.ts`);
  const solutionPath = resolve(root, "tests", "solutions", `${lesson.id}.spec.ts`);
  if (useExamples) {
    if (!existsSync(examplePath)) usage(`No reference example at tests/examples/${lesson.id}.spec.ts`);
    return examplePath;
  }
  if (!existsSync(solutionPath)) {
    usage(
      `No solution yet. Copy the starter first:\n\n  mkdir -p tests/solutions && cp tests/lessons/${lesson.id}.spec.ts tests/solutions/`
    );
  }
  return solutionPath;
}

function practiceTests(run: RunResult, index: number) {
  const marker = `practice ${index + 1}:`;
  return run.tests.filter((test) => test.title.includes(marker));
}

function checkLesson(lesson: Lesson): boolean {
  const specPath = specPathFor(lesson);
  const relative = specPath.slice(root.length + 1);
  const source = readFileSync(specPath, "utf8");
  console.log(`\n${"=".repeat(64)}\n🔍 ${lesson.id} — ${lesson.title}\n   ${relative}\n${"=".repeat(64)}`);

  const { errors, warnings } = staticFindings(specPath, source);
  for (const error of errors) console.log(`  ❌ ${error}`);
  for (const warning of warnings) console.log(`  ⚠️  ${warning}`);
  if (errors.length === 0 && warnings.length === 0) console.log("  ✅ No anti-patterns found.");

  if (lesson.check?.snapshots) {
    const seeded = runSpec(specPath, { updateSnapshots: true });
    if (seeded.output.includes("writing actual")) console.log("  📸 Created missing screenshot baselines.");
  }

  const normal = runSpec(specPath, { repeatEach: lesson.check?.repeatEach });
  if (normal.tests.length === 0) {
    console.log(`\n  ❌ The spec did not run:\n${normal.output.split("\n").slice(-25).join("\n")}`);
    return false;
  }

  if (lesson.check?.capstone) return checkCapstone(lesson, specPath, normal, errors.length === 0);

  const results: PracticeResult[] = lesson.practices.map((practice, index) => {
    const notes = rubricFindings(lesson, index, source);
    const tests = practiceTests(normal, index);
    const name = `Practice ${index + 1} — ${practice.title}`;
    if (tests.length === 0) return { name, ok: false, notes: [`No test titled "practice ${index + 1}: ...".`, ...notes] };
    if (!tests.every((test) => test.passed)) {
      const runs = lesson.check?.repeatEach ? ` (in ${lesson.check.repeatEach} repeated runs)` : "";
      const reason = errorSummary(runSpec(specPath, { grep: `practice ${index + 1}:` }).output);
      return { name, ok: false, notes: [`Fails against the normal app${runs}.${reason ? `\n      ${reason}` : ""}`, ...notes] };
    }
    const flag = `${lesson.id}:${index + 1}`;
    const mutated = runSpec(specPath, { bug: flag, grep: `practice ${index + 1}:` });
    // A crash or compile error also exits non-zero, so require a real failing test.
    if (!practiceTests(mutated, index).some((test) => !test.passed)) {
      return { name, ok: false, notes: [`False positive: still green with bug ${flag} switched on. Assert the outcome more precisely.`, ...notes] };
    }
    return { name, ok: notes.length === 0, notes };
  });

  console.log("");
  for (const result of results) {
    console.log(`  ${result.ok ? "✅" : "❌"} ${result.name}`);
    for (const note of result.notes) console.log(`      ${note}`);
  }
  const passed = results.filter((result) => result.ok).length;
  const ok = passed === results.length && errors.length === 0;
  console.log(`\n  ${ok ? "🏆" : "📋"} ${passed}/${results.length} practices complete${errors.length ? ", fix the errors above" : ""}.`);
  return ok;
}

function checkCapstone(lesson: Lesson, specPath: string, normal: RunResult, staticOk: boolean): boolean {
  const { minCaught } = lesson.check!.capstone!;
  if (normal.exitCode !== 0) {
    const failing = normal.tests.filter((test) => !test.passed).map((test) => test.title);
    console.log(`\n  ❌ The suite must pass against the normal app first. Failing:\n      ${failing.join("\n      ")}`);
    return false;
  }
  console.log(`\n  ✅ ${normal.tests.length} tests pass against the normal app.\n`);
  let caught = 0;
  lesson.practices.forEach((practice, index) => {
    const mutated = runSpec(specPath, { bug: `${lesson.id}:${index + 1}` });
    const hit = mutated.tests.some((test) => !test.passed);
    if (hit) caught += 1;
    console.log(`  ${hit ? "🎯 caught" : "🕳️  missed"}  bug ${index + 1}: ${practice.title}`);
  });
  const ok = caught >= minCaught && staticOk;
  console.log(`\n  ${ok ? "🏆" : "📋"} Caught ${caught}/${lesson.practices.length} planted bugs (goal: ${minCaught}).`);
  return ok;
}

// ---------------------------------------------------------------- main

async function main() {
  const ids = args.filter((arg) => !arg.startsWith("--"));
  const selected = checkAll ? lessons : ids.map((id) => getLesson(id) ?? usage(`Unknown lesson "${id}".`));
  if (selected.length === 0) usage("Pass a lesson id.");
  for (const lesson of selected) specPathFor(lesson);

  await ensureServer();
  const failed: string[] = [];
  try {
    for (const lesson of selected) if (!checkLesson(lesson)) failed.push(lesson.id);
  } finally {
    stopServer();
  }
  if (selected.length > 1) {
    console.log(`\n${"=".repeat(64)}\n${failed.length === 0 ? "✅ All lessons pass." : `❌ Failing: ${failed.join(", ")}`}`);
  }
  process.exit(failed.length === 0 ? 0 : 1);
}

void main();
