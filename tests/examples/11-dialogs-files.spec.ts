import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/11-dialogs-files");
});

test("practice 1: accepts the delete confirmation", async ({ page }) => {
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("cannot be undone");
    await dialog.accept();
  });
  await page.getByRole("button", { name: "Delete account" }).click();
  await expect(page.getByTestId("account-status")).toHaveText("Account deleted.");
});

test("practice 2: uploads an avatar and refuses other files", async ({ page }) => {
  const upload = page.getByLabel("Upload avatar");
  await upload.setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: Buffer.from("fake-png-bytes") });
  await expect(page.getByTestId("upload-status")).toHaveText("Uploaded avatar.png (14 bytes)");

  await upload.setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hello") });
  await expect(page.getByTestId("upload-status")).toHaveText("Only image files are allowed.");
});

test("practice 3: exports a CSV and imports it back", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("report.csv");

  const path = await download.path();
  const content = await readFile(path, "utf8");
  expect(content.startsWith("id,name,score")).toBe(true);
  expect(content).toContain("Ada");
  expect(content).toContain("Grace");

  await page.getByLabel("Import CSV").setInputFiles(path);
  await expect(page.getByTestId("import-status")).toHaveText("Imported 2 rows.");
});
