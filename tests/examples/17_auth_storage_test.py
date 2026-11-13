import re

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


def test_practice_3_reuses_a_saved_storage_state(page: Page, browser: Browser, tmp_path):
    page.request.post("/api/shop/login", data={"username": "student", "password": "playwright"})
    state_path = tmp_path / "state.json"
    page.context.storage_state(path=state_path)

    context = browser.new_context(storage_state=state_path)
    restored = context.new_page()
    restored.goto("/shop/account")
    expect(restored.get_by_text("Signed in as student")).to_be_visible()
    context.close()
