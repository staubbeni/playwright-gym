# Lesson 25 — Debugging & trace viewer
# Fix a failing test from its call log, explain your assertions, and fail on
# console and page errors.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/25_debugging_test.py
#   npm run check -- 25-debugging --python
from playwright.sync_api import Page, expect


def test_practice_1_read_the_call_log(page: Page):
    page.goto("/play/25-debugging")
    # This test FAILS. Run it (add --tracing on to keep a trace), read the
    # error and the call log, then fix it.
    page.get_by_role("button", name="Create report").click()
    expect(page.get_by_role("status")).to_have_text("Report ready.")


def test_practice_2_explain_your_assertions(page: Page):
    page.goto("/play/25-debugging")
    # TODO (independent): generate the report, then check that it lists every
    # region and that every revenue figure is real. Give each expect() a message.


def test_practice_3_a_clean_report(page: Page):
    page.goto("/play/25-debugging")
    # TODO (challenge): collect console errors (page.on("console", ...)) AND
    # uncaught page errors (page.on("pageerror", ...)), record a trace with
    # page.context.tracing.start(...) / .stop(path=...), and prove both lists
    # are empty once the report is ready.
