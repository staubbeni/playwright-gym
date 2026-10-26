// Page object for /shop. Copy the whole pages/ folder to tests/solutions/pages/
// and complete it there (lesson 20). Lessons 21 and 29 reuse it.
import { expect, type Locator, type Page } from "@playwright/test";

export class CatalogPage {
  readonly products: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.products = page.getByRole("article");
    this.cartLink = page.getByRole("link", { name: /^Cart/ });
  }

  async goto() {
    await this.page.goto("/shop");
    await expect(this.products.first()).toBeVisible();
  }

  async searchFor(term: string) {
    // TODO: fill the "Search products" searchbox.
  }

  async addToCart(name: string) {
    // TODO: the catalog is paginated, so search for the product first, then
    // click "Add to cart" inside the article named `name`.
  }
}
