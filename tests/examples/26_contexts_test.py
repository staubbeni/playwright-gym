import re

from playwright.sync_api import Browser, Page, expect


def test_practice_1_a_saved_note_survives_a_reload(page: Page):
    page.goto("/play/26-contexts")
    page.get_by_label("Session note").fill("hello")
    page.get_by_role("button", name="Save note").click()
    page.reload()
    expect(page.get_by_test_id("saved-note")).to_have_text("Saved note: hello")


def test_practice_2_another_context_cannot_see_the_note(page: Page, browser: Browser):
    page.goto("/play/26-contexts")
    page.get_by_label("Session note").fill("hello")
    page.get_by_role("button", name="Save note").click()
    expect(page.get_by_test_id("saved-note")).to_have_text("Saved note: hello")

    other = browser.new_context()
    other_page = other.new_page()
    other_page.goto("/play/26-contexts")
    expect(other_page.get_by_test_id("saved-note")).to_have_text("No saved note.")
    other.close()


def test_practice_3_a_login_does_not_leak_to_a_guest(page: Page, browser: Browser):
    page.request.post("/api/shop/login", data={"username": "student", "password": "playwright"})

    guest = browser.new_context()
    guest_page = guest.new_page()
    guest_page.goto("/shop/account")
    expect(guest_page).to_have_url(re.compile(r"/shop/login"))

    page.goto("/shop/account")
    expect(page.get_by_text("Signed in as student")).to_be_visible()
    guest.close()
