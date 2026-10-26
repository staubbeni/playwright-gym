import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const root = resolve(process.cwd());
const lessonId = process.argv[2];
const lessonPattern = /^[0-9]{2}-[a-z0-9-]+$/;

function fail(message: string): never {
  console.error(`\n❌ ${message}`);
  process.exit(1);
}

if (!lessonId || !lessonPattern.test(lessonId)) {
  fail("Használat: npm run check -- 01-selectors");
}

const solutionPath = resolve(root, "tests", "solutions", `${lessonId}.spec.ts`);
const starterPath = resolve(root, "tests", "lessons", `${lessonId}.spec.ts`);
const specPath = existsSync(solutionPath) ? solutionPath : starterPath;
if (!existsSync(specPath)) {
  fail(`Nem találom a lesson specet: tests/lessons/${lessonId}.spec.ts`);
}
if (specPath === starterPath) {
  fail(
    `Még nincs lokális megoldásod. Másold át a startert ide: tests/solutions/${lessonId}.spec.ts`
  );
}

const source = readFileSync(specPath, "utf8");
const findings: string[] = [];
const sourceFile = ts.createSourceFile(
  specPath,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
);
const callExpressions: ts.CallExpression[] = [];

function visit(node: ts.Node) {
  if (ts.isCallExpression(node)) callExpressions.push(node);
  ts.forEachChild(node, visit);
}

visit(sourceFile);

function callName(call: ts.CallExpression): string | undefined {
  if (ts.isIdentifier(call.expression)) return call.expression.text;
  if (ts.isPropertyAccessExpression(call.expression)) {
    const target = call.expression.expression;
    const name = call.expression.name.text;
    return ts.isIdentifier(target) ? `${target.text}.${name}` : name;
  }
  return undefined;
}

if (callExpressions.some((call) => callName(call) === "page.waitForTimeout")) {
  findings.push("A page.waitForTimeout() használata törékeny várakozást eredményez.");
}
if (callExpressions.some((call) => callName(call) === "test.only")) {
  findings.push("A test.only() miatt a teljes spec-suite nem futna.");
}
if (!callExpressions.some((call) => callName(call) === "expect")) {
  findings.push("Nem található expect() assertion.");
}
if (
  callExpressions.some(
    (call) =>
      callName(call) === "toBeTruthy" &&
      ts.isPropertyAccessExpression(call.expression) &&
      ts.isCallExpression(call.expression.expression) &&
      callName(call.expression.expression) === "expect"
  )
) {
  findings.push("A toBeTruthy() nem ellenőrzi a lesson kívánt UI-viselkedését.");
}

console.log("===================================================");
console.log(`🔍 CHECKING LESSON: ${lessonId}`);
console.log("===================================================");
console.log("\n[1/3] Static checks");
if (findings.length > 0) {
  for (const finding of findings) console.log(`  ⚠️  ${finding}`);
} else {
  console.log("  ✅ No known anti-patterns found.");
}

type RunResult = {
  status: number;
  output: string;
};

function runSpec(path: string): RunResult {
  const result = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["playwright", "test", path, "--reporter=line"],
    {
      cwd: root,
      env: { ...process.env },
      encoding: "utf8"
    }
  );
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  process.stdout.write(output);
  return { status: result.status ?? 1, output };
}

console.log("\n[2/3] Normal app run");
const normalResult = runSpec(specPath);
if (normalResult.status !== 0) {
  fail("A tanulói teszt normál módban elbukott. Javítsd ezt először.");
}
console.log("✅ Normal run passed.");

const mutationPath = resolve(
  root,
  "tests",
  "lessons",
  `.validator-${lessonId}.spec.ts`
);
const escapedLessonId = lessonId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const lessonUrl = new RegExp(`(["'\`])\\/lessons\\/${escapedLessonId}\\1`, "g");
const mutatedSource = source.replace(
  lessonUrl,
  (_match, quote: string) => `${quote}/lessons/${lessonId}?bug=true${quote}`
);

if (mutatedSource === source) {
  console.log(
    "\n⚠️  Nem találtam közvetlen lesson URL-t a specben; a mutation futás nem módosítható."
  );
  process.exit(1);
}

writeFileSync(mutationPath, mutatedSource);
console.log("\n[3/3] Mutation run");
let mutationStatus: number;
try {
  const mutationResult = runSpec(mutationPath);
  if (/Timed out waiting|is already used|failed to start/i.test(mutationResult.output)) {
    fail("A mutation futtatás infrastruktúrahibával állt le (dev server vagy port).");
  }
  mutationStatus = mutationResult.status;
} finally {
  unlinkSync(mutationPath);
}

if (mutationStatus === 0) {
  fail(
    "False positive: a teszt bug módban is zöld maradt. Az assertion nem bizonyítja a kívánt viselkedést."
  );
}

console.log(
  "✅ Mutation run elbukott, tehát a teszt érzékeli a szándékosan hibás alkalmazást."
);
if (findings.length > 0) {
  console.log("\n⚠️  A teszt fut, de érdemes javítani a fenti statikus jelzéseket.");
}
console.log("\n✅ Lesson check completed.");
