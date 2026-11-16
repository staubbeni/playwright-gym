import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/09-toast");
});

const toasts = (page: import("@playwright/test").Page) => page.getByRole("region", { name: "Notifications" }).getByRole("status");

test("practice 1: the toast appears and then closes", async ({ page }) => {
  await page.getByRole("button", { name: "Save preferences" }).click();
  await expect(toasts(page)).toHaveText("Preferences saved.");
  await expect(toasts(page)).toBeHidden();
});

test("practice 2: stacked toasts arrive in order", async ({ page }) => {
  await page.getByRole("button", { name: "Send 3 emails" }).click();
  await expect(toasts(page)).toHaveText(["Email 1 sent.", "Email 2 sent.", "Email 3 sent."]);
});

test("practice 3: undo restores the draft", async ({ page }) => {
  await page.getByRole("button", { name: "Delete draft" }).click();
  await expect(toasts(page)).toContainText("Draft deleted.");
  await expect(page.getByText("Draft: Weekly plan")).toBeHidden();

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByText("Draft: Weekly plan")).toBeVisible();
  await expect(toasts(page)).toHaveText("Draft restored.");
});
