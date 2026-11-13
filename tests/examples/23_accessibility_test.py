import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/23-accessibility")


def test_practice_1_the_main_navigation_has_named_links(page: Page):
    expect(page.get_by_role("navigation", name="Main")).to_match_aria_snapshot("""
        - navigation "Main":
          - link "Home"
          - link "Shop"
          - link "Account"
    """)


def test_practice_2_the_newsletter_dialog_manages_focus(page: Page):
    page.get_by_role("button", name="Subscribe to newsletter").click()
    dialog = page.get_by_role("dialog", name="Newsletter")
    expect(dialog).to_be_visible()
    expect(dialog.get_by_label("Email")).to_be_focused()
    page.keyboard.press("Escape")
    expect(dialog).to_be_hidden()


def test_practice_3_errors_are_announced_with_the_input(page: Page):
    page.get_by_role("button", name="Send message").click()
    email = page.get_by_label("Contact email")
    expect(email).to_have_attribute("aria-invalid", "true")
    expect(email).to_have_accessible_description("Contact email is required.")
