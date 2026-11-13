import re

from playwright.sync_api import Page, expect


def test_practice_1_navigates_to_the_cart(page: Page):
    page.goto("/shop")
    page.get_by_role("link", name=re.compile("Cart")).click()
    expect(page).to_have_url(re.compile(r"/shop/cart$"))
    expect(page.get_by_role("heading", name="Your cart")).to_be_visible()


def test_practice_2_opens_a_product_page(page: Page):
    page.goto("/shop")
    page.get_by_role("link", name="Trail Runner Shoes").click()
    expect(page).to_have_url(re.compile(r"/shop/products/trail-runner-shoes$"))
    expect(page.get_by_role("heading", name="Trail Runner Shoes")).to_be_visible()


def test_practice_3_redirects_anonymous_users_to_the_login_page(page: Page):
    page.goto("/shop/account")
    expect(page).to_have_url(re.compile(r"/shop/login"))
    expect(page.get_by_role("heading", name="Sign in")).to_be_visible()
