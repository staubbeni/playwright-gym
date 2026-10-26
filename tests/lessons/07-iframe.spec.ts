import { test } from "@playwright/test";
test("submits the embedded payment form", async ({ page }) => {
  await page.goto("/lessons/07-iframe");
  const frame = page.frameLocator("#payment-frame");
  // TODO: fill the card and submit inside the iframe.
  // TODO: assert the frame-level confirmation.
});
