# Lesson 08 — Auto-waiting & loading
# Wait for the catalog, lazy-loaded reviews, and a stock check, all without
# sleeps.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/08_auto_waiting_test.py
#   npm run check -- 08-auto-waiting --python
from playwright.sync_api import Page, expect


def test_practice_1_wait_for_the_catalog(page: Page):
    page.goto("/shop")
    # TODO (guided): Open /shop and assert that 8 product articles appear and
    # that "Loading products..." is hidden.


def test_practice_2_lazy_reviews(page: Page):
    page.goto("/shop")
    # TODO (independent): On /shop/products/steel-kettlebell click "Show
    # reviews" and assert the first review says "Solid grip and perfect
    # weight.".


def test_practice_3_click_when_enabled(page: Page):
    page.goto("/shop")
    # TODO (challenge): On the same product page click "Add to cart" (disabled
    # while stock is checked) and assert the header link shows "Cart (1)". Don't
    # add any waits.
