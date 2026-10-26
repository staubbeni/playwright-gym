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

test("practice 2: counts search results", async ({ page }) => {
  await page.getByRole("searchbox", { name: "Search products" }).fill("mat");
  await expect(page.getByRole("article")).toHaveCount(2);
});

test("practice 3: counts products on sale", async ({ page }) => {
  const onSale = page.getByRole("article").filter({ has: page.getByText("Sale", { exact: true }) });
  await expect(onSale).toHaveCount(3);
});
