import { expect, test } from "@playwright/test";

test.describe("practice 1: cart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shop");
  });

  test("starts empty", async ({ page }) => {
    await expect(page.getByRole("link", { name: /^Cart/ })).toHaveText("Cart (0)");
  });

  test("counts an added item", async ({ page }) => {
    await page.getByRole("article", { name: "Steel Kettlebell" }).getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByRole("link", { name: /^Cart/ })).toHaveText("Cart (1)");
  });
});

test("practice 2: checkout is reachable", { tag: "@smoke" }, async ({ page }) => {
  await page.request.post("/api/shop/cart", { data: { productId: "yoga-mat" } });
  await page.goto("/shop/cart");
  await page.getByRole("link", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/shop\/checkout$/);
  await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
});

test.describe("practice 3: removing items", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach("cart", { body: await page.screenshot(), contentType: "image/png" });
    }
  });

  test("removes one item at a time", async ({ page }) => {
    await page.request.post("/api/shop/cart", { data: { productId: "steel-kettlebell" } });
    await page.request.post("/api/shop/cart", { data: { productId: "yoga-mat" } });
    await page.goto("/shop/cart");
    await page.getByRole("button", { name: "Remove Steel Kettlebell" }).click();
    await expect(page.getByRole("row", { name: /Steel Kettlebell/ })).toHaveCount(0);
    await expect(page.getByRole("row", { name: /Yoga Mat/ })).toBeVisible();
    await page.getByRole("button", { name: "Remove Yoga Mat" }).click();
    await expect(page.getByText("Your cart is empty.")).toBeVisible();
  });
});
