# Lesson 03 — Selectors & click
# Click buttons, open an icon-only panel, type into a search field, and fix an
# ambiguous locator.
#
# Copy this file to tests/solutions/ before editing, then run:
#   npm run check -- 03-selectors --python
from playwright.sync_api import Page, expect


def test_practice_1_click_and_verify(page: Page):
    page.goto("/play/03-selectors")
    # TODO (guided): Click "Complete action" and assert that the status says
    # "Action completed successfully.".


def test_practice_2_two_controls_no_css(page: Page):
    page.goto("/play/03-selectors")
    # TODO (independent): open the settings panel with the gear button and assert
    # it is visible; then type "locators" into the search box and assert the echo
    # shows it. Built-in locators only.


# Practice 3 FAILS on purpose with a strict mode violation. Run it, read the
# error, and fix the locator without .first / .nth().
def test_practice_3_fix_the_strict_mode_error(page: Page):
    page.goto("/play/03-selectors")
    page.get_by_role("button", name="Save").click()
    expect(page.get_by_test_id("save-result")).to_have_text("Document saved.")
    # TODO: then click "Save as draft" and assert its result as well.
