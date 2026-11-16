# Lesson 26 — Contexts & isolation
# Save a note, prove another context can't see it, and prove two users share
# the roster but not their sign-in.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/26_contexts_test.py
#   npm run check -- 26-contexts --python
from playwright.sync_api import Browser, Page, expect


def test_practice_1_save_in_this_context(page: Page):
    page.goto("/play/26-contexts")
    # TODO (guided): save a note and prove it is still shown after a reload.


def test_practice_2_not_visible_elsewhere(page: Page, browser: Browser):
    page.goto("/play/26-contexts")
    # TODO (independent): save a note here, then prove a brand-new
    # browser.new_context() does not see it. Close the context.


def test_practice_3_two_users_one_roster(page: Page, browser: Browser):
    # TODO (challenge): user A (this page) signs in and adds a teammate with a
    # unique name. User B (a second context) must not look signed in as A, but
    # must see the teammate after a reload. Close the contexts you create.
    pass
