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
    const catalog = new CatalogPage(page);
    await catalog.goto();
    await use(catalog);
  },

  accountPage: async ({ page }, use) => {
    await page.request.post("/api/shop/login", { data: { username: "student", password: "playwright" } });
    await page.goto("/shop/account");
    await use(page);
  },

  seed: [{ productId: "whey-protein", quantity: 2 }, { option: true }],

  seededCart: async ({ page, seed }, use) => {
    await page.request.post("/api/shop/cart", { data: seed });
    await use();
    await page.request.delete("/api/shop/cart");
  }
});

test("practice 1: the catalog fixture is ready to search", async ({ catalogPage }) => {
  await catalogPage.searchFor("bands");
  await expect(catalogPage.products).toHaveCount(1);
  await expect(catalogPage.products).toContainText("Resistance Bands");
});

test("practice 2: the account fixture is logged in", async ({ accountPage }) => {
  await expect(accountPage.getByText("Signed in as student")).toBeVisible();
});

test.describe("practice 3: seeded cart", () => {
  test.use({ seed: { productId: "resistance-bands", quantity: 3 } });

  test("shows the seeded quantity", async ({ page, seededCart }) => {
    void seededCart;
    await page.goto("/shop/cart");
    await expect(page.getByLabel("Quantity for Resistance Bands")).toHaveValue("3");
    await expect(page.getByRole("link", { name: /^Cart/ })).toHaveText("Cart (3)");
  });
});
