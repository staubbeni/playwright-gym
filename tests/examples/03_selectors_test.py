import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/03-selectors")


def test_practice_1_completes_the_action(page: Page):
    page.get_by_role("button", name="Complete action").click()
    expect(page.get_by_role("status").filter(has_text="Action")).to_have_text("Action completed successfully.")


def test_practice_2_opens_settings_and_searches_without_css(page: Page):
    page.get_by_role("button", name="Open settings").click()
    expect(page.get_by_role("region", name="Settings panel")).to_be_visible()

    page.get_by_placeholder("Search lessons").fill("locators")
    expect(page.get_by_test_id("search-echo")).to_have_text("Showing results for: locators")


def test_practice_3_tells_save_apart_from_save_as_draft(page: Page):
    page.get_by_role("button", name="Save", exact=True).click()
    expect(page.get_by_test_id("save-result")).to_have_text("Document saved.")

    page.get_by_role("button", name="Save as draft").click()
    expect(page.get_by_test_id("save-result")).to_have_text("Saved as draft.")
