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
  await expect(page.getByRole("link", { name: "Checkout" })).toBeVisible();
});

test.describe("practice 3: removing items", () => {
  test.afterEach(async ({ page }, testInfo) => {
    await testInfo.attach("cart", { body: await page.screenshot(), contentType: "image/png" });
  });

  test("empties the cart", async ({ page }) => {
    await page.request.post("/api/shop/cart", { data: { productId: "yoga-mat" } });
    await page.goto("/shop/cart");
    await page.getByRole("button", { name: "Remove Yoga Mat" }).click();
    await expect(page.getByText("Your cart is empty.")).toBeVisible();
  });
});
