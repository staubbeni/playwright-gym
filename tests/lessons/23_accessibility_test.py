# Lesson 23 — Accessibility testing
# Snapshot the main navigation, check the newsletter dialog's focus
# handling, and verify accessible error descriptions.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/23_accessibility_test.py
#   npm run check -- 23-accessibility --python
from playwright.sync_api import Page, expect


def test_practice_1_aria_snapshot(page: Page):
    page.goto("/play/23-accessibility")
    # TODO (guided): Assert that the navigation "Main" matches an ARIA snapshot
    # (to_match_aria_snapshot) with links Home, Shop and Account.


def test_practice_2_dialog_focus(page: Page):
    page.goto("/play/23-accessibility")
    # TODO (independent): Click "Subscribe to newsletter", assert the dialog
    # "Newsletter" is visible and its Email field is focused, press Escape, and
    # assert the dialog is hidden.


def test_practice_3_accessible_errors(page: Page):
    page.goto("/play/23-accessibility")
    # TODO (challenge): Click "Send message" with an empty form. Assert that
    # "Contact email" has aria-invalid="true" and the accessible description
    # "Contact email is required.".
