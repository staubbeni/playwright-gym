# Lesson 20 — Page Object Model
# Complete CatalogPage and CartPage, then refactor a long raw-locator test
# onto them.
#
# Copy this file AND the pages/ folder before editing:
#   cp -r tests/lessons/20_page_objects_test.py tests/lessons/pages tests/solutions/
#   pytest tests/solutions/20_page_objects_test.py
#   npm run check -- 20-page-objects --python
import re

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


# TODO (challenge): this test passes, but it is all raw locators. Rewrite the
# body with CatalogPage and CartPage (extend them where needed) and keep every
# assertion. No page.get_by_…/page.locator() may be left in the body.
def test_practice_3_buys_a_discounted_bundle(page: Page):
    page.goto("/shop")
    page.get_by_role("searchbox", name="Search products").fill("Adjustable Dumbbell")
    page.get_by_role("article", name="Adjustable Dumbbell", exact=True).get_by_role("button", name="Add to cart").click()
    expect(page.get_by_test_id("cart-message")).to_have_text("Adjustable Dumbbell added to cart.")
    page.get_by_role("searchbox", name="Search products").fill("Yoga Mat")
    page.get_by_role("article", name="Yoga Mat", exact=True).get_by_role("button", name="Add to cart").click()
    expect(page.get_by_test_id("cart-message")).to_have_text("Yoga Mat added to cart.")
    expect(page.get_by_role("link", name=re.compile("^Cart"))).to_have_text("Cart (2)")

    page.goto("/shop/cart")
    expect(page.get_by_test_id("cart-total")).to_have_text("$178.00")
    page.get_by_label("Quantity for Yoga Mat", exact=True).fill("2")
    expect(page.get_by_test_id("cart-total")).to_have_text("$207.00")

    page.get_by_label("Discount code").fill("GYM10")
    page.get_by_role("button", name="Apply").click()
    expect(page.get_by_test_id("cart-subtotal")).to_have_text("$207.00")
    expect(page.get_by_test_id("cart-discount")).to_have_text("-$20.70")
    expect(page.get_by_test_id("cart-total")).to_have_text("$186.30")
