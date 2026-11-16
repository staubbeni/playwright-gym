# Lesson 14 — Popups & new tabs
# Catch a popup, finish a flow in it, and juggle two windows.
#
# Copy this file to tests/solutions/ before editing, then run:
#   npm run check -- 14-popups --python
from playwright.sync_api import Page, expect


def test_practice_1_catch_the_popup(page: Page):
    page.goto("/play/14-popups")
    # TODO (guided): click "Open payment window" and assert the popup heading
    # "Payment window". Hint: with page.expect_popup() as popup_info: ...


def test_practice_2_approve_and_close(page: Page):
    page.goto("/play/14-popups")
    # TODO (independent): in the popup click "Approve payment". Assert the
    # original page says "Payment approved." and that the popup closed itself.


def test_practice_3_two_windows_at_once(page: Page):
    page.goto("/play/14-popups")
    # TODO (challenge): open the payment popup (don't approve) and, in the same
    # test, click "Read the terms". Assert the terms tab (URL /popup/terms,
    # heading "Terms of service") and that the opener still says "Waiting for
    # approval..." afterwards.
