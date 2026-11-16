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

test("practice 2: shows and dismisses the tooltip", async ({ page }) => {
  const info = page.getByRole("button", { name: "About the Pro plan" });
  const tooltip = page.getByRole("tooltip");

  await info.hover();
  await expect(tooltip).toHaveText("Includes unlimited projects.");

  await page.mouse.move(0, 0);
  await expect(tooltip).toBeHidden();

  await info.hover();
  await expect(tooltip).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(tooltip).toBeHidden();
});

test("practice 3: drags a card and uses the move menus", async ({ page }) => {
  const todo = page.getByRole("list", { name: "To do" });
  const review = page.getByRole("list", { name: "In review" });
  const done = page.getByRole("list", { name: "Done" });

  // Drag handlers exist only after hydration.
  await expect(page.getByText("Keyboard shortcuts ready")).toBeVisible();
  await todo.getByText("Write tests").dragTo(done);
  await expect(done.getByText("Write tests")).toBeVisible();
  await expect(todo.getByText("Write tests")).toHaveCount(0);

  const moveCard = async (card: string, target: string) => {
    await page.getByLabel("Card").selectOption(card);
    await page.getByLabel("Move to").selectOption(target);
    await page.getByRole("button", { name: "Move card" }).click();
  };
  await moveCard("Review PR", "In review");
  await expect(review.getByText("Review PR")).toBeVisible();
  await expect(todo.getByText("Review PR")).toHaveCount(0);

  // Cards only move forward.
  await moveCard("Write tests", "To do");
  await expect(done.getByText("Write tests")).toBeVisible();
  await expect(todo.getByText("Write tests")).toHaveCount(0);
});
