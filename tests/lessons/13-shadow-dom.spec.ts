// Lesson 13 — Shadow DOM
// Use a web component whose inputs and avatar live inside shadow roots.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 13-shadow-dom
import { expect, test } from "@playwright/test";

test("practice 1: fill inside the component", async ({ page }) => {
  await page.goto("/play/13-shadow-dom");
  // TODO (guided): set Display name to "Grace Hopper", click "Save settings",
  // and assert "Saved name: Grace Hopper".
});

test("practice 2: name and theme together", async ({ page }) => {
  await page.goto("/play/13-shadow-dom");
  // TODO (independent): choose Theme "Dark", set the name "Grace Hopper", save
  // once, and assert both the saved name and the saved theme lines.
});

test("practice 3: avatar initials", async ({ page }) => {
  await page.goto("/play/13-shadow-dom");
  // TODO (challenge): save "Grace Hopper" and assert the avatar shows GH; then
  // save "Plato" and assert it shows P. Find the avatar by its accessible name,
  // no shadow-piercing selectors.
});
