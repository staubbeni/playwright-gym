import { expect, test } from "@playwright/test";

test("practice 1: lists products through the API", async ({ request }) => {
  const response = await request.get("/api/shop/products");
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.total).toBe(12);
  expect(body.items).toContainEqual(expect.objectContaining({ name: "Steel Kettlebell" }));
});

test("practice 2: a cart seeded via the API shows in the UI", async ({ page }) => {
  const response = await page.request.post("/api/shop/cart", { data: { productId: "yoga-mat", quantity: 2 } });
  expect(response.status()).toBe(201);

  await page.goto("/shop/cart");
  await expect(page.getByLabel("Quantity for Yoga Mat")).toHaveValue("2");
  await expect(page.getByTestId("cart-total")).toHaveText("$58.00");
});

test("practice 3: pins down the error contract", async ({ request }) => {
  const wrong = await request.post("/api/shop/login", { data: { username: "student", password: "nope" } });
  expect(wrong.status()).toBe(401);
  expect(await wrong.json()).toEqual({ error: "Invalid username or password." });

  const unknown = await request.post("/api/shop/cart", { data: { productId: "no-such-thing" } });
  expect(unknown.status()).toBe(400);
  expect(await unknown.json()).toEqual({ error: "Unknown product." });

  const missing = await request.get("/api/shop/products/no-such-thing");
  expect(missing.status()).toBe(404);
  expect(await missing.json()).toEqual({ error: "Product not found." });

  const login = await request.post("/api/shop/login", { data: { username: "student", password: "playwright" } });
  await expect(login).toBeOK();
  expect(await login.json()).toMatchObject({ username: "student" });

  const product = await request.get("/api/shop/products/yoga-mat");
  await expect(product).toBeOK();
  expect(await product.json()).toMatchObject({ id: "yoga-mat", name: "Yoga Mat", price: 29, inStock: true });
});
