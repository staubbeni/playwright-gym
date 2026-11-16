import re

from playwright.sync_api import Page, expect


def test_practice_1_navigates_to_the_cart(page: Page):
    page.goto("/shop")
    page.get_by_role("link", name=re.compile("Cart")).click()
    expect(page).to_have_url(re.compile(r"/shop/cart$"))
    expect(page.get_by_role("heading", name="Your cart")).to_be_visible()


def test_practice_2_moves_through_history_and_survives_a_reload(page: Page):
    page.goto("/shop")
    page.get_by_role("link", name="Trail Runner Shoes").click()
    expect(page).to_have_url(re.compile(r"/shop/products/trail-runner-shoes$"))
    expect(page.get_by_role("heading", name="Trail Runner Shoes")).to_be_visible()

    page.go_back()
    expect(page).to_have_url(re.compile(r"/shop$"))
    expect(page.get_by_role("heading", name="Catalog")).to_be_visible()

    page.go_forward()
    expect(page).to_have_url(re.compile(r"/shop/products/trail-runner-shoes$"))

    page.reload()
    expect(page.get_by_role("heading", name="Trail Runner Shoes")).to_be_visible()


def test_practice_3_redirects_to_login_and_returns_to_the_account_page(page: Page):
    page.goto("/shop/account")
    expect(page).to_have_url(re.compile(r"/shop/login\?next=/shop/account"))
    expect(page.get_by_role("heading", name="Sign in")).to_be_visible()

    page.get_by_label("Username").fill("student")
    page.get_by_label("Password").fill("playwright")
    page.get_by_role("button", name="Sign in").click()
    expect(page).to_have_url(re.compile(r"/shop/account$"))
    expect(page.get_by_role("heading", name="My account")).to_be_visible()
