import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/13-shadow-dom");
});

test("practice 1: saves a name inside the component", async ({ page }) => {
  await page.getByLabel("Display name").fill("Grace Hopper");
  await page.getByRole("button", { name: "Save settings" }).click();
  await expect(page.getByTestId("saved-name")).toHaveText("Saved name: Grace Hopper");
});

test("practice 2: saves the name and the theme in one go", async ({ page }) => {
  await page.getByLabel("Theme").selectOption("Dark");
  await page.getByLabel("Display name").fill("Grace Hopper");
  await page.getByRole("button", { name: "Save settings" }).click();
  await expect(page.getByTestId("saved-name")).toHaveText("Saved name: Grace Hopper");
  await expect(page.getByTestId("saved-theme")).toHaveText("Saved theme: dark");
});

test("practice 3: the nested avatar follows the name", async ({ page }) => {
  const save = page.getByRole("button", { name: "Save settings" });

  await page.getByLabel("Display name").fill("Grace Hopper");
  await save.click();
  await expect(page.getByLabel("Avatar")).toHaveText("GH");

  await page.getByLabel("Display name").fill("Plato");
  await save.click();
  await expect(page.getByLabel("Avatar")).toHaveText("P");
});
