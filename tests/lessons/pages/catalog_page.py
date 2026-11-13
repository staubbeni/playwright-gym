# Page object for /shop. Copy the whole pages/ folder to tests/solutions/pages/
# and complete it there (lesson 20). Lessons 21 and 29 reuse it.
import re

from playwright.sync_api import Page, expect


class CatalogPage:
    def __init__(self, page: Page):
        self.page = page
        self.products = page.get_by_role("article")
        self.cart_link = page.get_by_role("link", name=re.compile("^Cart"))

    def goto(self):
        self.page.goto("/shop")
        expect(self.products.first).to_be_visible()

    def search_for(self, term: str):
        # TODO: fill the "Search products" searchbox.
        pass

    def add_to_cart(self, name: str):
        # TODO: the catalog is paginated, so search for the product first, then
        # click "Add to cart" inside the article named `name`.
        pass
