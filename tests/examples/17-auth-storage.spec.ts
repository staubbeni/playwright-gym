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

test("practice 3: reuses a saved storage state", async ({ page, browser }) => {
  await page.request.post("/api/shop/login", { data: { username: "student", password: "playwright" } });
  const statePath = test.info().outputPath("state.json");
  await page.context().storageState({ path: statePath });

  const context = await browser.newContext({ storageState: statePath });
  const restored = await context.newPage();
  await restored.goto("/shop/account");
  await expect(restored.getByText("Signed in as student")).toBeVisible();
  await context.close();
});
