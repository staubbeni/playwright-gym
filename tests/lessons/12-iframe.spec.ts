// Lesson 12 — iFrames
// Pay with a valid card, reject an invalid one, and confirm that the host
// page learns about the payment.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 12-iframe
import { expect, test } from "@playwright/test";

test("practice 1: pay inside the frame", async ({ page }) => {
  await page.goto("/play/12-iframe");
  // TODO (guided): Fill Card number 4242424242424242 and Expiry 12/30, click
  // Pay now, and assert "Payment confirmed." inside the frame.
});

test("practice 2: validation inside the frame", async ({ page }) => {
  await page.goto("/play/12-iframe");
  // TODO (independent): Submit card number 1234 and assert the frame alert
  // "Card number must be 16 digits.".
});

test("practice 3: frame to host communication", async ({ page }) => {
  await page.goto("/play/12-iframe");
  // TODO (challenge): After a successful payment assert that the host page
  // status (outside the frame) says "Order paid.".
});
