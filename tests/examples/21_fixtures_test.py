import pytest
from pages.catalog_page import CatalogPage
from playwright.sync_api import Page, expect


@pytest.fixture
def catalog_page(page: Page):
    catalog = CatalogPage(page)
    catalog.goto()
    return catalog


@pytest.fixture
def account_page(page: Page):
    page.request.post("/api/shop/login", data={"username": "student", "password": "playwright"})
    page.goto("/shop/account")
    return page


@pytest.fixture
def seeded_cart(page: Page):
    page.request.post("/api/shop/cart", data={"productId": "whey-protein", "quantity": 2})
    yield
    page.request.delete("/api/shop/cart")


def test_practice_1_the_catalog_fixture_is_ready_to_search(catalog_page: CatalogPage):
    catalog_page.search_for("bands")
    expect(catalog_page.products).to_have_count(1)
    expect(catalog_page.products).to_contain_text("Resistance Bands")


def test_practice_2_the_account_fixture_is_logged_in(account_page: Page):
    expect(account_page.get_by_text("Signed in as student")).to_be_visible()


@pytest.mark.usefixtures("seeded_cart")
def test_practice_3_the_cart_fixture_seeds_and_cleans_up(page: Page):
    page.goto("/shop/cart")
    expect(page.get_by_label("Quantity for Whey Protein")).to_have_value("2")
