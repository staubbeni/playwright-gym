import { expect, test } from "@playwright/test";

test("practice 1: navigates to the cart", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("link", { name: /Cart/ }).click();
  await expect(page).toHaveURL(/\/shop\/cart$/);
  await expect(page.getByRole("heading", { name: "Your cart" })).toBeVisible();
});

test("practice 2: opens a product page", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("link", { name: "Trail Runner Shoes" }).click();
  await expect(page).toHaveURL(/\/shop\/products\/trail-runner-shoes$/);
  await expect(page.getByRole("heading", { name: "Trail Runner Shoes" })).toBeVisible();
});

test("practice 3: redirects anonymous users to the login page", async ({ page }) => {
  await page.goto("/shop/account");
  await expect(page).toHaveURL(/\/shop\/login/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
