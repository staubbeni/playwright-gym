// Lesson 06 — Locator strategy
// Scope actions to one card, count what a search returns, and split the catalog
// into sale and regular products.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 06-locator-strategy
import { expect, test } from "@playwright/test";

test("practice 1: add one specific product", async ({ page }) => {
  await page.goto("/shop");
  // TODO (guided): add "Steel Kettlebell" to the cart and assert the message
  // "Steel Kettlebell added to cart.". Scope the button to its card.
});

test("practice 2: search narrows the catalog", async ({ page }) => {
  await page.goto("/shop");
  // TODO (independent): search "mat": exactly 2 products. Search "kettlebell":
  // exactly 1 product, with the heading "Steel Kettlebell".
});

test("practice 3: sale and not on sale", async ({ page }) => {
  await page.goto("/shop");
  // TODO (challenge): of the 8 products on the first page, exactly 3 have the
  // "Sale" badge and exactly 5 don't. Use filter({ has }) and filter({ hasNot }).
});
