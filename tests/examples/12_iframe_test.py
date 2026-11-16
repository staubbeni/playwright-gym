import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/12-iframe")


def test_practice_1_pays_inside_the_frame(page: Page):
    frame = page.get_by_title("Payment form").content_frame
    frame.get_by_label("Card number").fill("4242424242424242")
    frame.get_by_label("Expiry").fill("12/30")
    frame.get_by_role("button", name="Pay now").click()
    expect(frame.get_by_role("status")).to_have_text("Payment confirmed.")


def test_practice_2_rejects_a_short_card_and_a_malformed_expiry(page: Page):
    frame = page.frame_locator("iframe[title='Payment form']")
    pay = frame.get_by_role("button", name="Pay now")

    frame.get_by_label("Card number").fill("1234")
    pay.click()
    expect(frame.get_by_role("alert")).to_have_text("Card number must be 16 digits.")

    frame.get_by_label("Card number").fill("4242424242424242")
    frame.get_by_label("Expiry").fill("13/99")
    pay.click()
    expect(frame.get_by_role("alert")).to_have_text("Expiry must be MM/YY.")


def test_practice_3_the_host_learns_about_the_payment_and_can_start_over(page: Page):
    frame = page.get_by_title("Payment form").content_frame
    frame.get_by_label("Card number").fill("4242424242424242")
    frame.get_by_label("Expiry").fill("12/30")
    frame.get_by_role("button", name="Pay now").click()
    expect(frame.get_by_role("status")).to_have_text("Payment confirmed.")
    expect(page.get_by_test_id("order-status")).to_have_text("Order paid.")

    page.get_by_role("button", name="Start over").click()
    expect(frame.get_by_role("status")).to_have_text("Ready for payment.")
    expect(page.get_by_test_id("order-status")).to_have_text("Awaiting payment.")
