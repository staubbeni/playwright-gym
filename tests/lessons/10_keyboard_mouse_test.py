# Lesson 10 — Keyboard, hover & drag
# Open the command palette with a shortcut, read a hover tooltip, and move a
# kanban card.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/10_keyboard_mouse_test.py
#   npm run check -- 10-keyboard-mouse --python
from playwright.sync_api import Page, expect


def test_practice_1_keyboard_shortcut(page: Page):
    page.goto("/play/10-keyboard-mouse")
    # TODO (guided): Press ControlOrMeta+K, type "cart" in the Command field,
    # press Enter, and assert "Opened: Cart".
    # Hint: Global shortcuts only work once the page's JavaScript is running.
    # Wait for "Keyboard shortcuts ready" before pressing keys: page-level key
    # presses have no element to auto-wait for.


def test_practice_2_hover_tooltip(page: Page):
    page.goto("/play/10-keyboard-mouse")
    # TODO (independent): Hover the button "About the Pro plan" and assert the
    # tooltip "Includes unlimited projects.".


def test_practice_3_drag_and_drop(page: Page):
    page.goto("/play/10-keyboard-mouse")
    # TODO (challenge): Drag "Write tests" from To do into the Done list. Assert
    # that it is in Done and no longer in To do.
