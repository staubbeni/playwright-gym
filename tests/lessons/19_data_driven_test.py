# Lesson 19 — Data-driven tests
# Drive the catalog search, discount codes, and shipping rules from data
# tables.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/19_data_driven_test.py
#   npm run check -- 19-data-driven --python
import pytest
from playwright.sync_api import Page, expect


@pytest.mark.parametrize(
    ("term", "count"),
    [("mat", 2), ("kettlebell", 1), ("protein", 1), ("zzz", 0)],
)
def test_practice_1_search_shows_matching_products(page: Page, term: str, count: int):
    page.goto("/shop")
    # TODO (guided): search for `term` and assert `count` articles. When count
    # is 0 also assert "No products found.".


# TODO (independent): parametrize test_practice_2_... over discount codes:
# GYM10 → $134.10, GYM20 → $119.20, a lowercase gym10 → $134.10, and
# BOGUS → an alert and the total stays $149.00.
# Seed the cart with Adjustable Dumbbell via page.request.post("/api/shop/cart", ...).

# TODO (challenge): parametrize test_practice_3_... over every country ×
# delivery on /shop/checkout (the shipping amount has the test id
# "checkout-shipping"): Hungary $5.00, Germany $8.00, United States $15.00 with
# Standard delivery, and Express (+$10.00) on top. Give each row a unique,
# descriptive id (ids=[...] or pytest.param(..., id="...")).
