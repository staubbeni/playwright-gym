import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/09-toast")


def test_practice_1_shows_a_confirmation_toast(page: Page):
    page.get_by_role("button", name="Save preferences").click()
    toast = page.get_by_role("region", name="Notifications").get_by_role("status")
    expect(toast).to_have_text("Preferences saved.")


def test_practice_2_the_toast_disappears_on_its_own(page: Page):
    page.get_by_role("button", name="Save preferences").click()
    toast = page.get_by_role("region", name="Notifications").get_by_role("status")
    expect(toast).to_be_visible()
    expect(toast).to_be_hidden()


def test_practice_3_undo_restores_the_deleted_draft(page: Page):
    page.get_by_role("button", name="Delete draft").click()
    expect(page.get_by_text("Draft: Weekly plan")).to_be_hidden()
    page.get_by_role("button", name="Undo").click()
    expect(page.get_by_text("Draft: Weekly plan")).to_be_visible()
