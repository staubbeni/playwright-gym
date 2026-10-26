import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/28-flaky-clinic");
});

test("practice 1: shows the latest score", async ({ page }) => {
  await page.getByRole("button", { name: "Fetch score" }).click();
  await expect(page.getByTestId("score")).toHaveText("Score: 42");
});

test("practice 2: lists every recent activity", async ({ page }) => {
  const feed = page.getByRole("list", { name: "Recent activity" });
  await expect(feed.getByRole("listitem")).toHaveCount(3);
  for (const activity of ["Login", "Purchase", "Logout"]) {
    await expect(feed.getByText(activity, { exact: true })).toBeVisible();
  }
});

test("practice 3: confirms the sync", async ({ page }) => {
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.getByRole("region", { name: "Notifications" }).getByRole("status")).toHaveText("Synced.");
});
