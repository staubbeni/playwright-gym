// Lesson 15 — Network mocking
// Render a mocked catalog, show the error state for a 500, and display a
// free product.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 15-network-mocking
import { expect, test } from "@playwright/test";

test("practice 1: fulfill with json", async ({ page }) => {
  await page.goto("/shop");
  // TODO (guided): Mock the products API with one product named "Mocked
  // Dumbbell" and assert that exactly one article with that name is shown.
});

test("practice 2: server error", async ({ page }) => {
  await page.goto("/shop");
  // TODO (independent): Fulfill the products API with status 500 and assert
  // the alert "Could not load products. Please try again.".
});

test("practice 3: modify a real response", async ({ page }) => {
  await page.goto("/shop");
  // TODO (challenge): Use route.fetch() and set the first item's price to 0.
  // Assert that the product shows the price "Free".
});
