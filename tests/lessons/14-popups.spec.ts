// Lesson 14 — Popups & new tabs
// Open and approve a payment popup, then follow a link that opens in a new
// tab.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 14-popups
import { expect, test } from "@playwright/test";

test("practice 1: catch the popup", async ({ page }) => {
  await page.goto("/play/14-popups");
  // TODO (guided): Click "Open payment window" and assert the popup heading
  // "Payment window".
});

test("practice 2: report back to the opener", async ({ page }) => {
  await page.goto("/play/14-popups");
  // TODO (independent): In the popup click "Approve payment", then assert the
  // original page says "Payment approved.".
});

test("practice 3: new tab link", async ({ page }) => {
  await page.goto("/play/14-popups");
  // TODO (challenge): Click "Read the terms" (target=_blank) and assert the
  // new page URL ends in /popup/terms and its heading is "Terms of service".
});
