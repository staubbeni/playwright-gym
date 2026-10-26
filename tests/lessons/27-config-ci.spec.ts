// Lesson 27 — Config, parallelism & CI
// Configure the viewport for a file, poll a service until it is healthy, and
// add unique team members in parallel.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 27-config-ci
import { expect, test } from "@playwright/test";

test.describe("practice 1: desktop viewport", () => {
  // TODO (guided): test.use({ viewport: { width: 1280, height: 720 } });

  test("reports the configured viewport", async ({ page }) => {
    await page.goto("/play/27-config-ci");
    // TODO: assert "Viewport: 1280 × 720".
  });
});

test("practice 2: waits until the service is healthy", async ({ page }) => {
  await page.goto("/play/27-config-ci");
  // TODO (independent): wrap "click Refresh status + expect Healthy (short
  // timeout)" in expect(async () => { ... }).toPass().
});

test.describe("practice 3: parallel-safe members", () => {
  // TODO (challenge): test.describe.configure({ mode: "parallel" });
  // Add two tests that each add a member with a unique name (use
  // test.info().testId) and assert exactly one list item has that name.
});
