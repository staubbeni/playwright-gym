import re
from pathlib import Path

import pytest
from playwright.sync_api import Dialog, Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/11-dialogs-files")


def test_practice_1_accepts_the_delete_confirmation(page: Page):
    messages = []

    def accept(dialog: Dialog):
        messages.append(dialog.message)
        dialog.accept()

    page.once("dialog", accept)
    page.get_by_role("button", name="Delete account").click()
    expect(page.get_by_test_id("account-status")).to_have_text("Account deleted.")
    assert "cannot be undone" in messages[0]


def test_practice_2_uploads_an_avatar_from_memory(page: Page):
    page.get_by_label("Upload avatar").set_input_files(
        files=[{"name": "avatar.png", "mimeType": "image/png", "buffer": b"fake-png-bytes"}]
    )
    expect(page.get_by_test_id("upload-status")).to_have_text(re.compile(r"^Uploaded avatar\.png"))


def test_practice_3_exports_a_csv_report(page: Page):
    with page.expect_download() as download_info:
        page.get_by_role("button", name="Export CSV").click()
    download = download_info.value

    assert download.suggested_filename == "report.csv"
    content = Path(download.path()).read_text(encoding="utf8")
    assert content.startswith("id,name,score")
