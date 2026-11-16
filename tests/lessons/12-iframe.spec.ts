// Lesson 12 — Iframes
// Work inside an embedded payment frame and check what the host page learns.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 12-iframe
import { expect, test } from "@playwright/test";

test("practice 1: pay inside the frame", async ({ page }) => {
  await page.goto("/play/12-iframe");
  // TODO (guided): fill Card number 4242424242424242 and Expiry 12/30, click "Pay
  // now", and assert "Payment confirmed." inside the frame.
  // Hint: page.getByTitle("Payment form").contentFrame() or page.frameLocator(...)
});

test("practice 2: validation inside the frame", async ({ page }) => {
  await page.goto("/play/12-iframe");
  // TODO (independent): card number 1234 is rejected with "Card number must be 16
  // digits."; a valid card with expiry 13/99 is rejected with "Expiry must be
  // MM/YY.".
});

test("practice 3: frame and host talk", async ({ page }) => {
  await page.goto("/play/12-iframe");
  // TODO (challenge): pay successfully; assert the frame ("Payment confirmed.")
  // and the host ("Order paid."). Click "Start over" and assert the frame says
  // "Ready for payment." and the host "Awaiting payment.".
});
