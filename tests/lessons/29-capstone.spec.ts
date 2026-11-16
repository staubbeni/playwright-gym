// Lesson 29 — Capstone: Gym Shop suite
//
// Write a complete end-to-end suite for the Gym Shop (/shop). There are no
// "practice N" tests here: name your tests freely.
//
// The checker:
//   1. runs the whole file against the normal shop: everything must pass;
//   2. runs it 8 more times, each with one hidden bug planted. Your suite
//      "catches" a bug if at least one test fails. Goal: catch at least 7.
//
// The bugs hide in: catalog search, product details, cart quantities,
// discount codes, checkout validation, order confirmation, login, and
// account settings.
//
// Reuse your page objects (./pages) and fixtures from lessons 20-21, seed data
// with page.request, and remember the checkout asks for confirmation via a
// native dialog.
//
//   npm run check -- 29-capstone
import { expect, test } from "@playwright/test";

test.describe("catalog", () => {
  test("search narrows the list", async ({ page }) => {
    await page.goto("/shop");
    // TODO
  });
});

// TODO: cart, checkout, and account tests.
