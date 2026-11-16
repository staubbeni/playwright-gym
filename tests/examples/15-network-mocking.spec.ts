import { expect, test } from "@playwright/test";

const productsApi = "**/api/shop/products*";

test("practice 1: renders a mocked catalog", async ({ page }) => {
  await page.route(productsApi, (route) =>
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

test("practice 2: shows the error, failure and empty states", async ({ page }) => {
  const alert = page.getByRole("alert").filter({ hasText: "Could not load" });

  await page.route(productsApi, (route) => route.fulfill({ status: 500, json: { error: "boom" } }));
  await page.goto("/shop");
  await expect(alert).toHaveText("Could not load products. Please try again.");

  await page.route(productsApi, (route) => route.abort());
  await page.reload();
  await expect(alert).toHaveText("Could not load products. Please try again.");

  await page.route(productsApi, (route) => route.fulfill({ json: { items: [], total: 0, page: 1, pages: 1 } }));
  await page.reload();
  await expect(page.getByText("No products found.")).toBeVisible();
  await expect(alert).toHaveCount(0);
});

test("practice 3: patches a response and checks the search request", async ({ page }) => {
  await page.route(productsApi, async (route) => {
    const response = await route.fetch();
    const body = await response.json();
    body.items[0].price = 0;
    await route.fulfill({ response, json: body });
  });
  await page.goto("/shop");
  await expect(page.getByRole("article").first().getByText("Free", { exact: true })).toBeVisible();

  const request = page.waitForRequest((req) => new URL(req.url()).searchParams.get("q") === "mat", { timeout: 5_000 });
  await page.getByLabel("Search products").fill("mat");
  await request;
  await expect(page.getByRole("article").first().getByText("Free", { exact: true })).toBeVisible();
});
