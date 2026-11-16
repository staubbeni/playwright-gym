from pages.cart_page import CartPage
from pages.catalog_page import CatalogPage
from playwright.sync_api import Page, expect


def test_practice_1_adds_a_product_through_the_catalog_page_object(page: Page):
    catalog = CatalogPage(page)
    catalog.goto()
    catalog.add_to_cart("Yoga Mat")
    expect(catalog.cart_link).to_have_text("Cart (1)")


def test_practice_2_changes_a_quantity_through_the_cart_page_object(page: Page):
    catalog = CatalogPage(page)
    cart = CartPage(page)
    catalog.goto()
    catalog.add_to_cart("Yoga Mat")
    cart.goto()
    cart.set_quantity("Yoga Mat", 3)
    expect(cart.total).to_have_text("$87.00")


def test_practice_3_buys_a_discounted_bundle(page: Page):
    catalog = CatalogPage(page)
    cart = CartPage(page)
    catalog.goto()
    catalog.add_to_cart("Adjustable Dumbbell")
    catalog.add_to_cart("Yoga Mat")
    expect(catalog.cart_link).to_have_text("Cart (2)")

    cart.goto()
    expect(cart.total).to_have_text("$178.00")
    cart.set_quantity("Yoga Mat", 2)
    expect(cart.total).to_have_text("$207.00")

    cart.apply_discount("GYM10")
    expect(cart.subtotal).to_have_text("$207.00")
    expect(cart.discount).to_have_text("-$20.70")
    expect(cart.total).to_have_text("$186.30")
