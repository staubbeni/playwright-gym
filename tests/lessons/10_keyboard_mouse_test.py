# Lesson 10 — Keyboard, hover & drag
# Drive a command palette with a shortcut, show and dismiss a tooltip, and move a
# card across a board.
#
# Copy this file to tests/solutions/ before editing, then run:
#   npm run check -- 10-keyboard-mouse --python
from playwright.sync_api import Page, expect


def test_practice_1_keyboard_shortcut(page: Page):
    page.goto("/play/10-keyboard-mouse")
    # TODO (guided): press ControlOrMeta+K, type "cart" in the Command field, press
    # Enter, and assert "Opened: Cart".
    # Hint: wait for "Keyboard shortcuts ready" first. page.keyboard has no
    # element to auto-wait for.


def test_practice_2_tooltip_show_and_dismiss(page: Page):
    page.goto("/play/10-keyboard-mouse")
    # TODO (independent): hover "About the Pro plan" and assert the tooltip
    # "Includes unlimited projects.". Move the mouse away and assert it is gone.
    # Hover again, press Escape, and assert it is gone again.


def test_practice_3_drag_through_the_board(page: Page):
    page.goto("/play/10-keyboard-mouse")
    # TODO (challenge): drag "Write tests" from To do into Done and assert it is
    # only in Done. Then use the "Move card" form (Card, Move to) to move "Review PR"
    # to In review, and try to move "Write tests" back to To do: assert the board
    # refuses. Wait for "Keyboard shortcuts ready" first,
    # or the first drag fires before the page is interactive.
