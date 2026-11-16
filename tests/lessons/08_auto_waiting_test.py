# Lesson 08 — Auto-waiting & loading
# Let Playwright wait for you: catalog loading, lazy reviews, and a sleepy test
# to repair.
#
# Copy this file to tests/solutions/ before editing, then run:
#   npm run check -- 08-auto-waiting --python
from playwright.sync_api import Page, expect


def test_practice_1_wait_for_the_catalog(page: Page):
    page.goto("/shop")
    # TODO (guided): Assert that 8 product articles appear and that "Loading
    # products..." is hidden.


def test_practice_2_lazy_reviews(page: Page):
    page.goto("/shop/products/steel-kettlebell")
    # TODO (independent): click "Show reviews" and assert the first review says
    # "Solid grip and perfect weight.".


# Practice 3 works, but only because it sleeps and reads the text once. Rewrite
# it with no sleep and no snapshot read.
def test_practice_3_replace_the_sleeps(page: Page):
    page.goto("/shop/products/steel-kettlebell")
    page.wait_for_timeout(3000)
    page.get_by_role("button", name="Add to cart").click()
    page.wait_for_timeout(1000)
    assert page.get_by_role("link", name="Cart (1)").text_content() == "Cart (1)"
