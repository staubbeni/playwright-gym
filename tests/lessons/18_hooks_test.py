# Lesson 18 — Hooks & organization
# Structure cart tests with hooks, mark a smoke test, and keep a screenshot
# after each failing test.
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
        # TODO: prove a new shopper's cart is empty (header link).
        pass

    def test_counts_an_added_item(self, page: Page):
        # TODO: add "Steel Kettlebell" and prove the header counts one item.
        pass


# TODO (independent): mark this test with @pytest.mark.smoke.
# `pytest -m smoke` must run this test and nothing else.
def test_practice_2_checkout_is_reachable(page: Page):
    # Put an item in the cart (page.request.post("/api/shop/cart", data=...) is
    # quickest), open /shop/cart, click through to checkout and prove you
    # landed on the checkout page.
    pass


class TestPractice_3_removing_items:
    # TODO (challenge): add an autouse fixture that yields, then saves
    # page.screenshot(path=f"{output_path}/cart.png") (output_path is a
    # pytest-playwright fixture), but only when this test failed. Take
    # `request: pytest.FixtureRequest` and compare request.session.testsfailed
    # before and after the yield.

    def test_removes_one_item_at_a_time(self, page: Page):
        # Add Steel Kettlebell and Yoga Mat, remove the kettlebell and prove
        # only the mat is left, then remove the mat and prove the cart is empty.
        pass
