// Lesson 26 — Contexts & isolation
// Save a note, prove another context can't see it, and prove two users share
// the roster but not their sign-in.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 26-contexts
import { expect, test } from "@playwright/test";

test("practice 1: save in this context", async ({ page }) => {
  await page.goto("/play/26-contexts");
  // TODO (guided): save a note and prove it is still shown after a reload.
});

test("practice 2: not visible elsewhere", async ({ page, browser }) => {
  await page.goto("/play/26-contexts");
  // TODO (independent): save a note here, then prove a brand-new
  // browser.newContext() does not see it. Close the context.
});

test("practice 3: two users, one roster", async ({ page, browser }) => {
  // TODO (challenge): user A (this page) signs in and adds a teammate with a
  // unique name. User B (a second context) must not look signed in as A, but
  // must see the teammate after a reload. Close the contexts you create.
});
