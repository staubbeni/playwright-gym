# Lesson 15 — Network mocking
# Render a mocked catalog, drive three failure states, and prove what the page
# sends to the API.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/15_network_mocking_test.py
#   npm run check -- 15-network-mocking --python
from playwright.sync_api import Page, expect


def test_practice_1_fulfill_with_json(page: Page):
    # TODO (guided): answer the products API yourself so the catalog shows exactly
    # one product, "Mocked Dumbbell". Prove that's all the page shows.
    # Register the route BEFORE page.goto("/shop").
    page.goto("/shop")


def test_practice_2_three_failure_states(page: Page):
    # TODO (independent): prove the page's reaction to (1) a 500 response, (2) a
    # network failure, and (3) an empty list.
    # Hint: a later page.route() for the same URL wins, so re-route and reload.
    page.goto("/shop")


def test_practice_3_patch_a_response_check_the_request(page: Page):
    # TODO (challenge): use route.fetch() to make the first item's price 0 and
    # prove the page shows it as free. Then type "mat" in the search box and
    # prove the page asked the API for that query (page.expect_request, opened
    # BEFORE the typing) and that the free item is still shown.
    page.goto("/shop")
