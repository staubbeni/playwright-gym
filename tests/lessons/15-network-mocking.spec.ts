// Lesson 15 — Network mocking
// Render a mocked catalog, drive three failure states, and prove what the page
// sends to the API.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 15-network-mocking
import { expect, test } from "@playwright/test";

test("practice 1: fulfill with json", async ({ page }) => {
  // TODO (guided): answer the products API yourself so the catalog shows exactly
  // one product, "Mocked Dumbbell". Prove that's all the page shows.
  // Register the route BEFORE page.goto("/shop").
  await page.goto("/shop");
});

test("practice 2: three failure states", async ({ page }) => {
  // TODO (independent): prove the page's reaction to (1) a 500 response, (2) a
  // network failure, and (3) an empty list.
  // Hint: a later page.route() for the same URL wins, so re-route and reload.
  await page.goto("/shop");
});

test("practice 3: patch a response, check the request", async ({ page }) => {
  // TODO (challenge): use route.fetch() to make the first item's price 0 and
  // prove the page shows it as free. Then type "mat" in the search box and
  // prove the page asked the API for that query (page.waitForRequest, started
  // BEFORE the typing) and that the free item is still shown.
  await page.goto("/shop");
});
