// Lesson 25 — Debugging & trace viewer
// Fix a failing test from its call log, explain your assertions, and fail on
// console and page errors.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 25-debugging
import { expect, test } from "@playwright/test";

test("practice 1: read the call log", async ({ page }) => {
  await page.goto("/play/25-debugging");
  // This test FAILS. Run it, read the error and the call log, then fix it.
  await page.getByRole("button", { name: "Create report" }).click();
  await expect(page.getByRole("status")).toHaveText("Report ready.");
});

test("practice 2: explain your assertions", async ({ page }) => {
  await page.goto("/play/25-debugging");
  // TODO (independent): generate the report, then check in two named
  // test.step() blocks that it lists every region and that every revenue
  // figure is real. Give each assertion a message.
});

test("practice 3: a clean report", async ({ page }) => {
  await page.goto("/play/25-debugging");
  // TODO (challenge): collect console errors AND uncaught page errors, keep a
  // trace with a top-level test.use({ trace }), and prove both lists are empty once the
  // report is ready.
});
