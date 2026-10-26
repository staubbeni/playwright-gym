import { test } from "@playwright/test";
test("reaches the protected dashboard", async ({ page }) => {
  await page.goto("/lessons/08-auth-storage");
  // TODO: fill the credentials and sign in.
  // TODO: assert the protected dashboard.
});
