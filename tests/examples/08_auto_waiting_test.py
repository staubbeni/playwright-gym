import re

from playwright.sync_api import Page, expect


def test_practice_1_waits_for_the_catalog_to_load(page: Page):
    page.goto("/shop")
    expect(page.get_by_role("article")).to_have_count(8)
    expect(page.get_by_text("Loading products...")).to_be_hidden()


def test_practice_2_waits_for_lazy_reviews(page: Page):
    page.goto("/shop/products/steel-kettlebell")
    page.get_by_role("button", name="Show reviews").click()
    reviews = page.get_by_role("list", name="Reviews").get_by_role("listitem")
    expect(reviews.first).to_have_text("Solid grip and perfect weight.")


def test_practice_3_no_sleeps_no_snapshot_reads(page: Page):
    page.goto("/shop/products/steel-kettlebell")
    page.get_by_role("button", name="Add to cart").click()
    expect(page.get_by_role("link", name=re.compile("Cart"))).to_have_text("Cart (1)")
