# Lesson 22 — Visual comparisons
# Guard the pricing card, a dashboard header with live data, and the whole
# page against visual changes.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/22_visual_test.py
#   npm run check -- 22-visual --python
from playwright.sync_api import Page, expect


def test_practice_1_element_screenshot(page: Page, assert_snapshot):
    page.goto("/play/22-visual")
    # TODO (guided): Call assert_snapshot(locator, "pricing-card.png") on the
    # pricing-card test id. The first run writes the baseline and fails; run again.


def test_practice_2_mask_live_data(page: Page, assert_snapshot):
    page.goto("/play/22-visual")
    # TODO (independent): Snapshot the dashboard-header test id while masking
    # the live-stats element (mask=[...]).


def test_practice_3_stable_full_page(page: Page, assert_snapshot):
    page.goto("/play/22-visual")
    # TODO (challenge): Snapshot the whole page with full_page=True,
    # animations="disabled" and live-stats masked.
