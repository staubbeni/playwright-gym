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
    page.get_by_role("link", name="Checkout").click()
    expect(page).to_have_url(re.compile(r"/shop/checkout$"))
    expect(page.get_by_role("heading", name="Checkout")).to_be_visible()


class TestPractice_3_removing_items:
    @pytest.fixture(autouse=True)
    def screenshot_on_failure(self, page: Page, output_path: str, request: pytest.FixtureRequest):
        failed_before = request.session.testsfailed
        yield
        if request.session.testsfailed > failed_before:
            page.screenshot(path=f"{output_path}/cart.png")

    def test_removes_one_item_at_a_time(self, page: Page):
        page.request.post("/api/shop/cart", data={"productId": "steel-kettlebell"})
        page.request.post("/api/shop/cart", data={"productId": "yoga-mat"})
        page.goto("/shop/cart")
        page.get_by_role("button", name="Remove Steel Kettlebell").click()
        expect(page.get_by_role("row", name=re.compile("Steel Kettlebell"))).to_have_count(0)
        expect(page.get_by_role("row", name=re.compile("Yoga Mat"))).to_be_visible()
        page.get_by_role("button", name="Remove Yoga Mat").click()
        expect(page.get_by_text("Your cart is empty.")).to_be_visible()
