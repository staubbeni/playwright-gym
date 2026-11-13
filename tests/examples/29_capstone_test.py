import re

import pytest
from pages.cart_page import CartPage
from pages.catalog_page import CatalogPage
from playwright.sync_api import Page, expect


@pytest.fixture
def catalog(page: Page):
    catalog = CatalogPage(page)
    catalog.goto()
    return catalog


@pytest.fixture
def cart(page: Page):
    return CartPage(page)


def seed_cart(page: Page, product_id: str, quantity: int = 1):
    response = page.request.post("/api/shop/cart", data={"productId": product_id, "quantity": quantity})
    assert response.status == 201


def fill_checkout(page: Page, email: str):
    page.goto("/shop/checkout")
    page.get_by_label("Full name").fill("Ada Lovelace")
    page.get_by_label("Email").fill(email)
    page.get_by_label("Address").fill("1 Engine Street")
    page.once("dialog", lambda dialog: dialog.accept())
    page.get_by_role("button", name="Place order").click()


class TestCatalog:
    def test_search_narrows_the_list(self, catalog: CatalogPage):
        catalog.search_for("kettlebell")
        expect(catalog.products).to_have_count(1)
        expect(catalog.products).to_contain_text("Steel Kettlebell")

    def test_product_page_shows_name_and_price(self, page: Page):
        page.goto("/shop/products/steel-kettlebell")
        expect(page.get_by_role("heading", name="Steel Kettlebell")).to_be_visible()
        expect(page.get_by_test_id("product-price")).to_have_text("$39.99")


class TestCart:
    def test_quantity_changes_update_the_total(self, page: Page, cart: CartPage):
        seed_cart(page, "yoga-mat")
        cart.goto()
        cart.set_quantity("Yoga Mat", 3)
        expect(cart.total).to_have_text("$87.00")

    def test_gym10_takes_10_percent_off(self, page: Page, cart: CartPage):
        seed_cart(page, "adjustable-dumbbell")
        cart.goto()
        cart.apply_discount("GYM10")
        expect(cart.total).to_have_text("$134.10")

    def test_adding_from_the_catalog_updates_the_header(self, catalog: CatalogPage):
        catalog.add_to_cart("Steel Kettlebell")
        expect(catalog.cart_link).to_have_text("Cart (1)")


class TestCheckout:
    def test_rejects_an_invalid_email(self, page: Page):
        seed_cart(page, "yoga-mat")
        fill_checkout(page, "not-an-email")
        expect(page.get_by_role("alert").filter(has_text="email")).to_have_text("Enter a valid email address.")
        expect(page).to_have_url(re.compile(r"/shop/checkout$"))

    def test_confirms_a_valid_order_with_its_number(self, page: Page):
        seed_cart(page, "yoga-mat")
        fill_checkout(page, "ada@example.com")
        expect(page.get_by_role("heading", name="Order confirmed")).to_be_visible()
        expect(page.get_by_text(re.compile(r"^Order number: GYM-\d+$"))).to_be_visible()


class TestAccount:
    def test_wrong_credentials_are_rejected(self, page: Page):
        page.goto("/shop/login")
        page.get_by_label("Username").fill("student")
        page.get_by_label("Password").fill("wrong-password")
        page.get_by_role("button", name="Sign in").click()
        expect(page.get_by_role("alert").filter(has_text="Invalid")).to_have_text("Invalid username or password.")
        expect(page).to_have_url(re.compile(r"/shop/login"))

    def test_saving_settings_shows_a_confirmation(self, page: Page):
        page.request.post("/api/shop/login", data={"username": "student", "password": "playwright"})
        page.goto("/shop/account")
        page.get_by_role("switch", name="Newsletter").check()
        page.get_by_role("button", name="Save settings").click()
        expect(page.get_by_role("region", name="Notifications").get_by_role("status")).to_have_text("Settings saved.")
