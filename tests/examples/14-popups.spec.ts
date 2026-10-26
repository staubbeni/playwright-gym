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

test("practice 2: approval is reported to the opener", async ({ page }) => {
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Open payment window" }).click();
  const popup = await popupPromise;
  await popup.getByRole("button", { name: "Approve payment" }).click();
  await expect(page.getByRole("status")).toHaveText("Payment approved.");
});

test("practice 3: opens the terms in a new tab", async ({ page }) => {
  const pagePromise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "Read the terms" }).click();
  const terms = await pagePromise;
  await expect(terms).toHaveURL(/\/popup\/terms$/);
  await expect(terms.getByRole("heading", { name: "Terms of service" })).toBeVisible();
});
