from playwright.sync_api import Locator, Page


class CartPage:
    def __init__(self, page: Page):
        self.page = page
        self.total = page.get_by_test_id("cart-total")
        self.discount_code = page.get_by_label("Discount code")

    def goto(self):
        self.page.goto("/shop/cart")

    def quantity(self, name: str) -> Locator:
        return self.page.get_by_label(f"Quantity for {name}", exact=True)

    def set_quantity(self, name: str, quantity: int):
        self.quantity(name).fill(str(quantity))

    def apply_discount(self, code: str):
        self.discount_code.fill(code)
        self.page.get_by_role("button", name="Apply").click()
