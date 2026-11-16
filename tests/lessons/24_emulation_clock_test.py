# Lesson 24 — Emulation & clock
# Freeze the clock for the greeting, format prices for Berlin, and test a
# session timeout on a phone without waiting.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/24_emulation_clock_test.py
#   npm run check -- 24-emulation-clock --python
import pytest
from playwright.sync_api import Page, expect


def test_practice_1_freeze_time(page: Page):
    # TODO (guided): Pin the clock to 08:00 on 1 March 2026 BEFORE goto
    # (page.clock.set_fixed_time(datetime(...))) and prove the greeting.
    page.goto("/play/24-emulation-clock")


# TODO (independent): set the environment with @pytest.mark.browser_context_args
def test_practice_2_formats_prices_and_times_for_berlin(page: Page):
    page.goto("/play/24-emulation-clock")
    # TODO: prove German price formatting (1.234,50) and that the event at
    # 12:00 UTC shows Berlin's local time.


# TODO (challenge): @pytest.mark.browser_context_args with a 390x844 viewport,
# geolocation 47.4979 / 19.0402 and the permission it needs.
def test_practice_3_shows_the_mobile_menu_and_the_nearest_gym(page: Page):
    page.goto("/play/24-emulation-clock")
    # TODO: the mobile menu button exists; the nearest gym is found.


# TODO (challenge): same mark as above.
def test_practice_3_warns_about_session_timeout(page: Page):
    # TODO: install a fake clock BEFORE goto. Prove the expiry notice is NOT
    # shown just before the limit, IS shown right after, and that "Stay signed
    # in" restarts the countdown. Never wait in real time.
    page.goto("/play/24-emulation-clock")
