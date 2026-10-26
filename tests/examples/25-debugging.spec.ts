import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/25-debugging");
});

test("practice 1: the report becomes ready", async ({ page }) => {
  await page.getByRole("button", { name: "Generate report" }).click();
  await expect(page.getByRole("status")).toHaveText("Report ready.");
});

test("practice 2: the report lists every region", async ({ page }) => {
  await page.getByRole("button", { name: "Generate report" }).click();
  const dataRows = page
    .getByRole("table", { name: "Revenue by region" })
    .getByRole("row")
    .filter({ has: page.getByRole("cell") });
  await expect(dataRows, "report should list North, South and West").toHaveCount(3);
});

test("practice 3: no console errors while generating", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.getByRole("button", { name: "Generate report" }).click();
  await expect(page.getByRole("status")).toHaveText("Report ready.");
  expect(errors, "the browser console should stay clean").toEqual([]);
});
