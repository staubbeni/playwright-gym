import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/shop");
});

test("practice 1: adds one specific product", async ({ page }) => {
  await page
    .getByRole("article")
    .filter({ hasText: "Steel Kettlebell" })
    .getByRole("button", { name: "Add to cart" })
    .click();
  await expect(page.getByTestId("cart-message")).toHaveText("Steel Kettlebell added to cart.");
});

test("practice 2: search narrows the catalog", async ({ page }) => {
  const products = page.getByRole("article");
  const search = page.getByRole("searchbox", { name: "Search products" });

  await search.fill("mat");
  await expect(products).toHaveCount(2);

  await search.fill("kettlebell");
  await expect(products).toHaveCount(1);
  await expect(products.getByRole("heading", { name: "Steel Kettlebell" })).toBeVisible();
});

test("practice 3: splits sale and regular products", async ({ page }) => {
  const products = page.getByRole("article");
  const badge = page.getByText("Sale", { exact: true });

  await expect(products.filter({ has: badge })).toHaveCount(3);
  await expect(products.filter({ hasNot: badge })).toHaveCount(5);
});
