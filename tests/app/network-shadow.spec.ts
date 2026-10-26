import { expect, test } from "@playwright/test";

test("renders a profile returned by a mocked API", async ({ page }) => {
  await page.route("**/api/profile", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ name: "Test User" })
    });
  });
  await page.goto("/lessons/05-network-mocking");
  await page.getByRole("button", { name: "Load profile" }).click();
  await expect(page.getByTestId("profile-name")).toHaveText("Test User");
});

test("updates a name inside the shadow component", async ({ page }) => {
  await page.goto("/lessons/06-shadow-dom");
  await page.getByLabel("Display name").fill("Grace");
  await page.getByRole("button", { name: "Save name" }).click();
  await expect(page.getByTestId("saved-name")).toHaveText("Grace");
});
