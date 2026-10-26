import { expect, type Locator, type Page } from "@playwright/test";

export class CatalogPage {
  readonly search: Locator;
  readonly products: Locator;
  readonly cartLink: Locator;
  readonly message: Locator;

  constructor(private readonly page: Page) {
    this.search = page.getByRole("searchbox", { name: "Search products" });
    this.products = page.getByRole("article");
    this.cartLink = page.getByRole("link", { name: /^Cart/ });
    this.message = page.getByTestId("cart-message");
  }

  async goto() {
    await this.page.goto("/shop");
    await expect(this.products.first()).toBeVisible();
  }

  async searchFor(term: string) {
    await this.search.fill(term);
  }

  product(name: string): Locator {
    return this.page.getByRole("article", { name, exact: true });
  }

  // Searches first: the catalog is paginated, so the product may not be on page 1.
  async addToCart(name: string) {
    await this.searchFor(name);
    await this.product(name).getByRole("button", { name: "Add to cart" }).click();
    await expect(this.message).toHaveText(`${name} added to cart.`);
  }
}
