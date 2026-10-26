import { expect, test } from "@playwright/test";
test("covers the new foundation exercises", async ({ page }) => {
  await page.goto("/lessons/09-test-anatomy");
  await page.getByRole("button", { name: "Complete action" }).click();
  await expect(page.getByTestId("foundation-result")).toHaveText("Action completed successfully.");
  await page.goto("/lessons/11-locator-strategy");
  await page.getByRole("button", { name: "Reveal message" }).click();
  await expect(page.getByTestId("foundation-result")).toHaveText("Message revealed.");
  await page.goto("/lessons/12-assertions");
  await page.getByRole("checkbox", { name: "Enable notifications" }).check();
  await expect(page.getByRole("checkbox")).toBeChecked();
});
