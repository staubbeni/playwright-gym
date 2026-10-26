import { expect, test } from "@playwright/test";

test("waits for the report without a fixed timeout", async ({ page }) => {
  await page.goto("/lessons/03-auto-waiting");
  await page.getByRole("button", { name: "Load report" }).click();
  await expect(page.getByTestId("report-result")).toHaveText("Report ready");
});

test("finds the transient preferences toast", async ({ page }) => {
  await page.goto("/lessons/04-toast");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await expect(page.getByTestId("preferences-toast")).toHaveText(
    "Preferences saved."
  );
});
