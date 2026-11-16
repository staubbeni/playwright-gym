import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/01-setup");
});

test("practice 1: the page has the setup title", async ({ page }) => {
  await expect(page).toHaveTitle(/Setup/);
});

test("practice 2: starting the training shows a message", async ({ page }) => {
  await page.getByRole("button", { name: "Start training" }).click();
  await expect(page.getByText("Training started. Good luck!")).toBeVisible();
});

test("practice 3: the setup checklist lists four steps in order", async ({ page }) => {
  const checklist = page.getByRole("list", { name: "Setup checklist" });
  await expect(checklist.getByRole("listitem")).toHaveText([
    "Install Node.js",
    "Install Playwright",
    "Run the example test",
    "Open the HTML report"
  ]);
});
