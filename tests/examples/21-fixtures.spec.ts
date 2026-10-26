import { expect, test as base, type Page } from "@playwright/test";
import { CatalogPage } from "./pages/catalog-page";

type Fixtures = {
  catalogPage: CatalogPage;
  accountPage: Page;
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

  seededCart: async ({ page }, use) => {
    await page.request.post("/api/shop/cart", { data: { productId: "whey-protein", quantity: 2 } });
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

test("practice 3: the cart fixture seeds and cleans up", async ({ page, seededCart }) => {
  void seededCart;
  await page.goto("/shop/cart");
  await expect(page.getByLabel("Quantity for Whey Protein")).toHaveValue("2");
});
