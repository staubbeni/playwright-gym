// Lesson 21 — Custom fixtures
// Write three fixtures: a catalog page object, a logged-in account page, and a
// cart seeded via API with teardown.
//
// Needs your page objects from lesson 20 in tests/solutions/pages/.
//   npm run check -- 21-fixtures
import { expect, test as base, type Page } from "@playwright/test";
import { CatalogPage } from "./pages/catalog-page";

type Fixtures = {
  catalogPage: CatalogPage;
  accountPage: Page;
  seededCart: void;
};

const test = base.extend<Fixtures>({
  catalogPage: async ({ page }, use) => {
    // TODO (guided): create a CatalogPage, open it, and hand it to the test
    // with `await use(catalog)`.
  },

  accountPage: async ({ page }, use) => {
    // TODO (independent): log in via page.request, open /shop/account, then
    // `await use(page)`.
  },

  seededCart: async ({ page }, use) => {
    // TODO (challenge): POST 2 × "whey-protein" to /api/shop/cart, `await use()`,
    // then clean up with page.request.delete("/api/shop/cart").
  }
});

test("practice 1: the catalog fixture is ready to search", async ({ catalogPage }) => {
  // TODO: search "bands" and assert exactly one article: "Resistance Bands".
});

test("practice 2: the account fixture is logged in", async ({ accountPage }) => {
  // TODO: assert "Signed in as student".
});

test("practice 3: the cart fixture seeds and cleans up", async ({ page, seededCart }) => {
  void seededCart;
  // TODO: open /shop/cart and assert the Whey Protein quantity is "2".
});
