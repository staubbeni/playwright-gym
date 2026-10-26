import { expect, test, type Page } from "@playwright/test";

async function fillValidForm(page: Page) {
  await page.getByLabel("Full name").fill("Ada Lovelace");
  await page.getByLabel("Email address").fill("ada@example.com");
  await page.getByLabel("Password").fill("analytical-engine");
  await page.getByLabel("I accept the terms").check();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/play/04-forms");
});

test("practice 1: creates an account with valid input", async ({ page }) => {
  await fillValidForm(page);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("status")).toContainText("Account created");
});

test("practice 2: rejects an invalid email", async ({ page }) => {
  await fillValidForm(page);
  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByRole("button", { name: "Create account" }).click();
  // Next.js renders its own (empty) role=alert route announcer, so filter.
  await expect(page.getByRole("alert").filter({ hasText: "email" })).toHaveText("Enter a valid email address.");
  await expect(page.getByRole("status")).not.toContainText("Account created");
});

test("practice 3: summarizes the chosen plan and role", async ({ page }) => {
  await fillValidForm(page);
  await page.getByLabel("Plan").selectOption("Pro");
  await page.getByRole("radio", { name: "Teacher" }).check();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("status")).toHaveText("Account created for Ada Lovelace on the Pro plan as a Teacher.");
});
