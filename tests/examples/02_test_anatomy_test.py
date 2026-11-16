from playwright.sync_api import Page, expect


def test_practice_1_finds_all_three_test_stages(page: Page):
    page.goto("/play/02-test-anatomy")

    expect(page.get_by_test_id("arrange-step")).to_be_visible()
    expect(page.get_by_test_id("act-step")).to_be_visible()
    expect(page.get_by_test_id("assert-step")).to_be_visible()


def test_practice_2_the_explanations_match_the_page(page: Page):
    page.goto("/play/02-test-anatomy")

    expect(page.get_by_test_id("arrange-step")).to_contain_text("prepare the test fixture")
    expect(page.get_by_test_id("act-step")).to_contain_text("Perform one focused user action.")


def test_practice_3_documents_the_test_phases(page: Page):
    # Arrange
    page.goto("/play/02-test-anatomy")

    # Act
    page.get_by_role("button", name="Run demo test").click()

    # Assert
    expect(page.get_by_test_id("demo-result")).to_have_text("Demo test passed.")
    expect(page.get_by_test_id("stage-count")).to_have_text("Stages completed: 3 of 3")
