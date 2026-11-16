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

  test("warns about session timeout", async ({ page }) => {
    await page.clock.install();
    await page.goto("/play/24-emulation-clock");
    const expired = page.getByRole("alert").filter({ hasText: "Session expired" });
    // The countdown starts once the page has hydrated: wait for a sign of it.
    await expect(page.getByTestId("greeting")).not.toBeEmpty();

    await page.clock.fastForward("14:00");
    await expect(expired).toBeHidden();
    await page.clock.fastForward("01:00");
    await expect(expired).toHaveText(/Session expired/);

    // Staying signed in restarts the full countdown.
    await page.getByRole("button", { name: "Stay signed in" }).click();
    await expect(expired).toBeHidden();
    await page.clock.fastForward("14:00");
    await expect(expired).toBeHidden();
    await page.clock.fastForward("01:00");
    await expect(expired).toBeVisible();
  });
});
