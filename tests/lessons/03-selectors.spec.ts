// Lesson 03 — Selectors & click
// Click buttons, open an icon-only panel, and type into a search field
// without relying on ids or CSS.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 03-selectors
import { expect, test } from "@playwright/test";

test("practice 1: click and verify", async ({ page }) => {
  await page.goto("/play/03-selectors");
  // TODO (guided): Click "Complete action" and assert that the status says
  // "Action completed successfully.".
});

test("practice 2: icon-only button", async ({ page }) => {
  await page.goto("/play/03-selectors");
  // TODO (independent): Click the gear button (accessible name "Open
  // settings") and assert that the region named "Settings panel" is visible.
  // Hint: getByRole("region", { name: "Settings panel" })
});

test("practice 3: placeholder search", async ({ page }) => {
  await page.goto("/play/03-selectors");
  // TODO (challenge): Fill the field with placeholder "Search lessons" with
  // "locators" and assert the echo "Showing results for: locators".
});
