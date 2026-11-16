// Lesson 04 — Forms & validation
// Create an account, prove each validation rule, and check the summary and the
// reset button.
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

test("practice 2: validation matrix", async ({ page }) => {
  await page.goto("/play/04-forms");
  // TODO (independent): prove each rule on its own: an invalid email, a
  // 7-character password and unchecked terms are each rejected with a message,
  // and no account is created.
  // Hint: Next.js adds an empty role=alert, so narrow it with
  // getByRole("alert").filter({ hasText: ... }).
});

test("practice 3: options, summary and reset", async ({ page }) => {
  await page.goto("/play/04-forms");
  // TODO (challenge): choose plan "Pro" and role "Teacher" and assert the exact
  // summary. Then click "Reset form" and assert the form is clean: empty name,
  // Free plan, Student role and the starting status "Complete the form to
  // continue.".
});
