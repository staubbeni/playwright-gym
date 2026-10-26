import { expect, test } from "@playwright/test";

test("?bug=true enables every flag of the lesson and persists across reloads", async ({ page }) => {
  await page.goto("/play/03-selectors?bug=true");
  await page.getByRole("button", { name: "Complete action" }).click();
  await expect(page.getByRole("status")).toHaveText("Waiting for an action...");

  await page.goto("/play/03-selectors");
  await page.getByRole("button", { name: "Complete action" }).click();
  await expect(page.getByRole("status")).toHaveText("Waiting for an action...");

  await page.goto("/play/03-selectors?bug=false");
  await page.getByRole("button", { name: "Complete action" }).click();
  await expect(page.getByRole("status")).toHaveText("Action completed successfully.");
});

test("a single flag only breaks its own practice", async ({ page }) => {
  await page.goto("/play/03-selectors?bug=03-selectors:2");
  await page.getByRole("button", { name: "Complete action" }).click();
  await expect(page.getByRole("status")).toHaveText("Action completed successfully.");
  await page.getByRole("button", { name: "Open settings" }).click();
  await expect(page.getByRole("region", { name: "Settings panel" })).toBeHidden();
});

test("the lesson toggle switches bug mode on and off", async ({ page }) => {
  await page.goto("/lessons/03-selectors");
  await page.getByRole("link", { name: "Open bug mode" }).click();
  await expect(page.getByText("Bug mode", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Open normal app" }).click();
  await expect(page.getByText("Normal mode", { exact: true })).toBeVisible();
});

test.describe("the x-gym-bug header", () => {
  test.use({ extraHTTPHeaders: { "x-gym-bug": "16-api-testing:3" } });

  test("reaches API routes", async ({ request }) => {
    const response = await request.post("/api/shop/login", { data: { username: "student", password: "nope" } });
    expect(response.status()).toBe(200);
  });
});
