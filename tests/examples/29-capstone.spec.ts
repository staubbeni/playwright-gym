import { expect, test as base, type Page } from "@playwright/test";
import { CartPage } from "./pages/cart-page";
import { CatalogPage } from "./pages/catalog-page";

const test = base.extend<{ catalog: CatalogPage; cart: CartPage }>({
  catalog: async ({ page }, use) => {
    const catalog = new CatalogPage(page);
    await catalog.goto();
    await use(catalog);
  },
  cart: async ({ page }, use) => {
    await use(new CartPage(page));
  }
});

async function seedCart(page: Page, productId: string, quantity = 1) {
  const response = await page.request.post("/api/shop/cart", { data: { productId, quantity } });
  expect(response.status()).toBe(201);
}

async function fillCheckout(page: Page, email: string) {
  await page.goto("/shop/checkout");
  await page.getByLabel("Full name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Address").fill("1 Engine Street");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Place order" }).click();
}

test.describe("catalog", () => {
  test("search narrows the list", async ({ catalog }) => {
    await catalog.searchFor("kettlebell");
    await expect(catalog.products).toHaveCount(1);
    await expect(catalog.products).toContainText("Steel Kettlebell");
  });

  test("product page shows name and price", async ({ page }) => {
    await page.goto("/shop/products/steel-kettlebell");
    await expect(page.getByRole("heading", { name: "Steel Kettlebell" })).toBeVisible();
    await expect(page.getByTestId("product-price")).toHaveText("$39.99");
  });
});

test.describe("cart", () => {
  test("quantity changes update the total", async ({ page, cart }) => {
    await seedCart(page, "yoga-mat");
    await cart.goto();
    await cart.setQuantity("Yoga Mat", 3);
    await expect(cart.total).toHaveText("$87.00");
  });

  test("GYM10 takes 10% off", async ({ page, cart }) => {
    await seedCart(page, "adjustable-dumbbell");
    await cart.goto();
    await cart.applyDiscount("GYM10");
    await expect(cart.total).toHaveText("$134.10");
  });

  test("adding from the catalog updates the header", async ({ catalog }) => {
    await catalog.addToCart("Steel Kettlebell");
    await expect(catalog.cartLink).toHaveText("Cart (1)");
  });
});

test.describe("checkout", () => {
  test("rejects an invalid email", async ({ page }) => {
    await seedCart(page, "yoga-mat");
    await fillCheckout(page, "not-an-email");
    await expect(page.getByRole("alert").filter({ hasText: "email" })).toHaveText("Enter a valid email address.");
    await expect(page).toHaveURL(/\/shop\/checkout$/);
  });

  test("confirms a valid order with its number", async ({ page }) => {
    await seedCart(page, "yoga-mat");
    await fillCheckout(page, "ada@example.com");
    await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
    await expect(page.getByText(/^Order number: GYM-\d+$/)).toBeVisible();
  });
});

test.describe("account", () => {
  test("wrong credentials are rejected", async ({ page }) => {
    await page.goto("/shop/login");
    await page.getByLabel("Username").fill("student");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Invalid" })).toHaveText("Invalid username or password.");
    await expect(page).toHaveURL(/\/shop\/login/);
  });

  test("saving settings shows a confirmation", async ({ page }) => {
    await page.request.post("/api/shop/login", { data: { username: "student", password: "playwright" } });
    await page.goto("/shop/account");
    await page.getByRole("switch", { name: "Newsletter" }).check();
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByRole("region", { name: "Notifications" }).getByRole("status")).toHaveText("Settings saved.");
  });
});
