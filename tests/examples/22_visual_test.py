import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/22-visual")


def test_practice_1_the_pricing_card_looks_right(page: Page, assert_snapshot):
    assert_snapshot(page.get_by_test_id("pricing-card"), "pricing-card.png")


def test_practice_2_the_dashboard_header_with_live_data_masked(page: Page, assert_snapshot):
    assert_snapshot(
        page.get_by_test_id("dashboard-header"),
        "dashboard-header.png",
        mask=[page.get_by_test_id("live-stats")],
    )


def test_practice_3_the_whole_page_is_stable(page: Page, assert_snapshot):
    expect(page.get_by_test_id("pricing-card")).to_be_visible()
    assert_snapshot(
        page,
        "pricing-page.png",
        full_page=True,
        animations="disabled",
        mask=[page.get_by_test_id("live-stats")],
    )
