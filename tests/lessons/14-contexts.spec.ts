import { expect, test } from "@playwright/test";

test("keeps session state explicit", async ({ page }) => {
  await page.goto("/lessons/14-contexts");
  // TODO: save the value and assert the current context state.
});
