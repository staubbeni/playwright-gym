import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/14-popups");
});

test("practice 1: opens the payment popup", async ({ page }) => {
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Open payment window" }).click();
  const popup = await popupPromise;
  await expect(popup.getByRole("heading", { name: "Payment window" })).toBeVisible();
});

test("practice 2: approval is reported and the popup closes", async ({ page }) => {
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Open payment window" }).click();
  const popup = await popupPromise;

  const closed = popup.waitForEvent("close");
  await popup.getByRole("button", { name: "Approve payment" }).click();
  await closed;
  await expect(page.getByRole("status")).toHaveText("Payment approved.");
});

test("practice 3: handles two windows at once", async ({ page }) => {
  const paymentPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Open payment window" }).click();
  const payment = await paymentPromise;
  await expect(payment.getByRole("heading", { name: "Payment window" })).toBeVisible();

  const termsPromise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "Read the terms" }).click();
  const terms = await termsPromise;
  await expect(terms).toHaveURL(/\/popup\/terms$/);
  await expect(terms.getByRole("heading", { name: "Terms of service" })).toBeVisible();

  await expect(page.getByRole("status")).toHaveText("Waiting for approval...");
});
