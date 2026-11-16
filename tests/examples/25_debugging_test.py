import pytest
from playwright.sync_api import ConsoleMessage, Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/25-debugging")


def test_practice_1_the_report_becomes_ready(page: Page):
    page.get_by_role("button", name="Generate report").click()
    expect(page.get_by_role("status")).to_have_text("Report ready.")


def test_practice_2_the_report_is_complete_and_plausible(page: Page):
    page.get_by_role("button", name="Generate report").click()
    data_rows = (
        page.get_by_role("table", name="Revenue by region")
        .get_by_role("row")
        .filter(has=page.get_by_role("cell"))
    )
    expect(data_rows, "report should list North, South and West").to_have_count(3)
    expect(data_rows.filter(has_text="$0"), "no region should report $0 revenue").to_have_count(0)
    expect(data_rows.get_by_role("cell").nth(5), "West revenue should be shown").to_have_text("$15,100")


def test_practice_3_a_clean_report(page: Page, tmp_path):
    console_errors: list[str] = []
    page_errors: list[str] = []

    def collect(message: ConsoleMessage):
        if message.type == "error":
            console_errors.append(message.text)

    page.on("console", collect)
    page.on("pageerror", lambda error: page_errors.append(error.message))
    page.context.tracing.start(screenshots=True, snapshots=True)
    page.get_by_role("button", name="Generate report").click()
    expect(page.get_by_role("status")).to_have_text("Report ready.")
    page.context.tracing.stop(path=tmp_path / "trace.zip")
    assert console_errors == [], "the browser console should stay clean"
    assert page_errors == [], "no uncaught page errors"
