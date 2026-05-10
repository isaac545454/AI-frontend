import { test, expect } from "@playwright/test";

import { PokemonHubPage } from "./pokemon.page";

test.describe("/pokemon", () => {
  test("exibe o hub e abre a listagem de Pokémon", async ({ page }) => {
    const hub = new PokemonHubPage(page);
    await hub.goto();
    await expect(hub.hubHeading).toBeVisible();
    await hub.openPokemonListLink.click();
    await expect(page).toHaveURL(/\/pokemon\/pokemon-list$/);
  });
});
