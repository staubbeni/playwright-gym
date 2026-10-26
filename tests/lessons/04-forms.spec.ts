// Lesson 04 — Forms & validation
// Create an account, prove that an invalid email is rejected, and verify the
// selected plan and role.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 04-forms
import { expect, test } from "@playwright/test";

test("practice 1: happy path", async ({ page }) => {
  await page.goto("/play/04-forms");
  // TODO (guided): Fill Full name "Ada Lovelace", Email address, Password (8+
  // chars), accept the terms, submit, and assert that the status contains
  // "Account created".
});

test("practice 2: invalid email", async ({ page }) => {
  await page.goto("/play/04-forms");
  // TODO (independent): Submit with email "not-an-email" (everything else
  // valid) and assert the alert "Enter a valid email address.".
  // Hint: Each field error has role=alert, but Next.js also renders an empty
  // route announcer with role=alert. Narrow it down:
  // getByRole("alert").filter({ hasText: "email" }).
});

test("practice 3: options and summary", async ({ page }) => {
  await page.goto("/play/04-forms");
  // TODO (challenge): Choose plan "Pro" and role "Teacher" and assert the
  // exact summary: "Account created for Ada Lovelace on the Pro plan as a
  // Teacher.".
});
