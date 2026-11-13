import pytest
from playwright.sync_api import Page, expect


@pytest.mark.parametrize(
    ("term", "count"),
    [("mat", 2), ("kettlebell", 1), ("protein", 1), ("zzz", 0)],
)
def test_practice_1_search_shows_matching_products(page: Page, term: str, count: int):
    page.goto("/shop")
    page.get_by_role("searchbox", name="Search products").fill(term)
    expect(page.get_by_role("article")).to_have_count(count)
    if count == 0:
        expect(page.get_by_text("No products found.")).to_be_visible()


@pytest.mark.parametrize(
    ("code", "total", "error"),
    [("GYM10", "$134.10", None), ("GYM20", "$119.20", None), ("BOGUS", "$149.00", "Invalid discount code.")],
)
def test_practice_2_discount_code_changes_the_total(page: Page, code: str, total: str, error: str | None):
    page.request.post("/api/shop/cart", data={"productId": "adjustable-dumbbell"})
    page.goto("/shop/cart")
    page.get_by_label("Discount code").fill(code)
    page.get_by_role("button", name="Apply").click()
    if error:
        expect(page.get_by_role("alert").filter(has_text=error)).to_be_visible()
    else:
        expect(page.get_by_text(f"Code {code} applied.")).to_be_visible()
    expect(page.get_by_test_id("cart-total")).to_have_text(total)


@pytest.mark.parametrize(
    ("country", "cost"),
    [("Hungary", "$5.00"), ("Germany", "$8.00"), ("United States", "$15.00")],
)
def test_practice_3_shipping_cost_by_country(page: Page, country: str, cost: str):
    page.goto("/shop/checkout")
    page.get_by_label("Country").select_option(label=country)
    expect(page.get_by_test_id("checkout-shipping")).to_have_text(cost)
