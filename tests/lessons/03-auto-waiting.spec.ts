import { expect, test } from "@playwright/test";

test("waits for the report to become ready", async ({ page }) => {
  await page.goto("/lessons/03-auto-waiting");

  // TODO: start loading the report.
  // TODO: assert the final report state without page.waitForTimeout.
});
