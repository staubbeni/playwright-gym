import { expect, test } from "@playwright/test";

test("practice 1: renders a mocked catalog", async ({ page }) => {
  await page.route("**/api/shop/products*", (route) =>
    route.fulfill({
      json: {
        items: [{ id: "mocked-dumbbell", name: "Mocked Dumbbell", price: 9.99, category: "Equipment", sale: false }],
        total: 1,
        page: 1,
        pages: 1
      }
    })
  );
  await page.goto("/shop");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByRole("article", { name: "Mocked Dumbbell" })).toBeVisible();
});

test("practice 2: shows an error when the API fails", async ({ page }) => {
  await page.route("**/api/shop/products*", (route) => route.fulfill({ status: 500, json: { error: "boom" } }));
  await page.goto("/shop");
  await expect(page.getByRole("alert").filter({ hasText: "Could not load" })).toHaveText(
    "Could not load products. Please try again."
  );
});

test("practice 3: shows a free product", async ({ page }) => {
  await page.route("**/api/shop/products*", async (route) => {
    const response = await route.fetch();
    const body = await response.json();
    body.items[0].price = 0;
    await route.fulfill({ response, json: body });
  });
  await page.goto("/shop");
  await expect(page.getByRole("article").first().getByText("Free", { exact: true })).toBeVisible();
});
