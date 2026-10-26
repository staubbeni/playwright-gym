// Lesson 08 — Auto-waiting & loading
// Wait for the catalog, lazy-loaded reviews, and a stock check, all without
// sleeps.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 08-auto-waiting
import { expect, test } from "@playwright/test";

test("practice 1: wait for the catalog", async ({ page }) => {
  await page.goto("/shop");
  // TODO (guided): Open /shop and assert that 8 product articles appear and
  // that "Loading products..." is hidden.
});

test("practice 2: lazy reviews", async ({ page }) => {
  await page.goto("/shop");
  // TODO (independent): On /shop/products/steel-kettlebell click "Show
  // reviews" and assert the first review says "Solid grip and perfect
  // weight.".
});

test("practice 3: click when enabled", async ({ page }) => {
  await page.goto("/shop");
  // TODO (challenge): On the same product page click "Add to cart" (disabled
  // while stock is checked) and assert the header link shows "Cart (1)". Don't
  // add any waits.
});
