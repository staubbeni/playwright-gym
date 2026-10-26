// Lesson 05 — Navigation & URLs
// Navigate to the cart and a product page, then verify the login redirect
// for the account page.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 05-navigation
import { expect, test } from "@playwright/test";

test("practice 1: go to the cart", async ({ page }) => {
  await page.goto("/shop");
  // TODO (guided): From /shop click the link whose name contains "Cart", then
  // assert the URL ends with /shop/cart and the heading "Your cart" is
  // visible.
});

test("practice 2: open a product", async ({ page }) => {
  await page.goto("/shop");
  // TODO (independent): Click the product link "Trail Runner Shoes" and assert
  // the URL /shop/products/trail-runner-shoes and the product heading.
});

test("practice 3: protected redirect", async ({ page }) => {
  await page.goto("/shop");
  // TODO (challenge): Open /shop/account while logged out and assert that you
  // are redirected to /shop/login and see the "Sign in" heading.
});
