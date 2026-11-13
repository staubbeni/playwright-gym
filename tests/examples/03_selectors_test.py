import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/03-selectors")


def test_practice_1_completes_the_action(page: Page):
    page.get_by_role("button", name="Complete action").click()
    expect(page.get_by_role("status")).to_have_text("Action completed successfully.")


def test_practice_2_opens_settings_with_the_icon_button(page: Page):
    page.get_by_role("button", name="Open settings").click()
    expect(page.get_by_role("region", name="Settings panel")).to_be_visible()


def test_practice_3_searches_through_the_placeholder_field(page: Page):
    page.get_by_placeholder("Search lessons").fill("locators")
    expect(page.get_by_test_id("search-echo")).to_have_text("Showing results for: locators")
