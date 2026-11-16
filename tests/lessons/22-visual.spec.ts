// Lesson 22 — Visual comparisons
// Guard the pricing card, a dashboard header with live data, and fix a flaky
// full-page screenshot.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 22-visual
import { expect, test } from "@playwright/test";

test("practice 1: element screenshot", async ({ page }) => {
  await page.goto("/play/22-visual");
  // TODO (guided): Guard the pricing card with an element screenshot named
  // "pricing-card.png". The first run writes the baseline and fails: run again.
});

test("practice 2: mask live data", async ({ page }) => {
  await page.goto("/play/22-visual");
  // TODO (independent): Guard the dashboard header with a screenshot. It has
  // live numbers that change every second; the test must pass on every run.
});

test("practice 3: stable full page", async ({ page }) => {
  await page.goto("/play/22-visual");
  // TODO (challenge): This test is flaky. Run it a few times, find out why
  // (two things move on this page) and stabilize it. If you add a tolerance,
  // explain it in a comment.
  await expect(page).toHaveScreenshot("pricing-page.png", { fullPage: true });
});
