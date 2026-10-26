import { expect, test } from "@playwright/test";
test("submits the local iframe form", async ({ page }) => {
  await page.goto("/lessons/07-iframe");
  const frame = page.frameLocator("#payment-frame");
  await frame.getByLabel("Card number").fill("4242424242424242");
  await frame.getByRole("button", { name: "Pay now" }).click();
  await expect(frame.getByRole("status")).toHaveText("Payment confirmed.");
});
test("logs into the protected dashboard", async ({ page }) => {
  await page.goto("/lessons/08-auth-storage");
  await page.getByLabel("Username").fill("student");
  await page.getByLabel("Password").fill("playwright");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByTestId("dashboard").getByRole("heading", { name: "Dashboard" })
  ).toBeVisible();
});
