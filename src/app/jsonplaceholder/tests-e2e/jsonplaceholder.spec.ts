import { test, expect } from "@playwright/test";

import { JsonPlaceholderHubPage } from "./jsonplaceholder.page";

test.describe("/jsonplaceholder", () => {
  test("exibe o hub e abre a listagem de posts", async ({ page }) => {
    const hub = new JsonPlaceholderHubPage(page);
    await hub.goto();
    await expect(hub.hubHeading).toBeVisible();
    await hub.openPostListLink.click();
    await expect(page).toHaveURL(/\/jsonplaceholder\/postlist$/);
  });
});
