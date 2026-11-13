# Lesson 06 — Locator strategy
# Add one specific product to the cart, count search results, and count sale
# items.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/06_locator_strategy_test.py
#   npm run check -- 06-locator-strategy --python
from playwright.sync_api import Page, expect


def test_practice_1_add_one_specific_product(page: Page):
    page.goto("/shop")
    # TODO (guided): On /shop add "Steel Kettlebell" to the cart and assert the
    # message "Steel Kettlebell added to cart.".


def test_practice_2_count_search_results(page: Page):
    page.goto("/shop")
    # TODO (independent): Search for "mat" in the "Search products" field and
    # assert that exactly 2 product articles are shown.


def test_practice_3_filter_by_a_child_element(page: Page):
    page.goto("/shop")
    # TODO (challenge): Assert that exactly 3 products on the first page carry a
    # "Sale" badge, using filter(has=...).
