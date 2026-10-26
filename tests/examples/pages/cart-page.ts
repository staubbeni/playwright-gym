import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly total: Locator;
  readonly discountCode: Locator;

  constructor(private readonly page: Page) {
    this.total = page.getByTestId("cart-total");
    this.discountCode = page.getByLabel("Discount code");
  }

  async goto() {
    await this.page.goto("/shop/cart");
  }

  quantity(name: string): Locator {
    return this.page.getByLabel(`Quantity for ${name}`, { exact: true });
  }

  async setQuantity(name: string, quantity: number) {
    await this.quantity(name).fill(String(quantity));
  }

  async applyDiscount(code: string) {
    await this.discountCode.fill(code);
    await this.page.getByRole("button", { name: "Apply" }).click();
  }
}
