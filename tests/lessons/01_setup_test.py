# Lesson 01 — Setup & first run
# Run your first spec, clean up a recorded test, and assert the checklist.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/01_setup_test.py
#   npm run check -- 01-setup --python
import re

from playwright.sync_api import Page, expect


# Practice 1 is solved for you: run it with
#   pytest tests/solutions/01_setup_test.py --headed
def test_practice_1_check_the_page_title(page: Page):
    page.goto("/play/01-setup")
    expect(page).to_have_title(re.compile("Setup"))


# Practice 2: this is what a quick codegen recording looks like. It works, but
# it is tied to CSS classes. Rewrite it with get_by_role / get_by_text, then
# compare with
#   playwright codegen --target python-pytest http://127.0.0.1:3000/play/01-setup
def test_practice_2_clean_up_a_recorded_test(page: Page):
    page.goto("/play/01-setup")
    page.locator("button.primary-button").click()
    expect(page.locator("p.result-panel")).to_contain_text("Training started")


def test_practice_3_assert_the_setup_checklist(page: Page):
    page.goto("/play/01-setup")
    # TODO (challenge): the list named "Setup checklist" has exactly four steps:
    # Install Node.js, Install Playwright, Run the example test, Open the HTML
    # report. Assert the steps and their text, in order.
    # Hint: get_by_role("list", name=...).get_by_role("listitem") and
    # to_have_text([...]).
