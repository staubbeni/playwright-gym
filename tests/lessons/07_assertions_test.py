# Lesson 07 — Assertions
# Pick the matcher that states the expected state: checked, disabled, value,
# list text, and duplicate handling.
#
# Copy this file to tests/solutions/ before editing, then run:
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


def test_practice_3_soft_list_assertions(page: Page):
    page.goto("/play/07-assertions")
    # TODO (challenge): add the tags playwright, testing and qa, then try to add
    # "qa" a second time. Prove: the tags in order (one to_have_text([...])), the
    # counter "3 tags", and the duplicate message `"qa" already exists.`.
