// Lesson 20 — Page Object Model
// Complete CatalogPage and CartPage, then refactor a long raw-locator test
// onto them.
//
// Copy this file AND the pages/ folder before editing:
//   cp -r tests/lessons/20-page-objects.spec.ts tests/lessons/pages tests/solutions/
//   npm run check -- 20-page-objects
import { expect, test } from "@playwright/test";
import { CartPage } from "./pages/cart-page";
import { CatalogPage } from "./pages/catalog-page";

test("practice 1: catalogpage", async ({ page }) => {
  const catalog = new CatalogPage(page);
  await catalog.goto();
  // TODO (guided): add "Yoga Mat" with catalog.addToCart() and assert
  // catalog.cartLink has the text "Cart (1)".
});

test("practice 2: cartpage", async ({ page }) => {
  const catalog = new CatalogPage(page);
  const cart = new CartPage(page);
  // TODO (independent): add "Yoga Mat", open the cart, set its quantity to 3,
  // and assert cart.total is "$87.00".
});

// TODO (challenge): this test passes, but it is all raw locators. Rewrite the
// body with CatalogPage and CartPage (extend them where needed) and keep every
// assertion. No page.getBy…/page.locator() may be left in the body.
test("practice 3: buys a discounted bundle", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("searchbox", { name: "Search products" }).fill("Adjustable Dumbbell");
  await page.getByRole("article", { name: "Adjustable Dumbbell", exact: true }).getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByTestId("cart-message")).toHaveText("Adjustable Dumbbell added to cart.");
  await page.getByRole("searchbox", { name: "Search products" }).fill("Yoga Mat");
  await page.getByRole("article", { name: "Yoga Mat", exact: true }).getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByTestId("cart-message")).toHaveText("Yoga Mat added to cart.");
  await expect(page.getByRole("link", { name: /^Cart/ })).toHaveText("Cart (2)");

  await page.goto("/shop/cart");
  await expect(page.getByTestId("cart-total")).toHaveText("$178.00");
  await page.getByLabel("Quantity for Yoga Mat", { exact: true }).fill("2");
  await expect(page.getByTestId("cart-total")).toHaveText("$207.00");

  await page.getByLabel("Discount code").fill("GYM10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByTestId("cart-subtotal")).toHaveText("$207.00");
  await expect(page.getByTestId("cart-discount")).toHaveText("-$20.70");
  await expect(page.getByTestId("cart-total")).toHaveText("$186.30");
});
