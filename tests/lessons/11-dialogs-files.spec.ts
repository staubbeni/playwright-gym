// Lesson 11 — Dialogs, uploads & downloads
// Accept a native dialog, upload files with rules, and round-trip a CSV.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 11-dialogs-files
import { expect, test } from "@playwright/test";

test("practice 1: confirm dialog", async ({ page }) => {
  await page.goto("/play/11-dialogs-files");
  // TODO (guided): accept the dialog opened by "Delete account" (assert its
  // message contains "cannot be undone") and assert "Account deleted.".
  // Hint: register page.once("dialog", ...) BEFORE the click.
});

test("practice 2: upload, with rules", async ({ page }) => {
  await page.goto("/play/11-dialogs-files");
  // TODO (independent): upload an in-memory avatar.png (content "fake-png-bytes")
  // and assert "Uploaded avatar.png (14 bytes)". Then upload notes.txt and assert
  // "Only image files are allowed.".
});

test("practice 3: download, then import it back", async ({ page }) => {
  await page.goto("/play/11-dialogs-files");
  // TODO (challenge): "Export CSV": assert the filename report.csv and that the
  // content starts with "id,name,score" and has the rows for Ada and Grace.
  // Then pass the downloaded file to "Import CSV" and assert "Imported 2 rows.".
});
