# Lesson 26 — Contexts & isolation
# Save a note, prove another context can't see it, and prove a login doesn't
# leak to a guest.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/26_contexts_test.py
#   npm run check -- 26-contexts --python
from playwright.sync_api import Browser, Page, expect


def test_practice_1_save_in_this_context(page: Page):
    page.goto("/play/26-contexts")
    # TODO (guided): save the note "hello", reload, and assert "Saved note: hello".


def test_practice_2_not_visible_elsewhere(page: Page, browser: Browser):
    page.goto("/play/26-contexts")
    # TODO (independent): save "hello" here, then create browser.new_context(),
    # open the page there, and assert "No saved note.". Close the context.


def test_practice_3_two_users(page: Page, browser: Browser):
    # TODO (challenge): log in this context via page.request. In a fresh guest
    # context open /shop/account and assert it lands on /shop/login, while this
    # page sees "Signed in as student".
    pass
