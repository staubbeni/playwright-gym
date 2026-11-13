# Lesson 05 — Navigation & URLs
# Navigate to the cart and a product page, then verify the login redirect
# for the account page.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/05_navigation_test.py
#   npm run check -- 05-navigation --python
from playwright.sync_api import Page, expect


def test_practice_1_go_to_the_cart(page: Page):
    page.goto("/shop")
    # TODO (guided): From /shop click the link whose name contains "Cart", then
    # assert the URL ends with /shop/cart and the heading "Your cart" is
    # visible.


def test_practice_2_open_a_product(page: Page):
    page.goto("/shop")
    # TODO (independent): Click the product link "Trail Runner Shoes" and assert
    # the URL /shop/products/trail-runner-shoes and the product heading.


def test_practice_3_protected_redirect(page: Page):
    page.goto("/shop")
    # TODO (challenge): Open /shop/account while logged out and assert that you
    # are redirected to /shop/login and see the "Sign in" heading.
    # Hint: the URL gets a query string (?next=/shop/account), so match it with
    # re.compile(r"/shop/login") rather than an exact string.
