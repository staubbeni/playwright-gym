// Lesson 21 — Custom fixtures
// Write three fixtures: a catalog page object, a logged-in account page, and a
// cart seeded via API with teardown, driven by an option fixture.
//
// Needs your page objects from lesson 20 in tests/solutions/pages/.
//   npm run check -- 21-fixtures
import { expect, test as base, type Page } from "@playwright/test";
import { CatalogPage } from "./pages/catalog-page";

type Seed = { productId: string; quantity: number };

type Fixtures = {
  catalogPage: CatalogPage;
  accountPage: Page;
  seed: Seed;
  seededCart: void;
};

const test = base.extend<Fixtures>({
  catalogPage: async ({ page }, use) => {
    // TODO (guided): create a CatalogPage, open it, and hand it to the test
    // with `await use(catalog)`.
  },

  accountPage: async ({ page }, use) => {
    // TODO (independent): sign the student in via page.request (see lesson 17
    // for the endpoint), open the account page, then `await use(page)`.
  },

  // TODO (challenge): turn this into an option fixture: [value, { option: true }].
  seed: { productId: "whey-protein", quantity: 2 },

  seededCart: async ({ page, seed }, use) => {
    // TODO (challenge): POST `seed` to /api/shop/cart, `await use()`, then
    // clean up with page.request.delete("/api/shop/cart").
  }
});

test("practice 1: the catalog fixture is ready to search", async ({ catalogPage }) => {
  // TODO: search for resistance bands and prove exactly one product is listed
  // and that it is the right one.
});

test("practice 2: the account fixture is logged in", async ({ accountPage }) => {
  // TODO: prove the page says who is signed in.
});

test.describe("practice 3: seeded cart", () => {
  // TODO (challenge): test.use({ seed: ... }) to seed 3 × "resistance-bands".

  test("shows the seeded quantity", async ({ page, seededCart }) => {
    void seededCart;
    // TODO: open the cart and prove it holds three bands: the quantity field
    // and the header count.
  });
});
