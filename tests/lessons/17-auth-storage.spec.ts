// Lesson 17 — Authentication & storage state
// Log in through the form, prove that sign-out ends the session, and reuse a
// saved session in a fresh context.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 17-auth-storage
import { expect, test } from "@playwright/test";

test("practice 1: log in through the ui", async ({ page }) => {
  await page.goto("/shop/login");
  // TODO (guided): sign in as student / playwright. Assert the URL ends with
  // /shop/account, the heading "My account", and "Signed in as student".
});

test("practice 2: sign out ends the session", async ({ page }) => {
  // TODO (independent): log in (UI or page.request), click "Sign out", then
  // open /shop/account again and assert you end up on /shop/login.
});

test("practice 3: reuse storage state", async ({ page, browser }) => {
  // TODO (challenge):
  // 1. Log in with page.request.post("/api/shop/login", { data: { ... } }).
  // 2. Save page.context().storageState({ path: test.info().outputPath("state.json") }).
  // 3. browser.newContext({ storageState: ... }), open /shop/account there,
  //    and assert "Signed in as student". Close the new context at the end.
});
