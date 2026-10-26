// Lesson 23 — Accessibility testing
// Snapshot the main navigation, check the newsletter dialog's focus
// handling, and verify accessible error descriptions.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 23-accessibility
import { expect, test } from "@playwright/test";

test("practice 1: aria snapshot", async ({ page }) => {
  await page.goto("/play/23-accessibility");
  // TODO (guided): Assert that the navigation "Main" matches an ARIA snapshot
  // with links Home, Shop and Account.
});

test("practice 2: dialog focus", async ({ page }) => {
  await page.goto("/play/23-accessibility");
  // TODO (independent): Click "Subscribe to newsletter", assert the dialog
  // "Newsletter" is visible and its Email field is focused, press Escape, and
  // assert the dialog is hidden.
});

test("practice 3: accessible errors", async ({ page }) => {
  await page.goto("/play/23-accessibility");
  // TODO (challenge): Click "Send message" with an empty form. Assert that
  // "Contact email" has aria-invalid="true" and the accessible description
  // "Contact email is required.".
});
