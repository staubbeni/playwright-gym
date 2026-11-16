# Lesson 21 — Custom fixtures
# Write three fixtures: a catalog page object, a logged-in account page, and a
# cart seeded via API with teardown, driven by a fixture parameter.
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
    # TODO (independent): sign the student in via page.request (see lesson 17
    # for the endpoint), open the account page, then return page.
    pass


@pytest.fixture
def seeded_cart(page: Page, request: pytest.FixtureRequest):
    # TODO (challenge): read the seed with
    #   getattr(request, "param", {"productId": "whey-protein", "quantity": 2})
    # POST it to /api/shop/cart, `yield`, then clean up with
    # page.request.delete("/api/shop/cart").
    yield


def test_practice_1_the_catalog_fixture_is_ready_to_search(catalog_page: CatalogPage):
    # TODO: search for resistance bands and prove exactly one product is listed
    # and that it is the right one.
    pass


def test_practice_2_the_account_fixture_is_logged_in(account_page: Page):
    # TODO: prove the page says who is signed in.
    pass


# TODO (challenge): choose 3 × "resistance-bands" for this test with
# @pytest.mark.parametrize("seeded_cart", [{...}], indirect=True)
def test_practice_3_the_seeded_cart_shows_the_seeded_quantity(page: Page, seeded_cart):
    # TODO: open the cart and prove it holds three bands: the quantity field
    # and the header count.
    pass
