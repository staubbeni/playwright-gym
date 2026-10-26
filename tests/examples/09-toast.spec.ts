import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/09-toast");
});

test("practice 1: shows a confirmation toast", async ({ page }) => {
  await page.getByRole("button", { name: "Save preferences" }).click();
  const toast = page.getByRole("region", { name: "Notifications" }).getByRole("status");
  await expect(toast).toHaveText("Preferences saved.");
});

test("practice 2: the toast disappears on its own", async ({ page }) => {
  await page.getByRole("button", { name: "Save preferences" }).click();
  const toast = page.getByRole("region", { name: "Notifications" }).getByRole("status");
  await expect(toast).toBeVisible();
  await expect(toast).toBeHidden();
});

test("practice 3: undo restores the deleted draft", async ({ page }) => {
  await page.getByRole("button", { name: "Delete draft" }).click();
  await expect(page.getByText("Draft: Weekly plan")).toBeHidden();
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByText("Draft: Weekly plan")).toBeVisible();
});
