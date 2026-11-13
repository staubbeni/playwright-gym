import time
import uuid

import pytest
from playwright.sync_api import Page, expect


@pytest.mark.browser_context_args(viewport={"width": 1280, "height": 720})
def test_practice_1_reports_the_configured_viewport(page: Page):
    page.goto("/play/27-config-ci")
    expect(page.get_by_test_id("viewport")).to_have_text("Viewport: 1280 × 720")


def test_practice_2_waits_until_the_service_is_healthy(page: Page):
    page.goto("/play/27-config-ci")
    status = page.get_by_test_id("service-status")
    # Python has no toPass(): retry the whole block until a deadline.
    deadline = time.monotonic() + 10
    while True:
        page.get_by_role("button", name="Refresh status").click()
        try:
            expect(status).to_have_text("Healthy", timeout=1_000)
            break
        except AssertionError:
            if time.monotonic() > deadline:
                raise


@pytest.mark.parametrize("role", ["coach", "athlete"])
def test_practice_3_adds_a_unique_member(page: Page, role: str):
    name = f"{role}-{uuid.uuid4().hex}"
    page.goto("/play/27-config-ci")
    page.get_by_label("Member name").fill(name)
    page.get_by_role("button", name="Add member").click()
    members = page.get_by_role("list", name="Members")
    expect(members.get_by_text(name, exact=True)).to_have_count(1)
