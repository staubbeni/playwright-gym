import { test } from "@playwright/test";

test("submits a valid registration form", async ({ page }) => {
  await page.goto("/lessons/02-forms");

  // TODO: fill a valid email address.
  // TODO: accept the terms and submit the form.
  // TODO: assert that the account-created message is visible.
});
