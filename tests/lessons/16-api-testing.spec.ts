import { expect, test } from "@playwright/test";

test("checks the API and user-facing result", async ({ page, request }) => {
  // TODO: use request to check /api/profile.
  await page.goto("/lessons/16-api-testing");
  // TODO: trigger the UI check and assert its result.
});
