# Page object for /shop/cart (lesson 20).
from playwright.sync_api import Page


class CartPage:
    def __init__(self, page: Page):
        self.page = page
        self.total = page.get_by_test_id("cart-total")

    def goto(self):
        self.page.goto("/shop/cart")

    def set_quantity(self, name: str, quantity: int):
        # TODO: fill the input labelled f"Quantity for {name}".
        pass

    def apply_discount(self, code: str):
        # TODO: fill "Discount code" and click "Apply".
        pass
