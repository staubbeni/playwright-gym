# Lesson 05 — Navigation & URLs
# Navigate to the cart, move through history, and test the login redirect.
#
# Copy this file to tests/solutions/ before editing, then run:
#   npm run check -- 05-navigation --python
import re

from playwright.sync_api import Page, expect


def test_practice_1_go_to_the_cart(page: Page):
    page.goto("/shop")
    # TODO (guided): From /shop click the link whose name contains "Cart", then
    # assert the URL ends with /shop/cart and the heading "Your cart" is
    # visible.


def test_practice_2_back_forward_and_reload(page: Page):
    page.goto("/shop")
    # TODO (independent): open "Trail Runner Shoes" and assert its URL and
    # heading. Go back (assert the catalog), go forward, reload and assert the
    # product page is still there.
    # Hint: go_back / go_forward / reload don't wait for the UI: assert after each.


def test_practice_3_protected_page_and_next(page: Page):
    # TODO (challenge): open /shop/account while logged out. Assert you are sent
    # to /shop/login and the URL has ?next=/shop/account. Sign in as student /
    # playwright and assert you land back on "My account".
    # Hint: to_have_url(re.compile(r"/shop/login\?next="))
    ...
