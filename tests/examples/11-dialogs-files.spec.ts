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

test("practice 2: uploads an avatar from memory", async ({ page }) => {
  await page.getByLabel("Upload avatar").setInputFiles({
    name: "avatar.png",
    mimeType: "image/png",
    buffer: Buffer.from("fake-png-bytes")
  });
  await expect(page.getByTestId("upload-status")).toHaveText(/^Uploaded avatar\.png/);
});

test("practice 3: exports a CSV report", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("report.csv");
  const content = await readFile(await download.path(), "utf8");
  expect(content.startsWith("id,name,score")).toBe(true);
});
