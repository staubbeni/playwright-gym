import { expect, test } from "@playwright/test";

// Keep a trace of every run; open it with `npx playwright show-trace`.
test.use({ trace: "on" });

test.beforeEach(async ({ page }) => {
  await page.goto("/play/25-debugging");
});

test("practice 1: the report becomes ready", async ({ page }) => {
  await page.getByRole("button", { name: "Generate report" }).click();
  await expect(page.getByRole("status")).toHaveText("Report ready.");
});

test("practice 2: the report is complete and plausible", async ({ page }) => {
  await page.getByRole("button", { name: "Generate report" }).click();
  const dataRows = page
    .getByRole("table", { name: "Revenue by region" })
    .getByRole("row")
    .filter({ has: page.getByRole("cell") });

  await test.step("every region is listed", async () => {
    await expect(dataRows, "report should list North, South and West").toHaveCount(3);
  });
  await test.step("every revenue figure is real", async () => {
    await expect(dataRows.filter({ hasText: "$0" }), "no region should report $0 revenue").toHaveCount(0);
    await expect(dataRows.getByRole("cell").nth(5), "West revenue should be shown").toHaveText("$15,100");
  });
});

test("practice 3: no console or page errors while generating", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.getByRole("button", { name: "Generate report" }).click();
  await expect(page.getByRole("status")).toHaveText("Report ready.");
  expect(consoleErrors, "the browser console should stay clean").toEqual([]);
  expect(pageErrors, "no uncaught page errors").toEqual([]);
});
