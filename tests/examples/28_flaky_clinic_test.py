import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/28-flaky-clinic")


def test_practice_1_shows_the_latest_score(page: Page):
    page.get_by_role("button", name="Fetch score").click()
    expect(page.get_by_test_id("score")).to_have_text("Score: 42")


def test_practice_2_lists_every_recent_activity(page: Page):
    feed = page.get_by_role("list", name="Recent activity")
    expect(feed.get_by_role("listitem")).to_have_count(3)
    for activity in ["Login", "Purchase", "Logout"]:
        expect(feed.get_by_text(activity, exact=True)).to_be_visible()


def test_practice_3_confirms_the_sync(page: Page):
    page.get_by_role("button", name="Sync now").click()
    expect(page.get_by_role("region", name="Notifications").get_by_role("status")).to_have_text("Synced.")
