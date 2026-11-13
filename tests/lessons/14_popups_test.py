# Lesson 14 — Popups & new tabs
# Open and approve a payment popup, then follow a link that opens in a new
# tab.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/14_popups_test.py
#   npm run check -- 14-popups --python
from playwright.sync_api import Page, expect


def test_practice_1_catch_the_popup(page: Page):
    page.goto("/play/14-popups")
    # TODO (guided): Click "Open payment window" inside
    # `with page.expect_popup() as popup_info:` and assert the popup heading
    # "Payment window".


def test_practice_2_report_back_to_the_opener(page: Page):
    page.goto("/play/14-popups")
    # TODO (independent): In the popup click "Approve payment", then assert the
    # original page says "Payment approved.".


def test_practice_3_new_tab_link(page: Page):
    page.goto("/play/14-popups")
    # TODO (challenge): Click "Read the terms" (target=_blank) and assert the
    # new page URL ends in /popup/terms and its heading is "Terms of service".
