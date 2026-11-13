# Lesson 07 — Web-first assertions
# Prove that a checkbox, a disabled-until-valid button, and a tag list
# behave correctly.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/07_assertions_test.py
#   npm run check -- 07-assertions --python
from playwright.sync_api import Page, expect


def test_practice_1_checked_state(page: Page):
    page.goto("/play/07-assertions")
    # TODO (guided): Check "Enable notifications" and assert both to_be_checked()
    # and the status "Notifications enabled.".


def test_practice_2_disabled_until_valid(page: Page):
    page.goto("/play/07-assertions")
    # TODO (independent): Assert "Save profile" is disabled, fill Display name
    # with "Ada", assert it is enabled and the field has value "Ada", save, and
    # assert "Profile saved for Ada.".


def test_practice_3_list_assertions(page: Page):
    page.goto("/play/07-assertions")
    # TODO (challenge): Add the tags playwright, testing and qa. Assert the Tags
    # list has 3 items, their texts in order (to_have_text with a list), and the
    # counter "3 tags".
