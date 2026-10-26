// Lesson 20 — Page Object Model
// Complete CatalogPage and CartPage and use them for single actions and a full
// purchase flow.
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

test("practice 3: full flow", async ({ page }) => {
  // TODO (challenge): add Adjustable Dumbbell and Yoga Mat, apply GYM10, and
  // assert the total "$160.20".
});
