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
    trigger = page.get_by_role("button", name="Subscribe to newsletter")
    trigger.click()
    dialog = page.get_by_role("dialog", name="Newsletter")
    expect(dialog.get_by_label("Email")).to_be_focused()
    page.keyboard.press("Escape")
    expect(dialog).to_be_hidden()
    expect(trigger).to_be_focused()


def test_practice_3_errors_are_announced_with_the_input(page: Page):
    page.get_by_role("button", name="Send message").click()
    # Next.js adds its own empty alert region, so pick ours by its text.
    expect(page.get_by_role("alert").filter(has_text="Contact email is required.")).to_be_visible()
    expect(page.get_by_role("alert").filter(has_text="at least 10 characters")).to_be_visible()
    email = page.get_by_label("Contact email")
    expect(email).to_have_attribute("aria-invalid", "true")
    expect(email).to_have_accessible_description("Contact email is required.")
    message = page.get_by_label("Your message")
    expect(message).to_have_attribute("aria-invalid", "true")
    expect(message).to_have_accessible_description("Message must be at least 10 characters.")
