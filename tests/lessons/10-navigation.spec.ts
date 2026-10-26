import { test } from "@playwright/test";
test("verifies navigation", async ({ page }) => {
  await page.goto("/lessons/10-navigation");
  // TODO: click the link and assert the destination URL.
});
