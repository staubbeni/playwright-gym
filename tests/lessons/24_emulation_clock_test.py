# Lesson 24 — Emulation & clock
# Freeze the clock for the greeting, format prices in German, and use a phone
# viewport with geolocation.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/24_emulation_clock_test.py
#   npm run check -- 24-emulation-clock --python
import pytest
from playwright.sync_api import Page, expect


def test_practice_1_freeze_time(page: Page):
    # TODO (guided): page.clock.set_fixed_time(datetime(2026, 3, 1, 8, 0, 0))
    # BEFORE goto, then assert the greeting "Good morning".
    page.goto("/play/24-emulation-clock")


# TODO (independent): @pytest.mark.browser_context_args(locale="de-DE", timezone_id="Europe/Berlin")
def test_practice_2_formats_prices_and_times_for_berlin(page: Page):
    page.goto("/play/24-emulation-clock")
    # TODO: assert the price matches re.compile(r"1\.234,50") and the event time is "14:00".


# TODO (challenge): @pytest.mark.browser_context_args(viewport={"width": 390, "height": 844},
#   geolocation={"latitude": 47.4979, "longitude": 19.0402}, permissions=["geolocation"])
def test_practice_3_shows_the_mobile_menu_and_the_nearest_gym(page: Page):
    page.goto("/play/24-emulation-clock")
    # TODO: assert "Open menu" is visible, click "Find nearest gym", and assert
    # "Nearest gym: Budapest Central".
