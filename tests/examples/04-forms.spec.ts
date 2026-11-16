import { expect, test, type Page } from "@playwright/test";

async function fillValidForm(page: Page) {
  await page.getByLabel("Full name").fill("Ada Lovelace");
  await page.getByLabel("Email address").fill("ada@example.com");
  await page.getByLabel("Password").fill("analytical-engine");
  await page.getByLabel("I accept the terms").check();
}

const submit = (page: Page) => page.getByRole("button", { name: "Create account" }).click();

test.beforeEach(async ({ page }) => {
  await page.goto("/play/04-forms");
});

test("practice 1: creates an account with valid input", async ({ page }) => {
  await fillValidForm(page);
  await submit(page);
  await expect(page.getByRole("status")).toContainText("Account created");
});

test("practice 2: rejects each invalid field", async ({ page }) => {
  const status = page.getByRole("status");
  // Next.js renders its own (empty) role=alert route announcer, so filter.
  const alert = (text: string) => page.getByRole("alert").filter({ hasText: text });

  await fillValidForm(page);
  await page.getByLabel("Email address").fill("not-an-email");
  await submit(page);
  await expect(alert("email")).toHaveText("Enter a valid email address.");
  await expect(status).not.toContainText("Account created");

  await fillValidForm(page);
  await page.getByLabel("Password").fill("1234567");
  await submit(page);
  await expect(alert("Password")).toHaveText("Password must be at least 8 characters.");
  await expect(status).not.toContainText("Account created");

  await fillValidForm(page);
  await page.getByLabel("I accept the terms").uncheck();
  await submit(page);
  await expect(alert("terms")).toHaveText("You must accept the terms.");
  await expect(status).not.toContainText("Account created");
});

test("practice 3: summarizes the plan and role, then resets", async ({ page }) => {
  await fillValidForm(page);
  await page.getByLabel("Plan").selectOption("Pro");
  await page.getByRole("radio", { name: "Teacher" }).check();
  await submit(page);
  await expect(page.getByRole("status")).toHaveText("Account created for Ada Lovelace on the Pro plan as a Teacher.");

  await page.getByRole("button", { name: "Reset form" }).click();
  await expect(page.getByLabel("Full name")).toHaveValue("");
  await expect(page.getByLabel("Plan")).toHaveValue("Free");
  await expect(page.getByRole("radio", { name: "Student" })).toBeChecked();
  await expect(page.getByRole("status")).toHaveText("Complete the form to continue.");
});
