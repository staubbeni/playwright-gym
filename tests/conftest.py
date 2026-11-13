# Shared fixtures for the Python track (pytest-playwright, sync API).
#
# GYM_BUG=<flags> switches on planted bugs, exactly like playwright.config.ts:
# every browser context and API request context sends the x-gym-bug header.
import os
import re
from pathlib import Path

import pytest
from PIL import Image, ImageChops
from playwright.sync_api import APIRequest, Browser, Playwright

PORT = int(os.environ.get("PORT", "3000"))
BASE_URL = f"http://127.0.0.1:{PORT}"
BUG_FLAGS = os.environ.get("GYM_BUG", "")


def _with_gym_defaults(method):
    def wrapper(self, *args, **kwargs):
        kwargs.setdefault("base_url", BASE_URL)
        if BUG_FLAGS:
            kwargs["extra_http_headers"] = {**(kwargs.get("extra_http_headers") or {}), "x-gym-bug": BUG_FLAGS}
        return method(self, *args, **kwargs)

    return wrapper


# shortcut: patches Playwright's public sync classes so contexts you create
# yourself (browser.new_context(), playwright.request.new_context()) get the
# base URL and bug header too, as in the TS config; revisit if Playwright
# renames them.
Browser.new_context = _with_gym_defaults(Browser.new_context)
Browser.new_page = _with_gym_defaults(Browser.new_page)
APIRequest.new_context = _with_gym_defaults(APIRequest.new_context)


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture
def api_request_context(playwright: Playwright):
    """An APIRequestContext with the gym's base URL: the Python `request` fixture."""
    context = playwright.request.new_context()
    yield context
    context.dispose()


@pytest.fixture
def assert_snapshot(request):
    """assert_snapshot(page_or_locator, "name.png", **screenshot_options).

    Compares a screenshot with a baseline in __snapshots__/ next to the test
    file. A missing baseline is written and the test fails, like Playwright's
    toHaveScreenshot(); GYM_UPDATE_SNAPSHOTS=missing writes it and passes.
    """
    folder = Path(request.path).parent / "__snapshots__" / re.sub(r"\W+", "_", request.node.name)

    def check(target, name: str, max_diff_pixels: int = 0, **options):
        baseline = folder / name
        # Like toHaveScreenshot(): wait until two consecutive shots match, so a
        # blinking or still-settling element doesn't flip the result.
        actual, previous = target.screenshot(**options), None
        for _ in range(10):
            if actual == previous:
                break
            previous, actual = actual, target.screenshot(**options)
        if not baseline.exists():
            folder.mkdir(parents=True, exist_ok=True)
            baseline.write_bytes(actual)
            if os.environ.get("GYM_UPDATE_SNAPSHOTS") != "missing":
                pytest.fail(f"Missing baseline, wrote {baseline}. Run again.")
            return
        actual_path = folder / f"actual-{name}"
        actual_path.write_bytes(actual)
        expected_image = Image.open(baseline).convert("RGBA")
        actual_image = Image.open(actual_path).convert("RGBA")
        assert expected_image.size == actual_image.size, f"{name}: size {actual_image.size} != {expected_image.size}"
        diff = ImageChops.difference(expected_image, actual_image)
        changed = sum(1 for pixel in diff.getdata() if any(pixel))
        assert changed <= max_diff_pixels, f"{name}: {changed} pixels differ (allowed {max_diff_pixels}), see {actual_path}"
        actual_path.unlink()

    return check
