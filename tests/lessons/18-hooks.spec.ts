// Lesson 18 — Hooks & organization
// Structure cart tests with hooks, tag a smoke test, and attach a screenshot
// after each failing test.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 18-hooks
import { expect, test } from "@playwright/test";

test.describe("practice 1: cart", () => {
  // TODO (guided): add a test.beforeEach that opens /shop.

  test("starts empty", async ({ page }) => {
    // TODO: prove a new shopper's cart is empty (header link).
  });

  test("counts an added item", async ({ page }) => {
    // TODO: add "Steel Kettlebell" and prove the header counts one item.
  });
});

// TODO (independent): tag this test with { tag: "@smoke" } (second argument).
// `npx playwright test --grep @smoke` must run this test and nothing else.
test("practice 2: checkout is reachable", async ({ page }) => {
  // Put an item in the cart (page.request.post("/api/shop/cart", ...) is
  // quickest), open /shop/cart, click through to checkout and prove you
  // landed on the checkout page.
});

test.describe("practice 3: removing items", () => {
  // TODO (challenge): add a test.afterEach(async ({ page }, testInfo) => ...)
  // that attaches page.screenshot() with testInfo.attach(), but only when the
  // test failed: testInfo.status !== testInfo.expectedStatus.

  test("removes one item at a time", async ({ page }) => {
    // Add Steel Kettlebell and Yoga Mat, remove the kettlebell and prove only
    // the mat is left, then remove the mat and prove the cart is empty.
  });
});
