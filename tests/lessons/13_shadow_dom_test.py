# Lesson 13 — Shadow DOM
# Use a web component whose inputs and avatar live inside shadow roots.
#
# Copy this file to tests/solutions/ before editing, then run:
#   npm run check -- 13-shadow-dom --python
from playwright.sync_api import Page, expect


def test_practice_1_fill_inside_the_component(page: Page):
    page.goto("/play/13-shadow-dom")
    # TODO (guided): set Display name to "Grace Hopper", click "Save settings",
    # and assert "Saved name: Grace Hopper".


def test_practice_2_name_and_theme_together(page: Page):
    page.goto("/play/13-shadow-dom")
    # TODO (independent): choose Theme "Dark", set the name "Grace Hopper", save
    # once, and assert both the saved name and the saved theme lines.


def test_practice_3_avatar_initials(page: Page):
    page.goto("/play/13-shadow-dom")
    # TODO (challenge): save "Grace Hopper" and assert the avatar shows GH; then
    # save "Plato" and assert it shows P. Find the avatar by its accessible name,
    # no shadow-piercing selectors.
