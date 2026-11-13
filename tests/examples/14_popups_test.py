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


def test_practice_2_approval_is_reported_to_the_opener(page: Page):
    with page.expect_popup() as popup_info:
        page.get_by_role("button", name="Open payment window").click()
    popup = popup_info.value
    popup.get_by_role("button", name="Approve payment").click()
    expect(page.get_by_role("status")).to_have_text("Payment approved.")


def test_practice_3_opens_the_terms_in_a_new_tab(page: Page):
    with page.expect_popup() as popup_info:
        page.get_by_role("link", name="Read the terms").click()
    terms = popup_info.value
    expect(terms).to_have_url(re.compile(r"/popup/terms$"))
    expect(terms.get_by_role("heading", name="Terms of service")).to_be_visible()
