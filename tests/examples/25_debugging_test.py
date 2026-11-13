import pytest
from playwright.sync_api import ConsoleMessage, Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/25-debugging")


def test_practice_1_the_report_becomes_ready(page: Page):
    page.get_by_role("button", name="Generate report").click()
    expect(page.get_by_role("status")).to_have_text("Report ready.")


def test_practice_2_the_report_lists_every_region(page: Page):
    page.get_by_role("button", name="Generate report").click()
    data_rows = (
        page.get_by_role("table", name="Revenue by region")
        .get_by_role("row")
        .filter(has=page.get_by_role("cell"))
    )
    expect(data_rows, "report should list North, South and West").to_have_count(3)


def test_practice_3_no_console_errors_while_generating(page: Page):
    errors: list[str] = []

    def collect(message: ConsoleMessage):
        if message.type == "error":
            errors.append(message.text)

    page.on("console", collect)
    page.get_by_role("button", name="Generate report").click()
    expect(page.get_by_role("status")).to_have_text("Report ready.")
    assert errors == [], "the browser console should stay clean"
