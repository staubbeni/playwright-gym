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


def test_practice_2_shows_and_dismisses_the_tooltip(page: Page):
    info = page.get_by_role("button", name="About the Pro plan")
    tooltip = page.get_by_role("tooltip")

    info.hover()
    expect(tooltip).to_have_text("Includes unlimited projects.")

    page.mouse.move(0, 0)
    expect(tooltip).to_be_hidden()

    info.hover()
    expect(tooltip).to_be_visible()
    page.keyboard.press("Escape")
    expect(tooltip).to_be_hidden()


def test_practice_3_drags_a_card_and_uses_the_move_menus(page: Page):
    todo = page.get_by_role("list", name="To do")
    review = page.get_by_role("list", name="In review")
    done = page.get_by_role("list", name="Done")

    # Drag handlers exist only after hydration.
    expect(page.get_by_text("Keyboard shortcuts ready")).to_be_visible()
    todo.get_by_text("Write tests").drag_to(done)
    expect(done.get_by_text("Write tests")).to_be_visible()
    expect(todo.get_by_text("Write tests")).to_have_count(0)

    def move_card(card: str, target: str):
        page.get_by_label("Card").select_option(card)
        page.get_by_label("Move to").select_option(target)
        page.get_by_role("button", name="Move card").click()

    move_card("Review PR", "In review")
    expect(review.get_by_text("Review PR")).to_be_visible()
    expect(todo.get_by_text("Review PR")).to_have_count(0)

    # Cards only move forward.
    move_card("Write tests", "To do")
    expect(done.get_by_text("Write tests")).to_be_visible()
    expect(todo.get_by_text("Write tests")).to_have_count(0)
