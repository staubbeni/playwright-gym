import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/23-accessibility");
});

test("practice 1: the main navigation has named links", async ({ page }) => {
  await expect(page.getByRole("navigation", { name: "Main" })).toMatchAriaSnapshot(`
    - navigation "Main":
      - link "Home"
      - link "Shop"
      - link "Account"
  `);
});

test("practice 2: the newsletter dialog manages focus", async ({ page }) => {
  await page.getByRole("button", { name: "Subscribe to newsletter" }).click();
  const dialog = page.getByRole("dialog", { name: "Newsletter" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Email")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("practice 3: errors are announced with the input", async ({ page }) => {
  await page.getByRole("button", { name: "Send message" }).click();
  const email = page.getByLabel("Contact email");
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription("Contact email is required.");
});
