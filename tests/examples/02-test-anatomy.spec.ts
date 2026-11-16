import { expect, test } from "@playwright/test";

test("practice 1: finds all three test stages", async ({ page }) => {
  await page.goto("/play/02-test-anatomy");

  await expect(page.getByTestId("arrange-step")).toBeVisible();
  await expect(page.getByTestId("act-step")).toBeVisible();
  await expect(page.getByTestId("assert-step")).toBeVisible();
});

test("practice 2: the explanations match the page", async ({ page }) => {
  await page.goto("/play/02-test-anatomy");

  await expect(page.getByTestId("arrange-step")).toContainText("prepare the test fixture");
  await expect(page.getByTestId("act-step")).toContainText("Perform one focused user action.");
});

test("practice 3: documents the test phases with steps", async ({ page }) => {
  await test.step("Arrange", async () => {
    await page.goto("/play/02-test-anatomy");
  });

  await test.step("Act", async () => {
    await page.getByRole("button", { name: "Run demo test" }).click();
  });

  await test.step("Assert", async () => {
    await expect(page.getByTestId("demo-result")).toHaveText("Demo test passed.");
    await expect(page.getByTestId("stage-count")).toHaveText("Stages completed: 3 of 3");
  });
});
