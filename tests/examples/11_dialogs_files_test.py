import pytest
from playwright.sync_api import Dialog, Page, expect


@pytest.fixture(autouse=True)
def open_lesson(page: Page):
    page.goto("/play/11-dialogs-files")


def test_practice_1_accepts_the_delete_confirmation(page: Page):
    def accept(dialog: Dialog):
        assert "cannot be undone" in dialog.message
        dialog.accept()

    page.once("dialog", accept)
    page.get_by_role("button", name="Delete account").click()
    expect(page.get_by_test_id("account-status")).to_have_text("Account deleted.")


def test_practice_2_uploads_an_avatar_and_refuses_other_files(page: Page):
    upload = page.get_by_label("Upload avatar")
    upload.set_input_files(files={"name": "avatar.png", "mimeType": "image/png", "buffer": b"fake-png-bytes"})
    expect(page.get_by_test_id("upload-status")).to_have_text("Uploaded avatar.png (14 bytes)")

    upload.set_input_files(files={"name": "notes.txt", "mimeType": "text/plain", "buffer": b"hello"})
    expect(page.get_by_test_id("upload-status")).to_have_text("Only image files are allowed.")


def test_practice_3_exports_a_csv_and_imports_it_back(page: Page):
    with page.expect_download() as download_info:
        page.get_by_role("button", name="Export CSV").click()
    download = download_info.value
    assert download.suggested_filename == "report.csv"

    path = download.path()
    content = open(path, encoding="utf-8").read()
    assert content.startswith("id,name,score")
    assert "Ada" in content
    assert "Grace" in content

    page.get_by_label("Import CSV").set_input_files(path)
    expect(page.get_by_test_id("import-status")).to_have_text("Imported 2 rows.")
