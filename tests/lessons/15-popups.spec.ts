import { expect, test } from "@playwright/test";

test("handles a payment popup", async ({ page }) => {
  await page.goto("/lessons/15-popups");
  // TODO: wait for the popup before clicking, then assert its heading.
});
