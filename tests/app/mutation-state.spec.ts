import { expect, test } from "@playwright/test";

test("selectors mutation does not report a successful action", async ({
  page
}) => {
  await page.goto("/lessons/01-selectors?bug=true");
  await page.getByRole("button", { name: "Complete action" }).click();
  await expect(page.getByRole("status")).toHaveText("Waiting for an action...");
});

test("forms mutation does not report a successful submission", async ({
  page
}) => {
  await page.goto("/lessons/02-forms?bug=true");
  await page.getByLabel("Email address").fill("student@example.com");
  await page.getByLabel("I accept the terms").check();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Complete the form to continue."
  );
});

test("loading mutation never reaches the report state", async ({ page }) => {
  await page.goto("/lessons/03-auto-waiting?bug=true");
  await page.getByRole("button", { name: "Load report" }).click();
  await expect(page.getByTestId("report-result")).toHaveText("Loading report...");
});

test("toast mutation does not show confirmation", async ({ page }) => {
  await page.goto("/lessons/04-toast?bug=true");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await expect(page.getByTestId("preferences-toast")).toHaveCount(0);
});

test("network mutation ignores a successful profile response", async ({ page }) => {
  await page.goto("/lessons/05-network-mocking?bug=true");
  await page.getByRole("button", { name: "Load profile" }).click();
  await expect(page.getByText("No profile loaded.")).toBeVisible();
});

test("shadow DOM mutation does not save the new name", async ({ page }) => {
  await page.goto("/lessons/06-shadow-dom?bug=true");
  await page.getByLabel("Display name").fill("Grace");
  await page.getByRole("button", { name: "Save name" }).click();
  await expect(page.getByTestId("saved-name")).toHaveText("No name saved.");
});

test("iframe mutation does not confirm payment", async ({ page }) => {
  await page.goto("/lessons/07-iframe?bug=true");
  const frame = page.frameLocator("#payment-frame");
  await frame.getByLabel("Card number").fill("4242424242424242");
  await frame.getByRole("button", { name: "Pay now" }).click();
  await expect(frame.getByRole("status")).toHaveText("Ready for payment.");
});

test("auth mutation does not open the dashboard", async ({ page }) => {
  await page.goto("/lessons/08-auth-storage?bug=true");
  await page.getByLabel("Username").fill("student");
  await page.getByLabel("Password").fill("playwright");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByTestId("dashboard")).toHaveCount(0);
});

test("advanced mutations suppress their expected outcomes", async ({ page }) => {
  await page.goto("/lessons/13-debugging?bug=true");
  await page.getByRole("button", { name: "Run report" }).click();
  await expect(page.getByRole("status")).toHaveText("Report not ready.");

  await page.goto("/lessons/14-contexts?bug=true");
  await page.getByRole("button", { name: "Save session value" }).click();
  await expect(page.getByTestId("context-result")).toHaveText("No session value.");

  await page.goto("/lessons/15-popups?bug=true");
  const popupPromise = page.waitForEvent("popup", { timeout: 500 });
  await page.getByRole("button", { name: "Open payment window" }).click();
  await expect(popupPromise).rejects.toThrow();

  await page.goto("/lessons/16-api-testing?bug=true");
  await page.getByRole("button", { name: "Check API health" }).click();
  await expect(page.getByTestId("api-result")).toHaveText("No API request yet.");
});
