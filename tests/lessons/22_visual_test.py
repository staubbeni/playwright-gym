# Lesson 22 — Visual comparisons
# Guard the pricing card, a dashboard header with live data, and fix a flaky
# full-page snapshot.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/22_visual_test.py
#   npm run check -- 22-visual --python
from playwright.sync_api import Page, expect


def test_practice_1_element_screenshot(page: Page, assert_snapshot):
    page.goto("/play/22-visual")
    # TODO (guided): Guard the pricing card with assert_snapshot(locator,
    # "pricing-card.png"). The first run writes the baseline and fails; run again.


def test_practice_2_mask_live_data(page: Page, assert_snapshot):
    page.goto("/play/22-visual")
    # TODO (independent): Guard the dashboard header with a snapshot. It has
    # live numbers that change every second; the test must pass on every run.


def test_practice_3_stable_full_page(page: Page, assert_snapshot):
    page.goto("/play/22-visual")
    # TODO (challenge): This test is flaky. Run it a few times, find out why
    # (two things move on this page) and stabilize it. If you add a tolerance,
    # explain it in a comment.
    assert_snapshot(page, "pricing-page.png", full_page=True)
