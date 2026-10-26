// Lesson 02 — Your first Playwright test
// Verify the three stages of a test, their explanations, and the demo run.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 02-test-anatomy
import { expect, test } from "@playwright/test";

test("practice 1: find the three stages", async ({ page }) => {
  await page.goto("/play/02-test-anatomy");
  // TODO (guided): Assert that the arrange-step, act-step and assert-step test
  // ids are all visible.
});

test("practice 2: verify the explanations", async ({ page }) => {
  await page.goto("/play/02-test-anatomy");
  // TODO (independent): Assert the user-facing explanation text of each stage
  // with toContainText.
  // Hint: Act should mention "one focused user action".
});

test("practice 3: structure a readable test", async ({ page }) => {
  await page.goto("/play/02-test-anatomy");
  // TODO (challenge): Use three test.step() blocks (Arrange, Act, Assert):
  // open the page, click Run demo test, and assert "Demo test passed.".
});
