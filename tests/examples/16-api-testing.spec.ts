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

test("practice 3: login rejects wrong credentials", async ({ request }) => {
  const wrong = await request.post("/api/shop/login", { data: { username: "student", password: "nope" } });
  expect(wrong.status()).toBe(401);
  expect(await wrong.json()).toEqual({ error: "Invalid username or password." });

  const right = await request.post("/api/shop/login", { data: { username: "student", password: "playwright" } });
  expect(right.status()).toBe(200);
  expect((await right.json()).username).toBe("student");
});
