# Lesson 11 — Dialogs, uploads & downloads
# Accept a native dialog, upload files with rules, and round-trip a CSV.
#
# Copy this file to tests/solutions/ before editing, then run:
#   npm run check -- 11-dialogs-files --python
from playwright.sync_api import Page, expect


def test_practice_1_confirm_dialog(page: Page):
    page.goto("/play/11-dialogs-files")
    # TODO (guided): accept the dialog opened by "Delete account" (assert its
    # message contains "cannot be undone") and assert "Account deleted.".
    # Hint: register page.once("dialog", ...) BEFORE the click.


def test_practice_2_upload_with_rules(page: Page):
    page.goto("/play/11-dialogs-files")
    # TODO (independent): upload an in-memory avatar.png (content b"fake-png-bytes")
    # and assert "Uploaded avatar.png (14 bytes)". Then upload notes.txt and assert
    # "Only image files are allowed.".


def test_practice_3_download_then_import_it_back(page: Page):
    page.goto("/play/11-dialogs-files")
    # TODO (challenge): "Export CSV": assert the filename report.csv and that the
    # content starts with "id,name,score" and has the rows for Ada and Grace.
    # Then pass the downloaded file to "Import CSV" and assert "Imported 2 rows.".
