import { expect, test } from "@playwright/test";

const searches = [
  { term: "mat", count: 2 },
  { term: "kettlebell", count: 1 },
  { term: "protein", count: 1 },
  { term: "zzz", count: 0 }
];

for (const { term, count } of searches) {
  test(`practice 1: search for "${term}" shows ${count} products`, async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("searchbox", { name: "Search products" }).fill(term);
    await expect(page.getByRole("article")).toHaveCount(count);
    if (count === 0) await expect(page.getByText("No products found.")).toBeVisible();
  });
}

const codes = [
  { code: "GYM10", total: "$134.10" },
  { code: "GYM20", total: "$119.20" },
  { code: "BOGUS", total: "$149.00", error: "Invalid discount code." }
];

for (const { code, total, error } of codes) {
  test(`practice 2: discount code ${code} gives ${total}`, async ({ page }) => {
    await page.request.post("/api/shop/cart", { data: { productId: "adjustable-dumbbell" } });
    await page.goto("/shop/cart");
    await page.getByLabel("Discount code").fill(code);
    await page.getByRole("button", { name: "Apply" }).click();
    if (error) await expect(page.getByRole("alert").filter({ hasText: error })).toBeVisible();
    else await expect(page.getByText(`Code ${code} applied.`)).toBeVisible();
    await expect(page.getByTestId("cart-total")).toHaveText(total);
  });
}

const shipping = [
  { country: "Hungary", cost: "$5.00" },
  { country: "Germany", cost: "$8.00" },
  { country: "United States", cost: "$15.00" }
];

for (const { country, cost } of shipping) {
  test(`practice 3: shipping to ${country} costs ${cost}`, async ({ page }) => {
    await page.goto("/shop/checkout");
    await page.getByLabel("Country").selectOption({ label: country });
    await expect(page.getByTestId("checkout-shipping")).toHaveText(cost);
  });
}
