// Lesson 25 — Debugging & trace viewer
// Assert the report state, give your assertions clear messages, and fail on
// console errors.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 25-debugging
import { expect, test } from "@playwright/test";

test("practice 1: assert the final state", async ({ page }) => {
  await page.goto("/play/25-debugging");
  // TODO (guided): Click "Generate report" and assert the status "Report
  // ready.". If it fails, run with --trace on and open the trace.
});

test("practice 2: assertion messages", async ({ page }) => {
  await page.goto("/play/25-debugging");
  // TODO (independent): Assert the report table has 3 data rows, with a custom
  // message as the second argument of expect().
});

test("practice 3: fail on console errors", async ({ page }) => {
  await page.goto("/play/25-debugging");
  // TODO (challenge): Collect console messages of type "error" during report
  // generation and assert the list is empty once the report is ready.
});
