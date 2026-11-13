import re

import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/01-setup")


def test_practice_1_the_page_has_the_setup_title(page: Page):
    expect(page).to_have_title(re.compile("Setup"))


def test_practice_2_starting_the_training_shows_a_message(page: Page):
    page.get_by_role("button", name="Start training").click()
    expect(page.get_by_text("Training started. Good luck!")).to_be_visible()


def test_practice_3_the_setup_checklist_has_four_items(page: Page):
    checklist = page.get_by_role("list", name="Setup checklist")
    expect(checklist.get_by_role("listitem")).to_have_count(4)
