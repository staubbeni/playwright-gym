// Lesson 17 — Authentication & storage state
// Log in through the form, prove that sign-out ends the session, and share one
// saved login across a logged-in and a logged-out group.
//
// Copy this file to tests/solutions/ before editing, then run:
//   npm run check -- 17-auth-storage
import { expect, test } from "@playwright/test";

test("practice 1: log in through the ui", async ({ page }) => {
  await page.goto("/shop/login");
  // TODO (guided): sign in with the demo account shown on the page and prove you
  // end up signed in on your account page.
});

test("practice 2: sign out ends the session", async ({ page }) => {
  // TODO (independent): sign in (UI or page.request), sign out, and prove the
  // session is really over: the account page must no longer be reachable.
});

// TODO (challenge): replace this skeleton.
// 1. A describe group "practice 3: logged in": test.beforeAll logs in with
//    context.request (beforeAll has no `request` fixture: make a context from
//    `browser`), saves context.storageState({ path }), and test.use({ storageState: path })
//    starts the group's test logged in. test.use is read at collection time, so
//    use a constant path like "test-results/auth/state.json". The context made in
//    beforeAll inherits that storageState too (not written yet), so create it with
//    browser.newContext({ storageState: { cookies: [], origins: [] } }).
// 2. A describe group "practice 3: logged out": test.use({ storageState: { cookies: [], origins: [] } })
//    and a test that proves /shop/account sends the visitor to the login page.
test.describe("practice 3: logged in", () => {
  test("practice 3: the saved session opens the account", async ({ page }) => {
    await page.goto("/shop/account");
  });
});
