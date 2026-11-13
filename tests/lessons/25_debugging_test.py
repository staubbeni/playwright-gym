# Lesson 25 — Debugging & trace viewer
# Assert the report state, give your assertions clear messages, and fail on
# console errors.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/25_debugging_test.py
#   npm run check -- 25-debugging --python
from playwright.sync_api import Page, expect


def test_practice_1_assert_the_final_state(page: Page):
    page.goto("/play/25-debugging")
    # TODO (guided): Click "Generate report" and assert the status "Report
    # ready.". If it fails, run with --tracing on and open the trace with
    # playwright show-trace test-results/.../trace.zip.


def test_practice_2_assertion_messages(page: Page):
    page.goto("/play/25-debugging")
    # TODO (independent): Assert the report table has 3 data rows, with a custom
    # message as the second argument of expect().


def test_practice_3_fail_on_console_errors(page: Page):
    page.goto("/play/25-debugging")
    # TODO (challenge): Collect console messages of type "error" during report
    # generation (page.on("console", ...)) and assert the list is empty once the
    # report is ready.
