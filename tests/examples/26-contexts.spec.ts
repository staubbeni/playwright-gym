import { expect, test } from "@playwright/test";

async function saveNote(page: import("@playwright/test").Page, text: string) {
  await page.goto("/play/26-contexts");
  await page.getByLabel("Session note").fill(text);
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(page.getByTestId("saved-note")).toHaveText(`Saved note: ${text}`);
}

test("practice 1: a saved note survives a reload", async ({ page }) => {
  await saveNote(page, "hello");
  await page.reload();
  await expect(page.getByTestId("saved-note")).toHaveText("Saved note: hello");
});

test("practice 2: another context cannot see the note", async ({ page, browser }) => {
  await saveNote(page, "hello");

  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await otherPage.goto("/play/26-contexts");
  await expect(otherPage.getByTestId("saved-note")).toHaveText("No saved note.");
  await other.close();
});

test("practice 3: two users share the roster but not the sign-in", async ({ page, browser }) => {
  const teammate = `mate-${test.info().testId}-${Date.now()}`;
  await page.goto("/play/26-contexts");
  await page.getByLabel("Your name").fill("Ada");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByTestId("whoami")).toHaveText("Signed in as Ada");

  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await otherPage.goto("/play/26-contexts");
  await expect(otherPage.getByTestId("whoami")).toHaveText("Not signed in");

  await page.getByLabel("Teammate").fill(teammate);
  await page.getByRole("button", { name: "Add teammate" }).click();
  await expect(page.getByRole("list", { name: "Roster" }).getByText(teammate, { exact: true })).toBeVisible();

  await otherPage.reload();
  await expect(otherPage.getByRole("list", { name: "Roster" }).getByText(teammate, { exact: true })).toBeVisible();
  await expect(otherPage.getByTestId("whoami")).toHaveText("Not signed in");
  await other.close();
});
