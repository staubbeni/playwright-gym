# Lesson 17 — Authentication & storage state
# Log in through the form, prove that sign-out ends the session, and share one
# saved login across a logged-in and a logged-out test.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/17_auth_storage_test.py
#   npm run check -- 17-auth-storage --python
import pytest
from playwright.sync_api import Browser, Page, expect


def test_practice_1_log_in_through_the_ui(page: Page):
    page.goto("/shop/login")
    # TODO (guided): sign in with the demo account shown on the page and prove you
    # end up signed in on your account page.


def test_practice_2_sign_out_ends_the_session(page: Page):
    # TODO (independent): sign in (UI or page.request), sign out, and prove the
    # session is really over: the account page must no longer be reachable.
    pass


# TODO (challenge): write a module-scoped fixture that logs in once through the
# API (make a context with browser.new_context(), use context.request) and saves
# context.storage_state(path=...) into tmp_path_factory.mktemp(...). Use it in:
#   - a test that opens browser.new_context(storage_state=path) and is logged in
#   - a test with the plain `page` fixture that is logged out and sent to the
#     login page (give it the fixture too, so the login really happened first)
@pytest.fixture(scope="module")
def state_path(browser: Browser, tmp_path_factory):
    pass


def test_practice_3_the_saved_session_opens_the_account(browser: Browser, state_path):
    pass
