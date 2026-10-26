import { expect, test } from "@playwright/test";

test("practice 1: greets in the morning", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-03-01T08:00:00"));
  await page.goto("/play/24-emulation-clock");
  await expect(page.getByTestId("greeting")).toHaveText("Good morning");
});

test.describe("practice 2: German locale", () => {
  test.use({ locale: "de-DE", timezoneId: "Europe/Berlin" });

  test("formats prices and times for Berlin", async ({ page }) => {
    await page.goto("/play/24-emulation-clock");
    await expect(page.getByTestId("price")).toHaveText(/1\.234,50/);
    await expect(page.getByTestId("event-time")).toHaveText("14:00");
  });
});

test.describe("practice 3: phone in Budapest", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    geolocation: { latitude: 47.4979, longitude: 19.0402 },
    permissions: ["geolocation"]
  });

  test("shows the mobile menu and the nearest gym", async ({ page }) => {
    await page.goto("/play/24-emulation-clock");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
    await page.getByRole("button", { name: "Find nearest gym" }).click();
    await expect(page.getByTestId("nearest-gym")).toHaveText("Nearest gym: Budapest Central");
  });
});
