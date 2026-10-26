// Lesson 11 — Dialogs, uploads & downloads
// Delete an account through a confirm dialog, upload an avatar, and verify
// an exported CSV.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 11-dialogs-files
import { expect, test } from "@playwright/test";

test("practice 1: confirm dialog", async ({ page }) => {
  await page.goto("/play/11-dialogs-files");
  // TODO (guided): Accept the dialog opened by "Delete account" (assert its
  // message contains "cannot be undone") and assert "Account deleted.".
});

test("practice 2: upload a file", async ({ page }) => {
  await page.goto("/play/11-dialogs-files");
  // TODO (independent): Upload an in-memory avatar.png through "Upload avatar"
  // and assert the text starts with "Uploaded avatar.png".
});

test("practice 3: inspect a download", async ({ page }) => {
  await page.goto("/play/11-dialogs-files");
  // TODO (challenge): Download via "Export CSV". Assert the filename is
  // report.csv and the content starts with "id,name,score".
});
