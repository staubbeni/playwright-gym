// Lesson checker.
//
//   npm run check -- <lesson-id>              checks tests/solutions/<id>.spec.ts
//   npm run check -- <lesson-id> --examples   checks tests/examples/<id>.spec.ts
//   npm run check -- --all --examples         checks every reference example
//   add --python to check the Python track (tests/{solutions,examples}/<id>_test.py)
//
// For each practice N the checker runs the spec normally (practice N must
// pass) and again with the bug flag "<id>:N" active (practice N must fail).
// A practice that stays green with its bug switched on is a false positive.
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import ts from "typescript";
import { getLesson, lessons, pythonFile, pythonLesson, type Lesson } from "../lib/lessons/index.ts";

const root = process.cwd();
const args = process.argv.slice(2);
const useExamples = args.includes("--examples");
const checkAll = args.includes("--all");
const usePython = args.includes("--python");
const port = Number(process.env.PORT ?? 3000);
const baseURL = `http://127.0.0.1:${port}`;

type PracticeResult = { name: string; ok: boolean; notes: string[] };

function usage(message: string): never {
  console.error(`\n❌ ${message}\n\nUsage: npm run check -- <lesson-id> [--examples] [--python]\n       npm run check -- --all --examples [--python]`);
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

function staticFindingsPython(source: string) {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (/\bwait_for_timeout\(/.test(source)) {
    errors.push("wait_for_timeout() is a fixed sleep. Wait for a state with a web-first assertion instead.");
  }
  if (!/\bexpect\(/.test(source)) errors.push("No expect() assertion found.");
  if (/(expect\(|assert\s+)[^\n]*\.is_(visible|hidden|checked|enabled|disabled)\(/.test(source)) {
    warnings.push("is_visible()/is_checked()/... read once and do not retry. Use expect(...).to_be_visible()/to_be_checked()/...");
  }
  if (/\.query_selector(_all)?\(/.test(source)) warnings.push("query_selector returns legacy element handles. Use locators.");
  if (/force\s*=\s*True/.test(source)) warnings.push("force=True skips actionability checks and can hide real bugs.");
  if (/nth-child/.test(source)) warnings.push("nth-child selectors depend on layout. Prefer role, label, or filter().");
  if (/networkidle/.test(source)) warnings.push("\"networkidle\" is discouraged. Assert the UI state you need.");
  return { errors, warnings };
}

// Python practice N: test names contain "practice_N_" (functions or classes).
const pythonMarker = (index: number) => new RegExp(`practice_${index + 1}_`, "i");

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

// Python variant: top-level blocks start after a blank line at column 0 with a
// decorator, def or class (decorators sit directly on top of their def).
function practiceSourcePython(source: string, index: number): string {
  return source
    .split(/\n[ \t]*\n(?=@|async def |def |class )/)
    .filter((text) => pythonMarker(index).test(text) || !/practice_\d+_/i.test(text))
    .join("\n");
}

function rubricFindings(lesson: Lesson, index: number, fullSource: string): string[] {
  const rubric = lesson.practices[index].rubric;
  if (!rubric) return [];
  const source = usePython ? practiceSourcePython(fullSource, index) : practiceSource(fullSource, index);
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

function pythonBin(): string {
  if (process.env.PYTHON) return process.env.PYTHON;
  const venv = resolve(root, ".venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python");
  return existsSync(venv) ? venv : process.platform === "win32" ? "python" : "python3";
}

const unescapeXml = (text: string) =>
  text.replace(/&#10;/g, "\n").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

// Same result shape as runSpec, from pytest's JUnit XML. Output carries the
// first failure as `"message": "..."` so errorSummary() works unchanged.
function runPytest(specPath: string, options: { bug?: string; grep?: string; repeatEach?: number; updateSnapshots?: boolean } = {}): RunResult {
  const runs = options.repeatEach ?? 1;
  const merged: RunResult = { exitCode: 0, tests: [], output: "" };
  const dir = mkdtempSync(join(tmpdir(), "gym-pytest-"));
  try {
    for (let run = 0; run < runs; run++) {
      const report = join(dir, `report-${run}.xml`);
      const cliArgs = ["-m", "pytest", specPath, "-q", "-p", "no:cacheprovider", `--junitxml=${report}`];
      if (options.grep) cliArgs.push("-k", options.grep);
      const result = spawnSync(pythonBin(), cliArgs, {
        cwd: root,
        env: {
          ...process.env,
          GYM_BUG: options.bug ?? "",
          PORT: String(port),
          GYM_UPDATE_SNAPSHOTS: options.updateSnapshots ? "missing" : ""
        },
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024
      });
      merged.output += `${result.stdout ?? ""}${result.stderr ?? ""}`;
      if (result.error) merged.output += String(result.error);
      // pytest exits 5 when -k deselects everything; the empty test list says so.
      if ((result.status ?? 1) !== 0 && result.status !== 5) merged.exitCode = result.status ?? 1;
      if (!existsSync(report)) continue;
      const xml = readFileSync(report, "utf8");
      for (const match of Array.from(xml.matchAll(/<testcase classname="([^"]*)" name="([^"]*)"[^>]*?(\/>|>([\s\S]*?)<\/testcase>)/g))) {
        const body = match[4] ?? "";
        const failure = body.match(/<(failure|error) message="([^"]*)"/);
        if (failure) merged.output += `\n"message": ${JSON.stringify(unescapeXml(failure[2]))}\n`;
        const skipped = /<skipped/.test(body);
        merged.tests.push({ title: `${unescapeXml(match[1])}::${unescapeXml(match[2])}`, passed: !failure && !skipped });
      }
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  return merged;
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
  const file = usePython ? pythonFile(lesson.id) : `${lesson.id}.spec.ts`;
  const examplePath = resolve(root, "tests", "examples", file);
  const solutionPath = resolve(root, "tests", "solutions", file);
  if (useExamples) {
    if (!existsSync(examplePath)) usage(`No reference example at tests/examples/${file}`);
    return examplePath;
  }
  if (!existsSync(solutionPath)) {
    const hint = !usePython && existsSync(resolve(root, "tests", "solutions", pythonFile(lesson.id)))
      ? `\n\nFound tests/solutions/${pythonFile(lesson.id)}: add --python to check it.`
      : "";
    usage(`No solution yet. Copy the starter first:\n\n  mkdir -p tests/solutions && cp tests/lessons/${file} tests/solutions/${hint}`);
  }
  return solutionPath;
}

const run = (specPath: string, options: Parameters<typeof runSpec>[1] = {}) =>
  usePython ? runPytest(specPath, options) : runSpec(specPath, options);

// The -k / --grep expression and title marker for practice N.
const practiceGrep = (index: number) => (usePython ? `practice_${index + 1}_` : `practice ${index + 1}:`);

function practiceTests(result: RunResult, index: number) {
  if (usePython) return result.tests.filter((test) => pythonMarker(index).test(test.title));
  const marker = `practice ${index + 1}:`;
  return result.tests.filter((test) => test.title.includes(marker));
}

function checkLesson(baseLesson: Lesson): boolean {
  const lesson = usePython ? pythonLesson(baseLesson) : baseLesson;
  const specPath = specPathFor(lesson);
  const relative = specPath.slice(root.length + 1);
  const source = readFileSync(specPath, "utf8");
  console.log(`\n${"=".repeat(64)}\n🔍 ${lesson.id} — ${lesson.title}\n   ${relative}\n${"=".repeat(64)}`);

  const { errors, warnings } = usePython ? staticFindingsPython(source) : staticFindings(specPath, source);
  for (const error of errors) console.log(`  ❌ ${error}`);
  for (const warning of warnings) console.log(`  ⚠️  ${warning}`);
  if (errors.length === 0 && warnings.length === 0) console.log("  ✅ No anti-patterns found.");

  if (lesson.check?.snapshots) {
    const seeded = run(specPath, { updateSnapshots: true });
    if (/writing actual|Missing baseline/.test(seeded.output)) console.log("  📸 Created missing screenshot baselines.");
  }

  const normal = run(specPath, { repeatEach: lesson.check?.repeatEach });
  if (normal.tests.length === 0) {
    console.log(`\n  ❌ The spec did not run:\n${normal.output.split("\n").slice(-25).join("\n")}`);
    return false;
  }

  if (lesson.check?.capstone) return checkCapstone(lesson, specPath, normal, errors.length === 0);

  const results: PracticeResult[] = lesson.practices.map((practice, index) => {
    const notes = rubricFindings(lesson, index, source);
    const tests = practiceTests(normal, index);
    const name = `Practice ${index + 1} — ${practice.title}`;
    if (tests.length === 0) {
      const expected = usePython ? `test_practice_${index + 1}_...` : `"practice ${index + 1}: ..."`;
      return { name, ok: false, notes: [`No test named ${expected}.`, ...notes] };
    }
    if (!tests.every((test) => test.passed)) {
      const runs = lesson.check?.repeatEach ? ` (in ${lesson.check.repeatEach} repeated runs)` : "";
      const reason = errorSummary(run(specPath, { grep: practiceGrep(index) }).output);
      return { name, ok: false, notes: [`Fails against the normal app${runs}.${reason ? `\n      ${reason}` : ""}`, ...notes] };
    }
    const flag = `${lesson.id}:${index + 1}`;
    const mutated = run(specPath, { bug: flag, grep: practiceGrep(index) });
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
    const mutated = run(specPath, { bug: `${lesson.id}:${index + 1}` });
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
