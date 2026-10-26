import { test } from "@playwright/test";
test("uses web-first state assertions", async ({ page }) => {
  await page.goto("/lessons/12-assertions");
  // TODO: enable notifications and assert the checkbox and status.
});
