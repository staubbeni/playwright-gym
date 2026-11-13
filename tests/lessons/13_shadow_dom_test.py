# Lesson 13 — Shadow DOM
# Save a name and a theme inside the component and check the initials
# rendered by a nested avatar component.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/13_shadow_dom_test.py
#   npm run check -- 13-shadow-dom --python
from playwright.sync_api import Page, expect


def test_practice_1_fill_inside_the_component(page: Page):
    page.goto("/play/13-shadow-dom")
    # TODO (guided): Set Display name to "Grace Hopper", click "Save settings",
    # and assert "Saved name: Grace Hopper".


def test_practice_2_select_inside_the_component(page: Page):
    page.goto("/play/13-shadow-dom")
    # TODO (independent): Choose Theme "Dark", save, and assert "Saved theme:
    # dark".


def test_practice_3_nested_component(page: Page):
    page.goto("/play/13-shadow-dom")
    # TODO (challenge): After saving "Grace Hopper" assert that the element with
    # accessible name "Avatar" shows "GH".
