# Lesson 09 — Transient UI & toasts
# Assert what appears and disappears: one toast, a stack of toasts, and a toast
# whose text keeps changing.
#
# Copy this file to tests/solutions/ before editing, then run:
#   npm run check -- 09-toast --python
import re

from playwright.sync_api import Page, expect


def test_practice_1_toast_appears_then_closes(page: Page):
    page.goto("/play/09-toast")
    # TODO (guided): Click "Save preferences". Assert the toast says
    # "Preferences saved." and that it goes away on its own.


def test_practice_2_stacked_toasts_in_order(page: Page):
    page.goto("/play/09-toast")
    # TODO (independent): "Send 3 emails" shows three toasts one after another.
    # Assert all three are on screen together, in order: "Email 1 sent.",
    # "Email 2 sent.", "Email 3 sent.".


def test_practice_3_undo_with_a_countdown(page: Page):
    page.goto("/play/09-toast")
    # TODO (challenge): click "Delete draft". The toast reads "Draft deleted. Undo
    # in 4s" and the number counts down, so match only the stable part. Click
    # "Undo", then assert the draft "Weekly plan" is back and the toast "Draft
    # restored." appeared.
