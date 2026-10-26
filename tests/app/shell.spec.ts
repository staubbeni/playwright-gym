import { expect, test } from "@playwright/test";
import { lessons } from "../../lib/lessons/index.ts";

test("the home page lists every module and lesson", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Playwright Gym" })).toBeVisible();
  for (const lesson of lessons) {
    await expect(page.getByRole("link", { name: new RegExp(lesson.title.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&")) }).first()).toBeVisible();
  }
});

test("switches lessons client-side through stable URLs", async ({ page }) => {
  await page.goto("/lessons/03-selectors");
  await page.getByRole("navigation", { name: "Lessons" }).getByRole("link", { name: /Forms & validation/ }).click();
  await expect(page).toHaveURL(/\/lessons\/04-forms$/);
  await expect(page.getByRole("heading", { level: 1, name: "Forms & validation" })).toBeVisible();
});

test("opens and closes the lesson guide", async ({ page }) => {
  await page.goto("/lessons/03-selectors");
  const drawer = page.locator("#lesson-instructions");
  await expect(drawer).toHaveClass(/open/);
  await page.getByRole("button", { name: "Hide instructions" }).click();
  await expect(drawer).not.toHaveClass(/open/);
  await page.getByRole("button", { name: "Show instructions" }).click();
  await expect(drawer).toHaveClass(/open/);
});

test("the guide shows concepts, practices, docs, and the next lesson", async ({ page }) => {
  await page.goto("/lessons/03-selectors");
  const guide = page.locator("#lesson-instructions");
  await expect(guide.getByText("Role locators")).toBeVisible();
  await expect(guide.getByText("2. Icon-only button", { exact: true })).toBeVisible();
  await expect(guide.getByRole("link", { name: "Locators", exact: true })).toHaveAttribute("href", "https://playwright.dev/docs/locators");
  await expect(guide.getByRole("link", { name: "Continue to lesson 04 →" })).toHaveAttribute("href", "/lessons/04-forms");
});

test("practice progress is remembered", async ({ page }) => {
  await page.goto("/lessons/03-selectors");
  await page.locator("#lesson-instructions").getByRole("checkbox", { name: "Mark as done" }).first().check();
  await page.reload();
  await expect(page.locator("#lesson-instructions").getByRole("checkbox", { name: "Mark as done" }).first()).toBeChecked();
  await expect(page.getByRole("navigation", { name: "Lessons" }).getByLabel("1 of 3 practices done")).toBeVisible();
});

test("every lesson page and playground renders", async ({ page }) => {
  for (const lesson of lessons) {
    await page.goto(`/lessons/${lesson.id}`);
    await expect(page.getByRole("heading", { level: 1, name: lesson.title })).toBeVisible();
    if (lesson.target.startsWith("/play/")) {
      const response = await page.goto(lesson.target);
      expect(response?.status(), lesson.target).toBe(200);
    }
  }
});
