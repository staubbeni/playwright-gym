import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_shop(page: Page):
    page.goto("/shop")


def test_practice_1_adds_one_specific_product(page: Page):
    (
        page.get_by_role("article")
        .filter(has_text="Steel Kettlebell")
        .get_by_role("button", name="Add to cart")
        .click()
    )
    expect(page.get_by_test_id("cart-message")).to_have_text("Steel Kettlebell added to cart.")


def test_practice_2_counts_search_results(page: Page):
    page.get_by_role("searchbox", name="Search products").fill("mat")
    expect(page.get_by_role("article")).to_have_count(2)


def test_practice_3_counts_products_on_sale(page: Page):
    on_sale = page.get_by_role("article").filter(has=page.get_by_text("Sale", exact=True))
    expect(on_sale).to_have_count(3)
