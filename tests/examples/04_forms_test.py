import pytest
from playwright.sync_api import Page, expect


def fill_valid_form(page: Page):
    page.get_by_label("Full name").fill("Ada Lovelace")
    page.get_by_label("Email address").fill("ada@example.com")
    page.get_by_label("Password").fill("analytical-engine")
    page.get_by_label("I accept the terms").check()


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/04-forms")


def test_practice_1_creates_an_account_with_valid_input(page: Page):
    fill_valid_form(page)
    page.get_by_role("button", name="Create account").click()
    expect(page.get_by_role("status")).to_contain_text("Account created")


def test_practice_2_rejects_an_invalid_email(page: Page):
    fill_valid_form(page)
    page.get_by_label("Email address").fill("not-an-email")
    page.get_by_role("button", name="Create account").click()
    # Next.js renders its own (empty) role=alert route announcer, so filter.
    expect(page.get_by_role("alert").filter(has_text="email")).to_have_text("Enter a valid email address.")
    expect(page.get_by_role("status")).not_to_contain_text("Account created")


def test_practice_3_summarizes_the_chosen_plan_and_role(page: Page):
    fill_valid_form(page)
    page.get_by_label("Plan").select_option("Pro")
    page.get_by_role("radio", name="Teacher").check()
    page.get_by_role("button", name="Create account").click()
    expect(page.get_by_role("status")).to_have_text("Account created for Ada Lovelace on the Pro plan as a Teacher.")
