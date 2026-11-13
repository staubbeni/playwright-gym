# Lesson 03 — Selectors & click
# Click buttons, open an icon-only panel, and type into a search field
# without relying on ids or CSS.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/03_selectors_test.py
#   npm run check -- 03-selectors --python
from playwright.sync_api import Page, expect


def test_practice_1_click_and_verify(page: Page):
    page.goto("/play/03-selectors")
    # TODO (guided): Click "Complete action" and assert that the status says
    # "Action completed successfully.".


def test_practice_2_icon_only_button(page: Page):
    page.goto("/play/03-selectors")
    # TODO (independent): Click the gear button (accessible name "Open
    # settings") and assert that the region named "Settings panel" is visible.
    # Hint: get_by_role("region", name="Settings panel")


def test_practice_3_placeholder_search(page: Page):
    page.goto("/play/03-selectors")
    # TODO (challenge): Fill the field with placeholder "Search lessons" with
    # "locators" and assert the echo "Showing results for: locators".
