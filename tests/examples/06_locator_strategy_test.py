import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_shop(page: Page):
    page.goto("/shop")


def test_practice_1_adds_one_specific_product(page: Page):
    page.get_by_role("article").filter(has_text="Steel Kettlebell").get_by_role("button", name="Add to cart").click()
    expect(page.get_by_test_id("cart-message")).to_have_text("Steel Kettlebell added to cart.")


def test_practice_2_search_narrows_the_catalog(page: Page):
    products = page.get_by_role("article")
    search = page.get_by_role("searchbox", name="Search products")

    search.fill("mat")
    expect(products).to_have_count(2)

    search.fill("kettlebell")
    expect(products).to_have_count(1)
    expect(products.get_by_role("heading", name="Steel Kettlebell")).to_be_visible()


def test_practice_3_splits_sale_and_regular_products(page: Page):
    products = page.get_by_role("article")
    badge = page.get_by_text("Sale", exact=True)

    expect(products.filter(has=badge)).to_have_count(3)
    expect(products.filter(has_not=badge)).to_have_count(5)
