from playwright.sync_api import Page, expect


def test_practice_1_finds_all_three_test_stages(page: Page):
    page.goto("/play/02-test-anatomy")

    expect(page.get_by_test_id("arrange-step")).to_be_visible()
    expect(page.get_by_test_id("act-step")).to_be_visible()
    expect(page.get_by_test_id("assert-step")).to_be_visible()


def test_practice_2_verifies_the_stage_explanations(page: Page):
    page.goto("/play/02-test-anatomy")

    expect(page.get_by_test_id("arrange-step")).to_contain_text("prepare the test fixture")
    expect(page.get_by_test_id("act-step")).to_contain_text("one focused user action")
    expect(page.get_by_test_id("assert-step")).to_contain_text("web-first assertion")


def test_practice_3_documents_the_test_phases(page: Page):
    # Arrange
    page.goto("/play/02-test-anatomy")

    # Act
    page.get_by_role("button", name="Run demo test").click()

    # Assert
    expect(page.get_by_test_id("demo-result")).to_have_text("Demo test passed.")
