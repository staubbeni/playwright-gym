# Lesson 28 — Flaky test clinic
# These five tests are FLAKY on purpose. Run them a few times:
#   pytest tests/solutions/28_flaky_clinic_test.py
# Find the cause of each flake and fix it properly (no retries, no longer sleeps).
# The checker runs your fixed spec 5 times in a row.
import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/28-flaky-clinic")


def test_practice_1_shows_the_latest_score(page: Page):
    page.get_by_role("button", name="Fetch score").click()
    page.wait_for_timeout(300)
    assert page.get_by_test_id("score").text_content() == "Score: 42"


def test_practice_2_lists_every_recent_activity(page: Page):
    items = page.get_by_role("list", name="Recent activity").get_by_role("listitem")
    expect(items.nth(0)).to_have_text("Login")
    expect(items.nth(1)).to_have_text("Purchase")
    expect(items.nth(2)).to_have_text("Logout")


def test_practice_3_confirms_the_sync(page: Page):
    page.get_by_role("button", name="Sync now").click()
    page.wait_for_timeout(1000)
    expect(page.get_by_role("status")).to_have_text("Synced.")


def test_practice_4_the_counting_total(page: Page):
    page.get_by_role("button", name="Count up").click()
    page.wait_for_timeout(500)
    assert page.get_by_test_id("total").text_content() == "Total: 120"
    assert page.get_by_test_id("count-status").text_content() == "Counting finished."


def test_practice_5_the_out_of_order_search(page: Page):
    page.get_by_label("Find exercise").press_sequentially("squat")
    page.wait_for_timeout(300)
    assert page.get_by_role("list", name="Results").get_by_role("listitem").count() == 1
    # TODO: also search for something that doesn't exist and assert the page says so.
