# Lesson 02 — Your first Playwright test
# Verify the three stages of a test, read a failing one, and structure a test
# in phases.
#
# Copy this file to tests/solutions/ before editing, then run:
#   npm run check -- 02-test-anatomy --python
from playwright.sync_api import Page, expect


def test_practice_1_find_the_three_stages(page: Page):
    page.goto("/play/02-test-anatomy")
    # TODO (guided): Assert that the arrange-step, act-step and assert-step test
    # ids are all visible.


# Practice 2 FAILS on purpose. Run it, read the "Expected" and "Actual" lines in
# the error, and fix the test (not the page).
def test_practice_2_read_the_failure(page: Page):
    page.goto("/play/02-test-anatomy")
    expect(page.get_by_test_id("arrange-step")).to_contain_text("prepare the test fixture")
    expect(page.get_by_test_id("act-step")).to_have_text("Perform one focused user action.")


def test_practice_3_structure_a_readable_test(page: Page):
    # TODO (challenge): three commented phases (# Arrange, # Act, # Assert). Open
    # /play/02-test-anatomy, click "Run demo test", then assert the verdict
    # "Demo test passed." and the counter "Stages completed: 3 of 3".
    ...
