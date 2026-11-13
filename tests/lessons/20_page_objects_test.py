# Lesson 20 — Page Object Model
# Complete CatalogPage and CartPage and use them for single actions and a full
# purchase flow.
#
# Copy this file AND the pages/ folder before editing:
#   cp -r tests/lessons/20-page-objects.spec.ts tests/lessons/pages tests/solutions/
#   pytest tests/solutions/20_page_objects_test.py
#   npm run check -- 20-page-objects --python
from pages.cart_page import CartPage
from pages.catalog_page import CatalogPage
from playwright.sync_api import Page, expect


def test_practice_1_catalog_page(page: Page):
    catalog = CatalogPage(page)
    catalog.goto()
    # TODO (guided): add "Yoga Mat" with catalog.add_to_cart() and assert
    # catalog.cart_link has the text "Cart (1)".


def test_practice_2_cart_page(page: Page):
    catalog = CatalogPage(page)
    cart = CartPage(page)
    # TODO (independent): add "Yoga Mat", open the cart, set its quantity to 3,
    # and assert cart.total is "$87.00".


def test_practice_3_full_flow(page: Page):
    # TODO (challenge): add Adjustable Dumbbell and Yoga Mat, apply GYM10, and
    # assert the total "$160.20".
    pass
