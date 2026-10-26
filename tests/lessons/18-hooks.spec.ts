// Lesson 18 — Hooks & organization
// Structure cart tests with hooks, tag a smoke test, and attach a screenshot
// after each test.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 18-hooks
import { expect, test } from "@playwright/test";

test.describe("practice 1: cart", () => {
  // TODO (guided): add a test.beforeEach that opens /shop.

  test("starts empty", async ({ page }) => {
    // TODO: assert the header link text "Cart (0)".
  });

  test("counts an added item", async ({ page }) => {
    // TODO: add "Steel Kettlebell" and assert "Cart (1)".
  });
});

// TODO (independent): tag this test with { tag: "@smoke" } (second argument).
test("practice 2: checkout is reachable", async ({ page }) => {
  // Add an item (page.request.post("/api/shop/cart", ...) is quickest), open
  // /shop/cart, and assert the "Checkout" link is visible.
});

test.describe("practice 3: removing items", () => {
  // TODO (challenge): add a test.afterEach(async ({ page }, testInfo) => ...)
  // that attaches page.screenshot() with testInfo.attach().

  test("empties the cart", async ({ page }) => {
    // Add an item, open the cart, remove it, and assert "Your cart is empty."
  });
});
