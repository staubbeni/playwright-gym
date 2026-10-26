import { expect, test } from "@playwright/test";

test("runs the debugging report", async ({ page }) => {
  await page.goto("/lessons/13-debugging");
  await page.getByRole("button", { name: "Run report" }).click();
  await expect(page.getByRole("status")).toHaveText("Report ready.");
});

test("keeps context state local to the lesson", async ({ page }) => {
  await page.goto("/lessons/14-contexts");
  await page.getByRole("button", { name: "Save session value" }).click();
  await expect(page.getByTestId("context-result")).toHaveText("Session value saved.");
});

test("opens a popup page", async ({ page }) => {
  await page.goto("/lessons/15-popups");
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Open payment window" }).click();
  const popup = await popupPromise;
  await expect(popup.getByRole("heading", { name: "Popup confirmation" })).toBeVisible();
  await popup.close();
});

test("reports the API result in the UI", async ({ page }) => {
  await page.goto("/lessons/16-api-testing");
  await page.getByRole("button", { name: "Check API health" }).click();
  await expect(page.getByTestId("api-result")).toHaveText("API request succeeded.");
});
