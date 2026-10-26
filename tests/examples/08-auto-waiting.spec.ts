import { expect, test } from "@playwright/test";

test("practice 1: waits for the catalog to load", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("article")).toHaveCount(8);
  await expect(page.getByText("Loading products...")).toBeHidden();
});

test("practice 2: waits for lazy reviews", async ({ page }) => {
  await page.goto("/shop/products/steel-kettlebell");
  await page.getByRole("button", { name: "Show reviews" }).click();
  const reviews = page.getByRole("list", { name: "Reviews" }).getByRole("listitem");
  await expect(reviews.first()).toHaveText("Solid grip and perfect weight.");
});

test("practice 3: clicks as soon as the button is enabled", async ({ page }) => {
  await page.goto("/shop/products/steel-kettlebell");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByRole("link", { name: /Cart/ })).toHaveText("Cart (1)");
});
