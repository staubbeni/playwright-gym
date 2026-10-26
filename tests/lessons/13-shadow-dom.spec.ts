// Lesson 13 — Shadow DOM
// Save a name and a theme inside the component and check the initials
// rendered by a nested avatar component.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 13-shadow-dom
import { expect, test } from "@playwright/test";

test("practice 1: fill inside the component", async ({ page }) => {
  await page.goto("/play/13-shadow-dom");
  // TODO (guided): Set Display name to "Grace Hopper", click "Save settings",
  // and assert "Saved name: Grace Hopper".
});

test("practice 2: select inside the component", async ({ page }) => {
  await page.goto("/play/13-shadow-dom");
  // TODO (independent): Choose Theme "Dark", save, and assert "Saved theme:
  // dark".
});

test("practice 3: nested component", async ({ page }) => {
  await page.goto("/play/13-shadow-dom");
  // TODO (challenge): After saving "Grace Hopper" assert that the element with
  // accessible name "Avatar" shows "GH".
});
