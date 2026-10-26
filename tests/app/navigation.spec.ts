import { expect, test } from "@playwright/test";

test("switches lessons client-side through stable URLs", async ({ page }) => {
  await page.goto("/lessons/01-selectors");
  await page.getByRole("link", { name: /Form fill & assertions/ }).click();
  await expect(page).toHaveURL(/\/lessons\/02-forms$/);
  await expect(page.getByRole("heading", { name: "Form fill & assertions" })).toBeVisible();
});

test("opens and closes the lesson guide from the right edge", async ({ page }) => {
  await page.goto("/lessons/01-selectors");
  const drawer = page.locator("#lesson-instructions");

  await expect(drawer).toHaveClass(/open/);
  await page.getByRole("button", { name: "Hide instructions" }).click();
  await expect(drawer).not.toHaveClass(/open/);
  await page.getByRole("button", { name: "Show instructions" }).click();
  await expect(drawer).toHaveClass(/open/);
});

test("shows concepts, official docs, and the next curriculum step", async ({ page }) => {
  await page.goto("/lessons/01-selectors");

  await expect(page.getByText("Role locators")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Locators", exact: true })
  ).toHaveAttribute("href", "https://playwright.dev/docs/locators");
  await expect(
    page.getByRole("link", { name: "Continue to lesson 02 →" })
  ).toHaveAttribute("href", "/lessons/02-forms");
});
