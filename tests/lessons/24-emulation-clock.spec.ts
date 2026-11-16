// Lesson 24 — Emulation & clock
// Freeze the clock for the greeting, format prices for Berlin, and test a
// session timeout on a phone without waiting.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 24-emulation-clock
import { expect, test } from "@playwright/test";

test("practice 1: freeze time", async ({ page }) => {
  // TODO (guided): Pin the clock to 08:00 on 1 March 2026 BEFORE goto and
  // prove the greeting for that time.
  await page.goto("/play/24-emulation-clock");
});

test.describe("practice 2: German locale", () => {
  // TODO (independent): set the environment for the whole group with test.use.

  test("formats prices and times for Berlin", async ({ page }) => {
    await page.goto("/play/24-emulation-clock");
    // TODO: prove German price formatting (1.234,50) and that the event at
    // 12:00 UTC shows Berlin's local time.
  });
});

test.describe("practice 3: phone in Budapest", () => {
  // TODO (challenge): test.use a 390x844 viewport, geolocation 47.4979 /
  // 19.0402 and the permission it needs.

  test("shows the mobile menu and the nearest gym", async ({ page }) => {
    await page.goto("/play/24-emulation-clock");
    // TODO: the mobile menu button exists; the nearest gym is found.
  });

  test("warns about session timeout", async ({ page }) => {
    // TODO: install a fake clock BEFORE goto. Prove the expiry notice is NOT
    // shown just before the limit, IS shown right after, and that "Stay signed
    // in" restarts the countdown. Never wait in real time.
    await page.goto("/play/24-emulation-clock");
  });
});
