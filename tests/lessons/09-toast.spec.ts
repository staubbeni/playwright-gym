// Lesson 09 — Transient UI & toasts
// Verify the save toast appears and disappears, and that Undo restores a
// deleted draft.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 09-toast
import { expect, test } from "@playwright/test";

test("practice 1: toast appears", async ({ page }) => {
  await page.goto("/play/09-toast");
  // TODO (guided): Click "Save preferences" and assert the toast text
  // "Preferences saved.".
});

test("practice 2: toast disappears", async ({ page }) => {
  await page.goto("/play/09-toast");
  // TODO (independent): Assert that the same toast is visible and then hidden
  // again.
});

test("practice 3: undo from a toast", async ({ page }) => {
  await page.goto("/play/09-toast");
  // TODO (challenge): Click "Delete draft", click "Undo" in the toast, and
  // assert the draft "Weekly plan" is visible again.
});
