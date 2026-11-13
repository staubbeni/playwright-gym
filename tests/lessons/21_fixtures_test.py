# Lesson 21 — Custom fixtures
# Write three fixtures: a catalog page object, a logged-in account page, and a
# cart seeded via API with teardown.
#
# Needs your page objects from lesson 20 in tests/solutions/pages/.
#   pytest tests/solutions/21_fixtures_test.py
#   npm run check -- 21-fixtures --python
import pytest
from pages.catalog_page import CatalogPage
from playwright.sync_api import Page, expect


@pytest.fixture
def catalog_page(page: Page):
    # TODO (guided): create a CatalogPage, open it, and return it.
    pass


@pytest.fixture
def account_page(page: Page):
    # TODO (independent): log in via page.request, open /shop/account, then
    # return page.
    pass


@pytest.fixture
def seeded_cart(page: Page):
    # TODO (challenge): POST 2 × "whey-protein" to /api/shop/cart, `yield`,
    # then clean up with page.request.delete("/api/shop/cart").
    yield


def test_practice_1_the_catalog_fixture_is_ready_to_search(catalog_page: CatalogPage):
    # TODO: search "bands" and assert exactly one article: "Resistance Bands".
    pass


def test_practice_2_the_account_fixture_is_logged_in(account_page: Page):
    # TODO: assert "Signed in as student".
    pass


@pytest.mark.usefixtures("seeded_cart")
def test_practice_3_the_cart_fixture_seeds_and_cleans_up(page: Page):
    # TODO: open /shop/cart and assert the Whey Protein quantity is "2".
    pass
