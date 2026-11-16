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
  const trigger = page.getByRole("button", { name: "Subscribe to newsletter" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Newsletter" });
  await expect(dialog.getByLabel("Email")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("practice 3: errors are announced with the input", async ({ page }) => {
  await page.getByRole("button", { name: "Send message" }).click();
  // Next.js adds its own empty alert region, so pick ours by its text.
  await expect(page.getByRole("alert").filter({ hasText: "Contact email is required." })).toBeVisible();
  await expect(page.getByRole("alert").filter({ hasText: "at least 10 characters" })).toBeVisible();
  const email = page.getByLabel("Contact email");
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription("Contact email is required.");
  const message = page.getByLabel("Your message");
  await expect(message).toHaveAttribute("aria-invalid", "true");
  await expect(message).toHaveAccessibleDescription("Message must be at least 10 characters.");
});
