import re

import pytest
from playwright.sync_api import Page, expect


class TestPractice_1_cart:
    @pytest.fixture(autouse=True)
    def open_shop(self, page: Page):
        page.goto("/shop")

    def test_starts_empty(self, page: Page):
        expect(page.get_by_role("link", name=re.compile("^Cart"))).to_have_text("Cart (0)")

    def test_counts_an_added_item(self, page: Page):
        page.get_by_role("article", name="Steel Kettlebell").get_by_role("button", name="Add to cart").click()
        expect(page.get_by_role("link", name=re.compile("^Cart"))).to_have_text("Cart (1)")


@pytest.mark.smoke
def test_practice_2_checkout_is_reachable(page: Page):
    page.request.post("/api/shop/cart", data={"productId": "yoga-mat"})
    page.goto("/shop/cart")
    expect(page.get_by_role("link", name="Checkout")).to_be_visible()


class TestPractice_3_removing_items:
    @pytest.fixture(autouse=True)
    def screenshot_after(self, page: Page, output_path: str):
        yield
        page.screenshot(path=f"{output_path}/cart.png")

    def test_empties_the_cart(self, page: Page):
        page.request.post("/api/shop/cart", data={"productId": "yoga-mat"})
        page.goto("/shop/cart")
        page.get_by_role("button", name="Remove Yoga Mat").click()
        expect(page.get_by_text("Your cart is empty.")).to_be_visible()
