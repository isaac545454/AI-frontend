import { test, expect } from "@playwright/test";

import { RickAndMortyHubPage } from "./rick-and-morty.page";

test.describe("/rick-and-morty", () => {
  test("exibe o hub e abre a listagem de personagens", async ({ page }) => {
    const hub = new RickAndMortyHubPage(page);
    await hub.goto();
    await expect(hub.hubHeading).toBeVisible();
    await hub.openCharacterListLink.click();
    await expect(page).toHaveURL(/\/rick-and-morty\/character-list$/);
  });
});
