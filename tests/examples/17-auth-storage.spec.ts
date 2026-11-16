import { expect, test } from "@playwright/test";

test("practice 1: logs in through the form", async ({ page }) => {
  await page.goto("/shop/login");
  await page.getByLabel("Username").fill("student");
  await page.getByLabel("Password").fill("playwright");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/shop\/account$/);
  await expect(page.getByRole("heading", { name: "My account" })).toBeVisible();
  await expect(page.getByText("Signed in as student")).toBeVisible();
});

test("practice 2: signing out ends the session", async ({ page }) => {
  await page.request.post("/api/shop/login", { data: { username: "student", password: "playwright" } });
  await page.goto("/shop/account");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/shop\/login/);

  await page.goto("/shop/account");
  await expect(page).toHaveURL(/\/shop\/login/);
});

// test.use() is read when tests are collected, so the path is a constant.
const statePath = "test-results/17-auth/state.json";

test.describe("practice 3: logged in from a saved state", () => {
  test.use({ storageState: statePath });

  test.beforeAll(async ({ browser }) => {
    // The new context would inherit this group's storageState (a file that doesn't exist yet), so start it empty.
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    await context.request.post("/api/shop/login", { data: { username: "student", password: "playwright" } });
    await context.storageState({ path: statePath });
    await context.close();
  });

  test("practice 3: the saved session opens the account", async ({ page }) => {
    await page.goto("/shop/account");
    await expect(page.getByText("Signed in as student")).toBeVisible();
  });
});

test.describe("practice 3: logged out", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("practice 3: a visitor without a session is sent to the login page", async ({ page }) => {
    await page.goto("/shop/account");
    await expect(page).toHaveURL(/\/shop\/login/);
    await expect(page.getByText("Signed in as")).toHaveCount(0);
  });
});
