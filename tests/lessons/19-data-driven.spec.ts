// Lesson 19 — Data-driven tests
// Drive the catalog search, discount codes, and shipping rules from data
// tables.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 19-data-driven
import { expect, test } from "@playwright/test";

const searches = [
  { term: "mat", count: 2 },
  { term: "kettlebell", count: 1 },
  { term: "protein", count: 1 },
  { term: "zzz", count: 0 }
];

for (const { term, count } of searches) {
  test(`practice 1: search for "${term}" shows ${count} products`, async ({ page }) => {
    await page.goto("/shop");
    // TODO (guided): search for `term` and assert `count` articles. When count
    // is 0 also assert "No products found.".
  });
}

// TODO (independent): build a `codes` table and generate one test per row:
// GYM10 → $134.10, GYM20 → $119.20, BOGUS → alert "Invalid discount code." and $149.00.
// Seed the cart with Adjustable Dumbbell via page.request.post("/api/shop/cart", ...).
// Titles must start with "practice 2:" and be unique.

// TODO (challenge): build a `shipping` table and generate one test per row:
// Hungary $5.00, Germany $8.00, United States $15.00 on /shop/checkout
// (shipping amount has the test id "checkout-shipping").
// Titles must start with "practice 3:".
