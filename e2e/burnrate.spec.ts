import { test, expect } from "@playwright/test";

test("happy path flows on single page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start meeting" }).click();
  await expect(page.getByText("Total cost")).toBeVisible();

  const pauseButton = page.getByRole("button", { name: /pause/i });
  await expect(pauseButton).toBeVisible();
  await pauseButton.click();
  await expect(page.getByRole("button", { name: /resume/i })).toBeVisible();

  await page.getByRole("button", { name: /stop & recap/i }).click();
  await expect(page.getByRole("button", { name: /start new session/i })).toBeVisible();
});
