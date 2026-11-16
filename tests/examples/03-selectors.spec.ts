import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/03-selectors");
});

test("practice 1: completes the action", async ({ page }) => {
  await page.getByRole("button", { name: "Complete action" }).click();
  await expect(page.getByRole("status").filter({ hasText: /Action|Waiting/ })).toHaveText("Action completed successfully.");
});

test("practice 2: opens settings and searches without CSS", async ({ page }) => {
  await page.getByRole("button", { name: "Open settings" }).click();
  await expect(page.getByRole("region", { name: "Settings panel" })).toBeVisible();

  await page.getByPlaceholder("Search lessons").fill("locators");
  await expect(page.getByTestId("search-echo")).toHaveText("Showing results for: locators");
});

test("practice 3: tells Save apart from Save as draft", async ({ page }) => {
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByTestId("save-result")).toHaveText("Document saved.");

  await page.getByRole("button", { name: "Save as draft" }).click();
  await expect(page.getByTestId("save-result")).toHaveText("Saved as draft.");
});
