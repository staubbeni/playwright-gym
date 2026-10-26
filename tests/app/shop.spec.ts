import { expect, test } from "@playwright/test";

test("browser contexts get separate carts", async ({ page, browser }) => {
  await page.request.post("/api/shop/cart", { data: { productId: "yoga-mat", quantity: 2 } });

  const other = await browser.newContext();
  const otherCart = await (await other.request.get("/api/shop/cart")).json();
  expect(otherCart.count).toBe(0);
  await other.close();

  const cart = await (await page.request.get("/api/shop/cart")).json();
  expect(cart).toMatchObject({ count: 2, total: 58 });
});

test("the products API filters, sorts, and paginates", async ({ request }) => {
  const firstPage = await (await request.get("/api/shop/products")).json();
  expect(firstPage).toMatchObject({ total: 12, page: 1, pages: 2 });
  expect(firstPage.items).toHaveLength(8);

  const cheapest = await (await request.get("/api/shop/products?sort=price-asc&category=Nutrition")).json();
  expect(cheapest.items.map((item: { name: string }) => item.name)).toEqual(["Electrolyte Mix", "Energy Bar Box", "Whey Protein"]);
});

test("a full purchase works end to end", async ({ page }) => {
  await page.request.post("/api/shop/cart", { data: { productId: "steel-kettlebell" } });
  await page.goto("/shop/checkout");
  await page.getByLabel("Full name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Address").fill("1 Engine Street");
  await page.getByLabel("Country").selectOption({ label: "Germany" });
  await page.getByRole("radio", { name: /Express/ }).check();
  await expect(page.getByTestId("checkout-total")).toHaveText("$57.99");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Place order" }).click();
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
  await expect(page.getByText("Total paid: $57.99")).toBeVisible();

  await page.getByRole("link", { name: "View all orders" }).click();
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
});

test("reset clears the session", async ({ page }) => {
  await page.request.post("/api/shop/cart", { data: { productId: "yoga-mat" } });
  await page.request.post("/api/shop/reset");
  expect((await (await page.request.get("/api/shop/cart")).json()).count).toBe(0);
});
