// Lesson 06 — Locator strategy
// Add one specific product to the cart, count search results, and count sale
// items.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 06-locator-strategy
import { expect, test } from "@playwright/test";

test("practice 1: add one specific product", async ({ page }) => {
  await page.goto("/shop");
  // TODO (guided): On /shop add "Steel Kettlebell" to the cart and assert the
  // message "Steel Kettlebell added to cart.".
});

test("practice 2: count search results", async ({ page }) => {
  await page.goto("/shop");
  // TODO (independent): Search for "mat" in the "Search products" field and
  // assert that exactly 2 product articles are shown.
});

test("practice 3: filter by a child element", async ({ page }) => {
  await page.goto("/shop");
  // TODO (challenge): Assert that exactly 3 products on the first page carry a
  // "Sale" badge, using filter({ has }).
});
