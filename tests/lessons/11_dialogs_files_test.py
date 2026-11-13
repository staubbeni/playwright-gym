# Lesson 11 — Dialogs, uploads & downloads
# Delete an account through a confirm dialog, upload an avatar, and verify
# an exported CSV.
#
# Copy this file to tests/solutions/ before editing, then run:
#   pytest tests/solutions/11_dialogs_files_test.py
#   npm run check -- 11-dialogs-files --python
from playwright.sync_api import Page, expect


def test_practice_1_confirm_dialog(page: Page):
    page.goto("/play/11-dialogs-files")
    # TODO (guided): Accept the dialog opened by "Delete account" (assert its
    # message contains "cannot be undone") and assert "Account deleted.".
    # Hint: page.once("dialog", handler) before the click.


def test_practice_2_upload_a_file(page: Page):
    page.goto("/play/11-dialogs-files")
    # TODO (independent): Upload an in-memory avatar.png through "Upload avatar"
    # and assert the text starts with "Uploaded avatar.png".
    # Hint: set_input_files(files=[{"name": ..., "mimeType": ..., "buffer": b"..."}])


def test_practice_3_inspect_a_download(page: Page):
    page.goto("/play/11-dialogs-files")
    # TODO (challenge): Download via "Export CSV" (with page.expect_download()
    # as download_info: ...). Assert the filename is report.csv and the content
    # starts with "id,name,score".
