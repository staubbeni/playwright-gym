// Lesson 23 — Accessibility testing
// Snapshot the main navigation, check the newsletter dialog's focus handling,
// and verify that form errors are announced and described.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 23-accessibility
import { expect, test } from "@playwright/test";

test("practice 1: aria snapshot", async ({ page }) => {
  await page.goto("/play/23-accessibility");
  // TODO (guided): Prove the main navigation is exposed with all three links,
  // each with an accessible name.
});

test("practice 2: dialog focus", async ({ page }) => {
  await page.goto("/play/23-accessibility");
  // TODO (independent): Open the newsletter dialog. Prove focus moves into it,
  // and that after Escape closes it focus is back where it started.
});

test("practice 3: announced errors", async ({ page }) => {
  await page.goto("/play/23-accessibility");
  // TODO (challenge): Submit the empty contact form and prove both errors are
  // announced, not just visible: each field is invalid and described by its
  // error text. Roles and labels only, no test ids.
});
