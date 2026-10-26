import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/10-keyboard-mouse");
});

test("practice 1: runs a command from the palette", async ({ page }) => {
  // page.keyboard has no element to auto-wait for: wait until the app listens.
  await expect(page.getByText("Keyboard shortcuts ready")).toBeVisible();
  await page.keyboard.press("ControlOrMeta+K");
  const command = page.getByRole("dialog", { name: "Command palette" }).getByLabel("Command");
  await command.fill("cart");
  await command.press("Enter");
  await expect(page.getByTestId("command-result")).toHaveText("Opened: Cart");
});

test("practice 2: shows a tooltip on hover", async ({ page }) => {
  await page.getByRole("button", { name: "About the Pro plan" }).hover();
  await expect(page.getByRole("tooltip")).toHaveText("Includes unlimited projects.");
});

test("practice 3: drags a card to Done", async ({ page }) => {
  const todo = page.getByRole("list", { name: "To do" });
  const done = page.getByRole("list", { name: "Done" });
  await todo.getByText("Write tests").dragTo(done);
  await expect(done.getByText("Write tests")).toBeVisible();
  await expect(todo.getByText("Write tests")).toHaveCount(0);
});
