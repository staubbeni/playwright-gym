// Lesson 07 — Web-first assertions
// Prove that a checkbox, a disabled-until-valid button, and a tag list
// behave correctly.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 07-assertions
import { expect, test } from "@playwright/test";

test("practice 1: checked state", async ({ page }) => {
  await page.goto("/play/07-assertions");
  // TODO (guided): Check "Enable notifications" and assert both toBeChecked()
  // and the status "Notifications enabled.".
});

test("practice 2: disabled until valid", async ({ page }) => {
  await page.goto("/play/07-assertions");
  // TODO (independent): Assert "Save profile" is disabled, fill Display name
  // with "Ada", assert it is enabled and the field has value "Ada", save, and
  // assert "Profile saved for Ada.".
});

test("practice 3: soft list assertions", async ({ page }) => {
  await page.goto("/play/07-assertions");
  // TODO (challenge): Add the tags playwright, testing and qa. With
  // expect.soft, assert the Tags list has 3 items, their texts in order, and
  // the counter "3 tags".
});
