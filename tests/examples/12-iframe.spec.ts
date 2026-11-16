import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/12-iframe");
});

test("practice 1: pays inside the frame", async ({ page }) => {
  const frame = page.getByTitle("Payment form").contentFrame();
  await frame.getByLabel("Card number").fill("4242424242424242");
  await frame.getByLabel("Expiry").fill("12/30");
  await frame.getByRole("button", { name: "Pay now" }).click();
  await expect(frame.getByRole("status")).toHaveText("Payment confirmed.");
});

test("practice 2: rejects a short card and a malformed expiry", async ({ page }) => {
  const frame = page.frameLocator("iframe[title='Payment form']");
  const pay = frame.getByRole("button", { name: "Pay now" });

  await frame.getByLabel("Card number").fill("1234");
  await pay.click();
  await expect(frame.getByRole("alert")).toHaveText("Card number must be 16 digits.");

  await frame.getByLabel("Card number").fill("4242424242424242");
  await frame.getByLabel("Expiry").fill("13/99");
  await pay.click();
  await expect(frame.getByRole("alert")).toHaveText("Expiry must be MM/YY.");
});

test("practice 3: the host learns about the payment and can start over", async ({ page }) => {
  const frame = page.getByTitle("Payment form").contentFrame();
  await frame.getByLabel("Card number").fill("4242424242424242");
  await frame.getByLabel("Expiry").fill("12/30");
  await frame.getByRole("button", { name: "Pay now" }).click();
  await expect(frame.getByRole("status")).toHaveText("Payment confirmed.");
  await expect(page.getByTestId("order-status")).toHaveText("Order paid.");

  await page.getByRole("button", { name: "Start over" }).click();
  await expect(frame.getByRole("status")).toHaveText("Ready for payment.");
  await expect(page.getByTestId("order-status")).toHaveText("Awaiting payment.");
});
