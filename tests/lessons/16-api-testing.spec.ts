// Lesson 16 — API testing
// Check the products contract, seed a cart through the API, and pin down the
// error responses.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 16-api-testing
import { expect, test } from "@playwright/test";

test("practice 1: get and assert json", async ({ request }) => {
  // TODO (guided): GET the product list with request.get(). Prove the contract:
  // success status, the right total, and that the Steel Kettlebell is in it.
  // Hint: expect(body.items).toContainEqual(expect.objectContaining({ ... }))
});

test("practice 2: seed via api, verify in ui", async ({ page }) => {
  // TODO (independent): put two Yoga Mats in the cart with page.request (it
  // shares cookies with the page, `request` does not!), then open the cart
  // page and prove the UI shows that quantity and the matching total.
});

test("practice 3: negative contract", async ({ request }) => {
  // TODO (challenge): a wrong password, an unknown product added to the cart,
  // and a product page for an unknown id each answer with their own status and
  // error body: assert all three. Then assert a valid login and a real
  // product are OK (expect(response).toBeOK()) and have the right shape
  // (toMatchObject).
});
