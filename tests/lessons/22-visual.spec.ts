// Lesson 22 — Visual comparisons
// Guard the pricing card, a dashboard header with live data, and the whole
// page against visual changes.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 22-visual
import { expect, test } from "@playwright/test";

test("practice 1: element screenshot", async ({ page }) => {
  await page.goto("/play/22-visual");
  // TODO (guided): Assert toHaveScreenshot("pricing-card.png") on the
  // pricing-card test id.
});

test("practice 2: mask live data", async ({ page }) => {
  await page.goto("/play/22-visual");
  // TODO (independent): Screenshot the dashboard-header test id while masking
  // the live-stats element.
});

test("practice 3: stable full page", async ({ page }) => {
  await page.goto("/play/22-visual");
  // TODO (challenge): Take a fullPage screenshot with animations disabled and
  // live-stats masked.
});
