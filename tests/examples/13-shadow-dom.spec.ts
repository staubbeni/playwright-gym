import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/13-shadow-dom");
});

test("practice 1: saves a name inside the component", async ({ page }) => {
  await page.getByLabel("Display name").fill("Grace Hopper");
  await page.getByRole("button", { name: "Save settings" }).click();
  await expect(page.getByTestId("saved-name")).toHaveText("Saved name: Grace Hopper");
});

test("practice 2: saves a theme inside the component", async ({ page }) => {
  await page.getByLabel("Theme").selectOption("Dark");
  await page.getByRole("button", { name: "Save settings" }).click();
  await expect(page.getByTestId("saved-theme")).toHaveText("Saved theme: dark");
});

test("practice 3: the nested avatar shows new initials", async ({ page }) => {
  await page.getByLabel("Display name").fill("Grace Hopper");
  await page.getByRole("button", { name: "Save settings" }).click();
  await expect(page.getByLabel("Avatar")).toHaveText("GH");
});
