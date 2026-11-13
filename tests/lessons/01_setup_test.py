# Lesson 01 — Setup & first run
# Run your first spec, then add assertions for the title, the training
# button, and the setup checklist.
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


def test_practice_2_record_a_click_with_codegen(page: Page):
    page.goto("/play/01-setup")
    # TODO (independent): run
    #   playwright codegen --target python-pytest http://127.0.0.1:3000/play/01-setup
    # click "Start training", record a visibility assertion for
    # "Training started. Good luck!", and paste the useful lines here.


def test_practice_3_count_the_setup_checklist(page: Page):
    page.goto("/play/01-setup")
    # TODO (challenge): assert that the list named "Setup checklist" has exactly
    # 4 items. Hint: get_by_role("list", name=...).get_by_role("listitem").
