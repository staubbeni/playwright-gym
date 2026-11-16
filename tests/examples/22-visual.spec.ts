import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/22-visual");
});

test("practice 1: the pricing card looks right", async ({ page }) => {
  await expect(page.getByTestId("pricing-card")).toHaveScreenshot("pricing-card.png");
});

test("practice 2: the dashboard header with live data masked", async ({ page }) => {
  await expect(page.getByTestId("dashboard-header")).toHaveScreenshot("dashboard-header.png", {
    mask: [page.getByTestId("live-stats")]
  });
});

test("practice 3: the whole page is stable", async ({ page }) => {
  await expect(page.getByTestId("pricing-card")).toBeVisible();
  // The spinner never stops (freeze it) and the live numbers differ every
  // second (mask them). No tolerance needed: a threshold would also hide a
  // changed plan name.
  await expect(page).toHaveScreenshot("pricing-page.png", {
    fullPage: true,
    animations: "disabled",
    mask: [page.getByTestId("live-stats")]
  });
});
