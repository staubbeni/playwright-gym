// Lesson 01 — Setup & first run
// Run your first spec, then add assertions for the title, the training
// button, and the setup checklist.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npx playwright test tests/solutions/01-setup.spec.ts
//   npm run check -- 01-setup
import { expect, test } from "@playwright/test";

// Practice 1 is solved for you: run it, then open the report with
//   npx playwright show-report
test("practice 1: check the page title", async ({ page }) => {
  await page.goto("/play/01-setup");
  await expect(page).toHaveTitle(/Setup/);
});

test("practice 2: record a click with codegen", async ({ page }) => {
  await page.goto("/play/01-setup");
  // TODO (independent): run
  //   npx playwright codegen http://127.0.0.1:3000/play/01-setup
  // click "Start training", record a visibility assertion for
  // "Training started. Good luck!", and paste the useful lines here.
});

test("practice 3: count the setup checklist", async ({ page }) => {
  await page.goto("/play/01-setup");
  // TODO (challenge): assert that the list named "Setup checklist" has exactly
  // 4 items. Hint: getByRole("list", { name: ... }).getByRole("listitem").
});
