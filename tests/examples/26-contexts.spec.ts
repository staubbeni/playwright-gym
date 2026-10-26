import { expect, test } from "@playwright/test";

test("practice 1: a saved note survives a reload", async ({ page }) => {
  await page.goto("/play/26-contexts");
  await page.getByLabel("Session note").fill("hello");
  await page.getByRole("button", { name: "Save note" }).click();
  await page.reload();
  await expect(page.getByTestId("saved-note")).toHaveText("Saved note: hello");
});

test("practice 2: another context cannot see the note", async ({ page, browser }) => {
  await page.goto("/play/26-contexts");
  await page.getByLabel("Session note").fill("hello");
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(page.getByTestId("saved-note")).toHaveText("Saved note: hello");

  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await otherPage.goto("/play/26-contexts");
  await expect(otherPage.getByTestId("saved-note")).toHaveText("No saved note.");
  await other.close();
});

test("practice 3: a login does not leak to a guest", async ({ page, browser }) => {
  await page.request.post("/api/shop/login", { data: { username: "student", password: "playwright" } });

  const guest = await browser.newContext();
  const guestPage = await guest.newPage();
  await guestPage.goto("/shop/account");
  await expect(guestPage).toHaveURL(/\/shop\/login/);

  await page.goto("/shop/account");
  await expect(page.getByText("Signed in as student")).toBeVisible();
  await guest.close();
});
