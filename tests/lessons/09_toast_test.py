# Lesson 09 — Transient UI & toasts
# Verify the save toast appears and disappears, and that Undo restores a
# deleted draft.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/09_toast_test.py
#   npm run check -- 09-toast --python
from playwright.sync_api import Page, expect


def test_practice_1_toast_appears(page: Page):
    page.goto("/play/09-toast")
    # TODO (guided): Click "Save preferences" and assert the toast text
    # "Preferences saved.".


def test_practice_2_toast_disappears(page: Page):
    page.goto("/play/09-toast")
    # TODO (independent): Assert that the same toast is visible and then hidden
    # again.


def test_practice_3_undo_from_a_toast(page: Page):
    page.goto("/play/09-toast")
    # TODO (challenge): Click "Delete draft", click "Undo" in the toast, and
    # assert the draft "Weekly plan" is visible again.
