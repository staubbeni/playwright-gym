import re
from datetime import datetime

import pytest
from playwright.sync_api import Page, expect


def test_practice_1_greets_in_the_morning(page: Page):
    page.clock.set_fixed_time(datetime(2026, 3, 1, 8, 0, 0))
    page.goto("/play/24-emulation-clock")
    expect(page.get_by_test_id("greeting")).to_have_text("Good morning")


@pytest.mark.browser_context_args(locale="de-DE", timezone_id="Europe/Berlin")
def test_practice_2_formats_prices_and_times_for_berlin(page: Page):
    page.goto("/play/24-emulation-clock")
    expect(page.get_by_test_id("price")).to_have_text(re.compile(r"1\.234,50"))
    expect(page.get_by_test_id("event-time")).to_have_text("14:00")


@pytest.mark.browser_context_args(
    viewport={"width": 390, "height": 844},
    geolocation={"latitude": 47.4979, "longitude": 19.0402},
    permissions=["geolocation"],
)
def test_practice_3_shows_the_mobile_menu_and_the_nearest_gym(page: Page):
    page.goto("/play/24-emulation-clock")
    expect(page.get_by_role("button", name="Open menu")).to_be_visible()
    page.get_by_role("button", name="Find nearest gym").click()
    expect(page.get_by_test_id("nearest-gym")).to_have_text("Nearest gym: Budapest Central")
