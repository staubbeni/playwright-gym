import { expect, test } from "@playwright/test";

test("shows a confirmation toast after saving", async ({ page }) => {
  await page.goto("/lessons/04-toast");

  // TODO: save the preferences.
  // TODO: assert the transient confirmation toast.
});
