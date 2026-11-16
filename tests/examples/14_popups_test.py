import re

import pytest
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/14-popups")


def test_practice_1_opens_the_payment_popup(page: Page):
    with page.expect_popup() as popup_info:
        page.get_by_role("button", name="Open payment window").click()
    popup = popup_info.value
    expect(popup.get_by_role("heading", name="Payment window")).to_be_visible()


def test_practice_2_approval_is_reported_and_the_popup_closes(page: Page):
    with page.expect_popup() as popup_info:
        page.get_by_role("button", name="Open payment window").click()
    popup = popup_info.value

    with popup.expect_event("close"):
        popup.get_by_role("button", name="Approve payment").click()
    expect(page.get_by_role("status")).to_have_text("Payment approved.")


def test_practice_3_handles_two_windows_at_once(page: Page):
    with page.expect_popup() as payment_info:
        page.get_by_role("button", name="Open payment window").click()
    payment = payment_info.value
    expect(payment.get_by_role("heading", name="Payment window")).to_be_visible()

    with page.expect_popup() as terms_info:
        page.get_by_role("link", name="Read the terms").click()
    terms = terms_info.value
    expect(terms).to_have_url(re.compile(r"/popup/terms$"))
    expect(terms.get_by_role("heading", name="Terms of service")).to_be_visible()

    expect(page.get_by_role("status")).to_have_text("Waiting for approval...")
