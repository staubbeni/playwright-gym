// Lesson 14 — Popups & new tabs
// Catch a popup, finish a flow in it, and juggle two windows.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 14-popups
import { expect, test } from "@playwright/test";

test("practice 1: catch the popup", async ({ page }) => {
  await page.goto("/play/14-popups");
  // TODO (guided): click "Open payment window" and assert the popup heading
  // "Payment window". Hint: page.waitForEvent("popup") BEFORE the click.
});

test("practice 2: approve and close", async ({ page }) => {
  await page.goto("/play/14-popups");
  // TODO (independent): in the popup click "Approve payment". Assert the
  // original page says "Payment approved." and that the popup closed itself.
});

test("practice 3: two windows at once", async ({ page }) => {
  await page.goto("/play/14-popups");
  // TODO (challenge): open the payment popup (don't approve) and, in the same
  // test, click "Read the terms". Assert the terms tab (URL /popup/terms,
  // heading "Terms of service") and that the opener still says "Waiting for
  // approval..." afterwards.
});
