# Lesson 18 — Hooks & organization
# Structure cart tests with hooks, tag a smoke test, and attach a screenshot
# after each test.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/18_hooks_test.py
#   npm run check -- 18-hooks --python
import pytest
from playwright.sync_api import Page, expect


class TestPractice_1_cart:
    # TODO (guided): add an autouse fixture that opens /shop:
    #   @pytest.fixture(autouse=True)
    #   def open_shop(self, page: Page): ...

    def test_starts_empty(self, page: Page):
        # TODO: assert the header link text "Cart (0)".
        pass

    def test_counts_an_added_item(self, page: Page):
        # TODO: add "Steel Kettlebell" and assert "Cart (1)".
        pass


# TODO (independent): mark this test with @pytest.mark.smoke
# (run only smoke tests with: pytest -m smoke).
def test_practice_2_checkout_is_reachable(page: Page):
    # Add an item (page.request.post("/api/shop/cart", data=...) is quickest),
    # open /shop/cart, and assert the "Checkout" link is visible.
    pass


class TestPractice_3_removing_items:
    # TODO (challenge): add an autouse fixture that yields, then saves
    # page.screenshot(path=f"{output_path}/cart.png") after the test
    # (output_path is a pytest-playwright fixture).

    def test_empties_the_cart(self, page: Page):
        # Add an item, open the cart, remove it, and assert "Your cart is empty."
        pass
