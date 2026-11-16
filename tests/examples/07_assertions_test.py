import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/07-assertions")


def test_practice_1_enables_notifications(page: Page):
    checkbox = page.get_by_role("checkbox", name="Enable notifications")
    checkbox.check()
    expect(checkbox).to_be_checked()
    expect(page.get_by_test_id("notification-status")).to_have_text("Notifications enabled.")


def test_practice_2_save_is_disabled_until_the_name_is_valid(page: Page):
    save = page.get_by_role("button", name="Save profile")
    name = page.get_by_label("Display name")

    expect(save).to_be_disabled()
    name.fill("Ada")
    expect(name).to_have_value("Ada")
    expect(save).to_be_enabled()
    save.click()
    expect(page.get_by_test_id("profile-status")).to_have_text("Profile saved for Ada.")


def test_practice_3_tags_are_unique_and_listed_in_order(page: Page):
    for tag in ["playwright", "testing", "qa", "qa"]:
        page.get_by_label("New tag").fill(tag)
        page.get_by_role("button", name="Add tag").click()
    tags = page.get_by_role("list", name="Tags").get_by_role("listitem")
    expect(tags).to_have_text(["playwright", "testing", "qa"])
    expect(page.get_by_test_id("tag-count")).to_have_text("3 tags")
    expect(page.get_by_test_id("tag-message")).to_have_text('"qa" already exists.')
