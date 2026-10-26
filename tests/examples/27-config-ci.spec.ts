import { expect, test } from "@playwright/test";

test.describe("practice 1: desktop viewport", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("reports the configured viewport", async ({ page }) => {
    await page.goto("/play/27-config-ci");
    await expect(page.getByTestId("viewport")).toHaveText("Viewport: 1280 × 720");
  });
});

test("practice 2: waits until the service is healthy", async ({ page }) => {
  await page.goto("/play/27-config-ci");
  const status = page.getByTestId("service-status");
  await expect(async () => {
    await page.getByRole("button", { name: "Refresh status" }).click();
    await expect(status).toHaveText("Healthy", { timeout: 1_000 });
  }).toPass({ timeout: 10_000 });
});

test.describe("practice 3: parallel-safe members", () => {
  test.describe.configure({ mode: "parallel" });

  for (const role of ["coach", "athlete"]) {
    test(`adds a unique ${role}`, async ({ page }) => {
      const name = `${role}-${test.info().testId}-${Date.now()}`;
      await page.goto("/play/27-config-ci");
      await page.getByLabel("Member name").fill(name);
      await page.getByRole("button", { name: "Add member" }).click();
      const members = page.getByRole("list", { name: "Members" });
      await expect(members.getByText(name, { exact: true })).toHaveCount(1);
    });
  }
});
