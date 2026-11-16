// Lesson 02 — Your first Playwright test
// Verify the three stages of a test, read a failing one, and structure a test
// with steps.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 02-test-anatomy
import { expect, test } from "@playwright/test";

test("practice 1: find the three stages", async ({ page }) => {
  await page.goto("/play/02-test-anatomy");
  // TODO (guided): Assert that the arrange-step, act-step and assert-step test
  // ids are all visible.
});

// Practice 2 FAILS on purpose. Run it, read "Expected" and "Received" in the
// error, and fix the test (not the page).
test("practice 2: read the failure", async ({ page }) => {
  await page.goto("/play/02-test-anatomy");
  await expect(page.getByTestId("arrange-step")).toContainText("prepare the test fixture");
  await expect(page.getByTestId("act-step")).toHaveText("Perform one focused user action.");
});

test("practice 3: structure a readable test", async ({ page }) => {
  // TODO (challenge): three test.step() blocks (Arrange, Act, Assert). Open
  // /play/02-test-anatomy, click "Run demo test", then assert the verdict
  // "Demo test passed." and the counter "Stages completed: 3 of 3".
});
