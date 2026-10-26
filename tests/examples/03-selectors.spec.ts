import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/03-selectors");
});

test("practice 1: completes the action", async ({ page }) => {
  await page.getByRole("button", { name: "Complete action" }).click();
  await expect(page.getByRole("status")).toHaveText("Action completed successfully.");
});

test("practice 2: opens settings with the icon button", async ({ page }) => {
  await page.getByRole("button", { name: "Open settings" }).click();
  await expect(page.getByRole("region", { name: "Settings panel" })).toBeVisible();
});

test("practice 3: searches through the placeholder field", async ({ page }) => {
  await page.getByPlaceholder("Search lessons").fill("locators");
  await expect(page.getByTestId("search-echo")).toHaveText("Showing results for: locators");
});
