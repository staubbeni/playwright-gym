import pytest
from playwright.sync_api import Page, expect


def fill_valid_form(page: Page):
    page.get_by_label("Full name").fill("Ada Lovelace")
    page.get_by_label("Email address").fill("ada@example.com")
    page.get_by_label("Password").fill("analytical-engine")
    page.get_by_label("I accept the terms").check()


def submit(page: Page):
    page.get_by_role("button", name="Create account").click()


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/04-forms")


def test_practice_1_creates_an_account_with_valid_input(page: Page):
    fill_valid_form(page)
    submit(page)
    expect(page.get_by_role("status")).to_contain_text("Account created")


def test_practice_2_rejects_each_invalid_field(page: Page):
    status = page.get_by_role("status")
    # Next.js renders its own (empty) role=alert route announcer, so filter.
    alert = lambda text: page.get_by_role("alert").filter(has_text=text)  # noqa: E731

    fill_valid_form(page)
    page.get_by_label("Email address").fill("not-an-email")
    submit(page)
    expect(alert("email")).to_have_text("Enter a valid email address.")
    expect(status).not_to_contain_text("Account created")

    fill_valid_form(page)
    page.get_by_label("Password").fill("1234567")
    submit(page)
    expect(alert("Password")).to_have_text("Password must be at least 8 characters.")
    expect(status).not_to_contain_text("Account created")

    fill_valid_form(page)
    page.get_by_label("I accept the terms").uncheck()
    submit(page)
    expect(alert("terms")).to_have_text("You must accept the terms.")
    expect(status).not_to_contain_text("Account created")


def test_practice_3_summarizes_the_plan_and_role_then_resets(page: Page):
    fill_valid_form(page)
    page.get_by_label("Plan").select_option("Pro")
    page.get_by_role("radio", name="Teacher").check()
    submit(page)
    expect(page.get_by_role("status")).to_have_text("Account created for Ada Lovelace on the Pro plan as a Teacher.")

    page.get_by_role("button", name="Reset form").click()
    expect(page.get_by_label("Full name")).to_have_value("")
    expect(page.get_by_label("Plan")).to_have_value("Free")
    expect(page.get_by_role("radio", name="Student")).to_be_checked()
    expect(page.get_by_role("status")).to_have_text("Complete the form to continue.")
