# Lesson 02 — Your first Playwright test
# Verify the three stages of a test, their explanations, and the demo run.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/02_test_anatomy_test.py
#   npm run check -- 02-test-anatomy --python
from playwright.sync_api import Page, expect


def test_practice_1_find_the_three_stages(page: Page):
    page.goto("/play/02-test-anatomy")
    # TODO (guided): Assert that the arrange-step, act-step and assert-step test
    # ids are all visible.


def test_practice_2_verify_the_explanations(page: Page):
    page.goto("/play/02-test-anatomy")
    # TODO (independent): Assert the user-facing explanation text of each stage
    # with to_contain_text.
    # Hint: Act should mention "one focused user action".


def test_practice_3_structure_a_readable_test(page: Page):
    # TODO (challenge): Structure the test in three commented phases
    # (# Arrange, # Act, # Assert): open the page, click Run demo test, and
    # assert "Demo test passed.".
    pass
