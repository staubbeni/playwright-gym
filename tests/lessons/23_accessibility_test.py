# Lesson 23 — Accessibility testing
# Snapshot the main navigation, check the newsletter dialog's focus handling,
# and verify that form errors are announced and described.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/23_accessibility_test.py
#   npm run check -- 23-accessibility --python
from playwright.sync_api import Page, expect


def test_practice_1_aria_snapshot(page: Page):
    page.goto("/play/23-accessibility")
    # TODO (guided): Prove the main navigation is exposed with all three links,
    # each with an accessible name (to_match_aria_snapshot).


def test_practice_2_dialog_focus(page: Page):
    page.goto("/play/23-accessibility")
    # TODO (independent): Open the newsletter dialog. Prove focus moves into it,
    # and that after Escape closes it focus is back where it started.


def test_practice_3_announced_errors(page: Page):
    page.goto("/play/23-accessibility")
    # TODO (challenge): Submit the empty contact form and prove both errors are
    # announced, not just visible: each field is invalid and described by its
    # error text. Roles and labels only, no test ids.
