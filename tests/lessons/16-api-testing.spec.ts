// Lesson 16 — API testing
// Check the products endpoint, seed a cart through the API, and verify login
// error responses.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 16-api-testing
import { expect, test } from "@playwright/test";

test("practice 1: get and assert json", async ({ request }) => {
  // TODO (guided): GET /api/shop/products with request.get(). Assert status 200,
  // total 12, and that some item is named "Steel Kettlebell".
  // Hint: expect(body.items).toContainEqual(expect.objectContaining({ ... }))
});

test("practice 2: seed via api, verify in ui", async ({ page }) => {
  // TODO (independent): POST { productId: "yoga-mat", quantity: 2 } to
  // /api/shop/cart with page.request (it shares cookies with page!), then open
  // /shop/cart and assert quantity 2 and the total "$58.00".
});

test("practice 3: negative api test", async ({ request }) => {
  // TODO (challenge): POST wrong credentials to /api/shop/login → 401 and
  // { error: "Invalid username or password." }; student / playwright → 200.
});
