import re

import pytest
from playwright.sync_api import Browser, Page, expect


def test_practice_1_logs_in_through_the_form(page: Page):
    page.goto("/shop/login")
    page.get_by_label("Username").fill("student")
    page.get_by_label("Password").fill("playwright")
    page.get_by_role("button", name="Sign in").click()

    expect(page).to_have_url(re.compile(r"/shop/account$"))
    expect(page.get_by_role("heading", name="My account")).to_be_visible()
    expect(page.get_by_text("Signed in as student")).to_be_visible()


def test_practice_2_signing_out_ends_the_session(page: Page):
    page.request.post("/api/shop/login", data={"username": "student", "password": "playwright"})
    page.goto("/shop/account")
    page.get_by_role("button", name="Sign out").click()
    expect(page).to_have_url(re.compile(r"/shop/login"))

    page.goto("/shop/account")
    expect(page).to_have_url(re.compile(r"/shop/login"))


@pytest.fixture(scope="module")
def state_path(browser: Browser, tmp_path_factory):
    path = tmp_path_factory.mktemp("auth") / "state.json"
    context = browser.new_context()
    context.request.post("/api/shop/login", data={"username": "student", "password": "playwright"})
    context.storage_state(path=path)
    context.close()
    return path


def test_practice_3_the_saved_session_opens_the_account(browser: Browser, state_path):
    context = browser.new_context(storage_state=state_path)
    page = context.new_page()
    page.goto("/shop/account")
    expect(page.get_by_text("Signed in as student")).to_be_visible()
    context.close()


def test_practice_3_a_visitor_without_a_session_is_sent_to_the_login_page(page: Page, state_path):
    page.goto("/shop/account")
    expect(page).to_have_url(re.compile(r"/shop/login"))
    expect(page.get_by_text("Signed in as")).to_have_count(0)
