import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/10-keyboard-mouse")


def test_practice_1_runs_a_command_from_the_palette(page: Page):
    # page.keyboard has no element to auto-wait for: wait until the app listens.
    expect(page.get_by_text("Keyboard shortcuts ready")).to_be_visible()
    page.keyboard.press("ControlOrMeta+K")
    command = page.get_by_role("dialog", name="Command palette").get_by_label("Command")
    command.fill("cart")
    command.press("Enter")
    expect(page.get_by_test_id("command-result")).to_have_text("Opened: Cart")


def test_practice_2_shows_a_tooltip_on_hover(page: Page):
    page.get_by_role("button", name="About the Pro plan").hover()
    expect(page.get_by_role("tooltip")).to_have_text("Includes unlimited projects.")


def test_practice_3_drags_a_card_to_done(page: Page):
    todo = page.get_by_role("list", name="To do")
    done = page.get_by_role("list", name="Done")
    todo.get_by_text("Write tests").drag_to(done)
    expect(done.get_by_text("Write tests")).to_be_visible()
    expect(todo.get_by_text("Write tests")).to_have_count(0)
