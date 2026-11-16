// Lesson 08 — Auto-waiting & loading
// Let Playwright wait for you: catalog loading, lazy reviews, and a sleepy test
// to repair.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 08-auto-waiting
import { expect, test } from "@playwright/test";

test("practice 1: wait for the catalog", async ({ page }) => {
  await page.goto("/shop");
  // TODO (guided): Assert that 8 product articles appear and that "Loading
  // products..." is hidden.
});

test("practice 2: lazy reviews", async ({ page }) => {
  await page.goto("/shop/products/steel-kettlebell");
  // TODO (independent): click "Show reviews" and assert the first review says
  // "Solid grip and perfect weight.".
});

// Practice 3 works, but only because it sleeps and reads the text once. Rewrite
// it with no sleep and no snapshot read.
test("practice 3: replace the sleeps", async ({ page }) => {
  await page.goto("/shop/products/steel-kettlebell");
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.waitForTimeout(1000);
  expect(await page.getByRole("link", { name: /Cart/ }).textContent()).toBe("Cart (1)");
});
