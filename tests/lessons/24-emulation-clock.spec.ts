// Lesson 24 — Emulation & clock
// Freeze the clock for the greeting, format prices in German, and use a phone
// viewport with geolocation.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 24-emulation-clock
import { expect, test } from "@playwright/test";

test("practice 1: freeze time", async ({ page }) => {
  // TODO (guided): page.clock.setFixedTime(new Date("2026-03-01T08:00:00"))
  // BEFORE goto, then assert the greeting "Good morning".
  await page.goto("/play/24-emulation-clock");
});

test.describe("practice 2: German locale", () => {
  // TODO (independent): test.use({ locale: "de-DE", timezoneId: "Europe/Berlin" });

  test("formats prices and times for Berlin", async ({ page }) => {
    await page.goto("/play/24-emulation-clock");
    // TODO: assert the price matches /1\.234,50/ and the event time is "14:00".
  });
});

test.describe("practice 3: phone in Budapest", () => {
  // TODO (challenge): test.use({ viewport: { width: 390, height: 844 },
  //   geolocation: { latitude: 47.4979, longitude: 19.0402 }, permissions: ["geolocation"] });

  test("shows the mobile menu and the nearest gym", async ({ page }) => {
    await page.goto("/play/24-emulation-clock");
    // TODO: assert "Open menu" is visible, click "Find nearest gym", and assert
    // "Nearest gym: Budapest Central".
  });
});
