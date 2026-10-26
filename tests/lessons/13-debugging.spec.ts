import { expect, test } from "@playwright/test";

test("debugs an asynchronous report", async ({ page }) => {
  await page.goto("/lessons/13-debugging");
  // TODO: run the report and assert the final status.
});
