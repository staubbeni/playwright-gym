import { expect, test } from "@playwright/test";

test("completes the selectors action", async ({ page }) => {
  await page.goto("/lessons/01-selectors");
  // TODO: locate and click the Complete action button.
  // TODO: assert that the success message is visible.
});
