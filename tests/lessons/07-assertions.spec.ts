// Lesson 07 — Assertions
// Pick the matcher that states the expected state: checked, disabled, value,
// list text, and soft assertions.
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
  // TODO (challenge): add the tags playwright, testing and qa, then try to add
  // "qa" a second time. With expect.soft prove: the tags in order (one
  // toHaveText([...])), the counter "3 tags", and the duplicate message
  // `"qa" already exists.`.
});
