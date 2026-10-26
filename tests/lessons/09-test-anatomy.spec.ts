import { test } from "@playwright/test";
test("has a clear arrange act assert flow", async ({ page }) => {
  await page.goto("/lessons/09-test-anatomy");
  // TODO: perform the action and assert its result.
});
