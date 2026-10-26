// Lesson 10 — Keyboard, hover & drag
// Open the command palette with a shortcut, read a hover tooltip, and move a
// kanban card.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 10-keyboard-mouse
import { expect, test } from "@playwright/test";

test("practice 1: keyboard shortcut", async ({ page }) => {
  await page.goto("/play/10-keyboard-mouse");
  // TODO (guided): Press ControlOrMeta+K, type "cart" in the Command field,
  // press Enter, and assert "Opened: Cart".
  // Hint: Global shortcuts only work once the page's JavaScript is running.
  // Wait for "Keyboard shortcuts ready" before pressing keys: page-level key
  // presses have no element to auto-wait for.
});

test("practice 2: hover tooltip", async ({ page }) => {
  await page.goto("/play/10-keyboard-mouse");
  // TODO (independent): Hover the button "About the Pro plan" and assert the
  // tooltip "Includes unlimited projects.".
});

test("practice 3: drag and drop", async ({ page }) => {
  await page.goto("/play/10-keyboard-mouse");
  // TODO (challenge): Drag "Write tests" from To do into the Done list. Assert
  // that it is in Done and no longer in To do.
});
