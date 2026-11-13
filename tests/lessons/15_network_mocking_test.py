# Lesson 15 — Network mocking
# Render a mocked catalog, show the error state for a 500, and display a
# free product.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/15_network_mocking_test.py
#   npm run check -- 15-network-mocking --python
from playwright.sync_api import Page, expect


def test_practice_1_fulfill_with_json(page: Page):
    page.goto("/shop")
    # TODO (guided): Mock the products API (page.route BEFORE page.goto) with
    # one product named "Mocked Dumbbell" and assert that exactly one article
    # with that name is shown.


def test_practice_2_server_error(page: Page):
    page.goto("/shop")
    # TODO (independent): Fulfill the products API with status 500 and assert
    # the alert "Could not load products. Please try again.".


def test_practice_3_modify_a_real_response(page: Page):
    page.goto("/shop")
    # TODO (challenge): Use route.fetch() and set the first item's price to 0.
    # Assert that the product shows the price "Free".
