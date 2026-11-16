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

test("practice 4: the total settles and the page says so", async ({ page }) => {
  await page.getByRole("button", { name: "Count up" }).click();
  await expect(page.getByTestId("total")).toHaveText("Total: 120");
  await expect(page.getByTestId("count-status")).toHaveText("Counting finished.");
});

test("practice 5: only the final search results stay", async ({ page }) => {
  const field = page.getByLabel("Find exercise");
  const results = page.getByRole("list", { name: "Results" }).getByRole("listitem");
  await field.pressSequentially("squat");
  await expect(results).toHaveText(["Squat"]);

  await field.clear();
  await field.pressSequentially("zzz");
  await expect(page.getByText("No exercises found.")).toBeVisible();
  await expect(results).toHaveCount(0);
});
