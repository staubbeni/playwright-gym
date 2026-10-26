// Lesson 26 — Contexts & isolation
// Save a note, prove another context can't see it, and prove a login doesn't
// leak to a guest.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 26-contexts
import { expect, test } from "@playwright/test";

test("practice 1: save in this context", async ({ page }) => {
  await page.goto("/play/26-contexts");
  // TODO (guided): save the note "hello", reload, and assert "Saved note: hello".
});

test("practice 2: not visible elsewhere", async ({ page, browser }) => {
  await page.goto("/play/26-contexts");
  // TODO (independent): save "hello" here, then create browser.newContext(),
  // open the page there, and assert "No saved note.". Close the context.
});

test("practice 3: two users", async ({ page, browser }) => {
  // TODO (challenge): log in this context via page.request. In a fresh guest
  // context open /shop/account and assert it lands on /shop/login, while this
  // page sees "Signed in as student".
});
