import re

from playwright.sync_api import Locator, Page, expect


class CatalogPage:
    def __init__(self, page: Page):
        self.page = page
        self.search = page.get_by_role("searchbox", name="Search products")
        self.products = page.get_by_role("article")
        self.cart_link = page.get_by_role("link", name=re.compile("^Cart"))
        self.message = page.get_by_test_id("cart-message")

    def goto(self):
        self.page.goto("/shop")
        expect(self.products.first).to_be_visible()

    def search_for(self, term: str):
        self.search.fill(term)

    def product(self, name: str) -> Locator:
        return self.page.get_by_role("article", name=name, exact=True)

    # Searches first: the catalog is paginated, so the product may not be on page 1.
    def add_to_cart(self, name: str):
        self.search_for(name)
        self.product(name).get_by_role("button", name="Add to cart").click()
        expect(self.message).to_have_text(f"{name} added to cart.")
