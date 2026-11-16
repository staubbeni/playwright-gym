# Lesson 27 — Config, parallelism & CI
# Configure the viewport per test, poll a service until it is healthy, and keep
# shared data safe when tests run in parallel.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/27_config_ci_test.py
#   npm run check -- 27-config-ci --python
import pytest
from playwright.sync_api import Page, expect


# TODO (guided): configure a 1280 × 720 window with @pytest.mark.browser_context_args(...)
def test_practice_1_reports_the_configured_viewport(page: Page):
    page.goto("/play/27-config-ci")
    # TODO: prove the page agrees.


def test_practice_2_waits_until_the_service_is_healthy(page: Page):
    page.goto("/play/27-config-ci")
    # TODO (independent): the service says "Degraded" for its first few checks.
    # Python has no toPass(): retry "click Refresh status + expect Healthy with
    # timeout=1_000" in a loop until a time.monotonic() deadline, re-raising the
    # AssertionError once it passes.


# TODO (challenge): parametrize test_practice_3_... over two roles. Each adds a
# member with a unique name (uuid.uuid4()) and proves exactly one list item
# shows that name in full (safe under pytest -n 2). Add a second
# test_practice_3_... that adds a member, reloads and proves it is still listed.
