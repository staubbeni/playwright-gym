// Lesson 03 — Selectors & click
// Click buttons, open an icon-only panel, type into a search field, and fix an
// ambiguous locator.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 03-selectors
import { expect, test } from "@playwright/test";

test("practice 1: click and verify", async ({ page }) => {
  await page.goto("/play/03-selectors");
  // TODO (guided): Click "Complete action" and assert that the status says
  // "Action completed successfully.".
});

test("practice 2: two controls, no CSS", async ({ page }) => {
  await page.goto("/play/03-selectors");
  // TODO (independent): open the settings panel with the gear button and assert
  // it is visible; then type "locators" into the search box and assert the echo
  // shows it. Built-in locators only.
});

// Practice 3 FAILS on purpose with a strict mode violation. Run it, read the
// error, and fix the locator without .first() / .nth().
test("practice 3: fix the strict mode error", async ({ page }) => {
  await page.goto("/play/03-selectors");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByTestId("save-result")).toHaveText("Document saved.");
  // TODO: then click "Save as draft" and assert its result as well.
});
