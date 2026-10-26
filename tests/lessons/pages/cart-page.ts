// Page object for /shop/cart (lesson 20).
import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly total: Locator;

  constructor(private readonly page: Page) {
    this.total = page.getByTestId("cart-total");
  }

  async goto() {
    await this.page.goto("/shop/cart");
  }

  async setQuantity(name: string, quantity: number) {
    // TODO: fill the input labelled `Quantity for ${name}`.
  }

  async applyDiscount(code: string) {
    // TODO: fill "Discount code" and click "Apply".
  }
}
