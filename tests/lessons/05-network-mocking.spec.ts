import { expect, test } from "@playwright/test";

test("renders a mocked profile", async ({ page }) => {
  // TODO: intercept the profile request with page.route.
  await page.goto("/lessons/05-network-mocking");

  // TODO: click Load profile and assert the mocked profile name.
});
