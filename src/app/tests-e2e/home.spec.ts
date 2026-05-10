import { test, expect } from "@playwright/test";

import { HomePage } from "./home.page";

test.describe("Home /", () => {
  test("exibe o título e os três módulos", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.mainHeading).toBeVisible();
    await expect(home.jsonPlaceholderModuleLink).toBeVisible();
    await expect(home.rickAndMortyModuleLink).toBeVisible();
    await expect(home.pokeApiModuleLink).toBeVisible();
  });

  test("navega para a listagem JSONPlaceholder", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.jsonPlaceholderModuleLink.click();
    await expect(page).toHaveURL(/\/jsonplaceholder\/postlist$/);
  });

  test("navega para a listagem Rick and Morty", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.rickAndMortyModuleLink.click();
    await expect(page).toHaveURL(/\/rick-and-morty\/character-list$/);
  });

  test("navega para a listagem PokéAPI", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.pokeApiModuleLink.click();
    await expect(page).toHaveURL(/\/pokemon\/pokemon-list$/);
  });
});
