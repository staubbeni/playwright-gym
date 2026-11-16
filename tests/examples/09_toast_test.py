import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/09-toast")


def toasts(page: Page):
    return page.get_by_role("region", name="Notifications").get_by_role("status")


def test_practice_1_the_toast_appears_and_then_closes(page: Page):
    page.get_by_role("button", name="Save preferences").click()
    expect(toasts(page)).to_have_text("Preferences saved.")
    expect(toasts(page)).to_be_hidden()


def test_practice_2_stacked_toasts_arrive_in_order(page: Page):
    page.get_by_role("button", name="Send 3 emails").click()
    expect(toasts(page)).to_have_text(["Email 1 sent.", "Email 2 sent.", "Email 3 sent."])


def test_practice_3_undo_restores_the_draft(page: Page):
    page.get_by_role("button", name="Delete draft").click()
    expect(toasts(page)).to_contain_text("Draft deleted.")
    expect(page.get_by_text("Draft: Weekly plan")).to_be_hidden()

    page.get_by_role("button", name="Undo").click()
    expect(page.get_by_text("Draft: Weekly plan")).to_be_visible()
    expect(toasts(page)).to_have_text("Draft restored.")
