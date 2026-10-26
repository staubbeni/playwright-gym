// Lesson 28 — Flaky test clinic
// These three tests are FLAKY on purpose. Run them a few times:
//   npx playwright test tests/solutions/28-flaky-clinic.spec.ts --repeat-each=10
// Find the cause of each flake and fix it properly (no retries, no longer sleeps).
// The checker runs your fixed spec 5 times in a row.
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/28-flaky-clinic");
});

test("practice 1: shows the latest score", async ({ page }) => {
  await page.getByRole("button", { name: "Fetch score" }).click();
  await page.waitForTimeout(300);
  expect(await page.getByTestId("score").textContent()).toBe("Score: 42");
});

test("practice 2: lists every recent activity", async ({ page }) => {
  const items = page.getByRole("list", { name: "Recent activity" }).getByRole("listitem");
  await expect(items.nth(0)).toHaveText("Login");
  await expect(items.nth(1)).toHaveText("Purchase");
  await expect(items.nth(2)).toHaveText("Logout");
});

test("practice 3: confirms the sync", async ({ page }) => {
  await page.getByRole("button", { name: "Sync now" }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole("status")).toHaveText("Synced.");
});
