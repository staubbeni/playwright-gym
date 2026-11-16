// Lesson 27 — Config, parallelism & CI
// Configure the viewport per describe, poll a service until it is healthy, and
// keep shared data safe in parallel and serial tests.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 27-config-ci
import { expect, test } from "@playwright/test";

test.describe("practice 1: desktop viewport", () => {
  // TODO (guided): configure a 1280 × 720 viewport for this describe with test.use().

  test("reports the configured viewport", async ({ page }) => {
    await page.goto("/play/27-config-ci");
    // TODO: prove the page agrees.
  });
});

test("practice 2: waits until the service is healthy", async ({ page }) => {
  await page.goto("/play/27-config-ci");
  // TODO (independent): the service says "Degraded" for its first few checks.
  // Click "Refresh status" until the page says Healthy, using
  // expect(async () => { ... }).toPass().
});

// TODO (challenge): two describes whose titles start with "practice 3:".
//  - one configured with test.describe.configure({ mode: "parallel" }): two
//    tests each add a member with a unique name and prove exactly one list
//    item shows that name in full;
//  - one configured as { mode: "serial" }: a test adds a member, and the next
//    test reloads the page and proves the member is still listed.
