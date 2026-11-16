// Lesson 01 — Setup & first run
// Run your first spec, clean up a recorded test, and assert the checklist.
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

// Practice 2: this is what a quick codegen recording looks like. It works, but
// it is tied to CSS classes. Rewrite it with getByRole / getByText, then
// compare with `npx playwright codegen http://127.0.0.1:3000/play/01-setup`.
test("practice 2: clean up a recorded test", async ({ page }) => {
  await page.goto("/play/01-setup");
  await page.locator("button.primary-button").click();
  await expect(page.locator("p.result-panel")).toContainText("Training started");
});

test("practice 3: assert the setup checklist", async ({ page }) => {
  await page.goto("/play/01-setup");
  // TODO (challenge): the list named "Setup checklist" has exactly four steps:
  // Install Node.js, Install Playwright, Run the example test, Open the HTML
  // report. Assert the steps and their text, in order.
  // Hint: getByRole("list", { name: ... }).getByRole("listitem") and
  // toHaveText([...]).
});
