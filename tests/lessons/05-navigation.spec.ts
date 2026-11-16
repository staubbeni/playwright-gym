// Lesson 05 — Navigation & URLs
// Navigate to the cart, move through history, and test the login redirect.
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

test("practice 2: back, forward and reload", async ({ page }) => {
  await page.goto("/shop");
  // TODO (independent): open "Trail Runner Shoes" and assert its URL and
  // heading. Go back (assert the catalog), go forward, reload and assert the
  // product page is still there.
  // Hint: goBack / goForward / reload don't wait for the UI: assert after each.
});

test("practice 3: protected page and ?next=", async ({ page }) => {
  // TODO (challenge): open /shop/account while logged out. Assert you are sent
  // to /shop/login and the URL has ?next=/shop/account. Sign in as student /
  // playwright and assert you land back on "My account".
  // Hint: toHaveURL(/\/shop\/login\?next=/)
});
