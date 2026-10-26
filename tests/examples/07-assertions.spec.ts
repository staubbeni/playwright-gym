import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/play/07-assertions");
});

test("practice 1: enables notifications", async ({ page }) => {
  const checkbox = page.getByRole("checkbox", { name: "Enable notifications" });
  await checkbox.check();
  await expect(checkbox).toBeChecked();
  await expect(page.getByTestId("notification-status")).toHaveText("Notifications enabled.");
});

test("practice 2: save is disabled until the name is valid", async ({ page }) => {
  const save = page.getByRole("button", { name: "Save profile" });
  const name = page.getByLabel("Display name");

  await expect(save).toBeDisabled();
  await name.fill("Ada");
  await expect(name).toHaveValue("Ada");
  await expect(save).toBeEnabled();
  await save.click();
  await expect(page.getByTestId("profile-status")).toHaveText("Profile saved for Ada.");
});

test("practice 3: tags are listed in order", async ({ page }) => {
  for (const tag of ["playwright", "testing", "qa"]) {
    await page.getByLabel("New tag").fill(tag);
    await page.getByRole("button", { name: "Add tag" }).click();
  }
  const tags = page.getByRole("list", { name: "Tags" }).getByRole("listitem");
  await expect.soft(tags).toHaveCount(3);
  await expect.soft(tags).toHaveText(["playwright", "testing", "qa"]);
  await expect.soft(page.getByTestId("tag-count")).toHaveText("3 tags");
});
