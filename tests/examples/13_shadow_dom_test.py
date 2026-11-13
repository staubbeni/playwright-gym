import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/13-shadow-dom")


def test_practice_1_saves_a_name_inside_the_component(page: Page):
    page.get_by_label("Display name").fill("Grace Hopper")
    page.get_by_role("button", name="Save settings").click()
    expect(page.get_by_test_id("saved-name")).to_have_text("Saved name: Grace Hopper")


def test_practice_2_saves_a_theme_inside_the_component(page: Page):
    page.get_by_label("Theme").select_option("Dark")
    page.get_by_role("button", name="Save settings").click()
    expect(page.get_by_test_id("saved-theme")).to_have_text("Saved theme: dark")


def test_practice_3_the_nested_avatar_shows_new_initials(page: Page):
    page.get_by_label("Display name").fill("Grace Hopper")
    page.get_by_role("button", name="Save settings").click()
    expect(page.get_by_label("Avatar")).to_have_text("GH")
