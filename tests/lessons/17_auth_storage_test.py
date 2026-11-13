# Lesson 17 — Authentication & storage state
# Log in through the form, prove that sign-out ends the session, and reuse a
# saved session in a fresh context.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/17_auth_storage_test.py
#   npm run check -- 17-auth-storage --python
from playwright.sync_api import Browser, Page, expect


def test_practice_1_log_in_through_the_ui(page: Page):
    page.goto("/shop/login")
    # TODO (guided): sign in as student / playwright. Assert the URL ends with
    # /shop/account, the heading "My account", and "Signed in as student".


def test_practice_2_sign_out_ends_the_session(page: Page):
    # TODO (independent): log in (UI or page.request), click "Sign out", then
    # open /shop/account again and assert you end up on /shop/login.
    pass


def test_practice_3_reuse_storage_state(page: Page, browser: Browser, tmp_path):
    # TODO (challenge):
    # 1. Log in with page.request.post("/api/shop/login", data={...}).
    # 2. Save page.context.storage_state(path=tmp_path / "state.json").
    # 3. browser.new_context(storage_state=...), open /shop/account there,
    #    and assert "Signed in as student". Close the new context at the end.
    pass
