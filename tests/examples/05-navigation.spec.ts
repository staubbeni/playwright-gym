import { expect, test } from "@playwright/test";

test("practice 1: navigates to the cart", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("link", { name: /Cart/ }).click();
  await expect(page).toHaveURL(/\/shop\/cart$/);
  await expect(page.getByRole("heading", { name: "Your cart" })).toBeVisible();
});

test("practice 2: moves through history and survives a reload", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("link", { name: "Trail Runner Shoes" }).click();
  await expect(page).toHaveURL(/\/shop\/products\/trail-runner-shoes$/);
  await expect(page.getByRole("heading", { name: "Trail Runner Shoes" })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();

  await page.goForward();
  await expect(page).toHaveURL(/\/shop\/products\/trail-runner-shoes$/);

  await page.reload();
  await expect(page.getByRole("heading", { name: "Trail Runner Shoes" })).toBeVisible();
});

test("practice 3: redirects to login and returns to the account page", async ({ page }) => {
  await page.goto("/shop/account");
  await expect(page).toHaveURL(/\/shop\/login\?next=\/shop\/account/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

  await page.getByLabel("Username").fill("student");
  await page.getByLabel("Password").fill("playwright");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/shop\/account$/);
  await expect(page.getByRole("heading", { name: "My account" })).toBeVisible();
});
