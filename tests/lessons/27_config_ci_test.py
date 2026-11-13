# Lesson 27 — Config, parallelism & CI
# Configure the viewport for a file, poll a service until it is healthy, and
# add unique team members in parallel.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/27_config_ci_test.py
#   npm run check -- 27-config-ci --python
import pytest
from playwright.sync_api import Page, expect


# TODO (guided): @pytest.mark.browser_context_args(viewport={"width": 1280, "height": 720})
def test_practice_1_reports_the_configured_viewport(page: Page):
    page.goto("/play/27-config-ci")
    # TODO: assert "Viewport: 1280 × 720".


def test_practice_2_waits_until_the_service_is_healthy(page: Page):
    page.goto("/play/27-config-ci")
    # TODO (independent): Python has no toPass(). Retry "click Refresh status +
    # expect Healthy with timeout=1_000" in a loop until a time.monotonic()
    # deadline, re-raising the AssertionError once it passes.


# TODO (challenge): parametrize test_practice_3_... over two roles ("coach",
# "athlete"). Each adds a member with a unique name (uuid.uuid4()) and asserts
# exactly one list item has that name, so the tests stay safe under
# pytest-xdist (pytest -n 2).
