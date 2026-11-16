# Lesson 06 — Locator strategy
# Scope actions to one card, count what a search returns, and split the catalog
# into sale and regular products.
#
# Copy this file to tests/solutions/ before editing, then run:
#   npm run check -- 06-locator-strategy --python
from playwright.sync_api import Page, expect


def test_practice_1_add_one_specific_product(page: Page):
    page.goto("/shop")
    # TODO (guided): add "Steel Kettlebell" to the cart and assert the message
    # "Steel Kettlebell added to cart.". Scope the button to its card.


def test_practice_2_search_narrows_the_catalog(page: Page):
    page.goto("/shop")
    # TODO (independent): search "mat": exactly 2 products. Search "kettlebell":
    # exactly 1 product, with the heading "Steel Kettlebell".


def test_practice_3_sale_and_not_on_sale(page: Page):
    page.goto("/shop")
    # TODO (challenge): of the 8 products on the first page, exactly 3 have the
    # "Sale" badge and exactly 5 don't. Use filter(has=...) and filter(has_not=...).
