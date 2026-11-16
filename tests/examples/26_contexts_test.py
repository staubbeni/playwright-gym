import uuid

from playwright.sync_api import Browser, Page, expect


def save_note(page: Page, text: str):
    page.goto("/play/26-contexts")
    page.get_by_label("Session note").fill(text)
    page.get_by_role("button", name="Save note").click()
    expect(page.get_by_test_id("saved-note")).to_have_text(f"Saved note: {text}")


def test_practice_1_a_saved_note_survives_a_reload(page: Page):
    save_note(page, "hello")
    page.reload()
    expect(page.get_by_test_id("saved-note")).to_have_text("Saved note: hello")


def test_practice_2_another_context_cannot_see_the_note(page: Page, browser: Browser):
    save_note(page, "hello")

    other = browser.new_context()
    other_page = other.new_page()
    other_page.goto("/play/26-contexts")
    expect(other_page.get_by_test_id("saved-note")).to_have_text("No saved note.")
    other.close()


def test_practice_3_two_users_share_the_roster_but_not_the_sign_in(page: Page, browser: Browser):
    teammate = f"mate-{uuid.uuid4().hex}"
    page.goto("/play/26-contexts")
    page.get_by_label("Your name").fill("Ada")
    page.get_by_role("button", name="Sign in").click()
    expect(page.get_by_test_id("whoami")).to_have_text("Signed in as Ada")

    other = browser.new_context()
    other_page = other.new_page()
    other_page.goto("/play/26-contexts")
    expect(other_page.get_by_test_id("whoami")).to_have_text("Not signed in")

    page.get_by_label("Teammate").fill(teammate)
    page.get_by_role("button", name="Add teammate").click()
    expect(page.get_by_role("list", name="Roster").get_by_text(teammate, exact=True)).to_be_visible()

    other_page.reload()
    expect(other_page.get_by_role("list", name="Roster").get_by_text(teammate, exact=True)).to_be_visible()
    expect(other_page.get_by_test_id("whoami")).to_have_text("Not signed in")
    other.close()
