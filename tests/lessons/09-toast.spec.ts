// Lesson 09 — Transient UI & toasts
// Assert what appears and disappears: one toast, a stack of toasts, and a toast
// whose text keeps changing.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 09-toast
import { expect, test } from "@playwright/test";

test("practice 1: toast appears, then closes", async ({ page }) => {
  await page.goto("/play/09-toast");
  // TODO (guided): Click "Save preferences". Assert the toast says
  // "Preferences saved." and that it goes away on its own.
});

test("practice 2: stacked toasts in order", async ({ page }) => {
  await page.goto("/play/09-toast");
  // TODO (independent): "Send 3 emails" shows three toasts one after another.
  // Assert all three are on screen together, in order: "Email 1 sent.",
  // "Email 2 sent.", "Email 3 sent.".
});

test("practice 3: undo with a countdown", async ({ page }) => {
  await page.goto("/play/09-toast");
  // TODO (challenge): click "Delete draft". The toast reads "Draft deleted. Undo
  // in 4s" and the number counts down, so match only the stable part. Click
  // "Undo", then assert the draft "Weekly plan" is back and the toast "Draft
  // restored." appeared.
});
