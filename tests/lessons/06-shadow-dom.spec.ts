import { test } from "@playwright/test";

test("updates the shadow DOM display name", async ({ page }) => {
  await page.goto("/lessons/06-shadow-dom");

  // TODO: fill the shadow DOM input through its accessible label.
  // TODO: submit the form and assert the saved name.
});
