import { expect, test } from "@playwright/test";
import { CartPage } from "./pages/cart-page";
import { CatalogPage } from "./pages/catalog-page";

test("practice 1: adds a product through the catalog page object", async ({ page }) => {
  const catalog = new CatalogPage(page);
  await catalog.goto();
  await catalog.addToCart("Yoga Mat");
  await expect(catalog.cartLink).toHaveText("Cart (1)");
});

test("practice 2: changes a quantity through the cart page object", async ({ page }) => {
  const catalog = new CatalogPage(page);
  const cart = new CartPage(page);
  await catalog.goto();
  await catalog.addToCart("Yoga Mat");
  await cart.goto();
  await cart.setQuantity("Yoga Mat", 3);
  await expect(cart.total).toHaveText("$87.00");
});

test("practice 3: completes a discounted purchase flow", async ({ page }) => {
  const catalog = new CatalogPage(page);
  const cart = new CartPage(page);
  await catalog.goto();
  await catalog.addToCart("Adjustable Dumbbell");
  await catalog.addToCart("Yoga Mat");
  await cart.goto();
  await cart.applyDiscount("GYM10");
  await expect(cart.total).toHaveText("$160.20");
});
