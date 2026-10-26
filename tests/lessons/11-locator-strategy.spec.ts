import { test } from "@playwright/test";
test("uses a resilient locator", async ({ page }) => {
  await page.goto("/lessons/11-locator-strategy");
  // TODO: reveal and assert the message using a semantic locator.
});
