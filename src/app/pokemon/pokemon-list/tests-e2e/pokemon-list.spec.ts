import { test, expect } from "@playwright/test";

import { PokemonListPage } from "./pokemon-list.page";

test.describe("/pokemon/pokemon-list", () => {
  test("carrega a primeira página da PokéAPI com grade paginada", async ({
    page,
  }) => {
    const pokemonList = new PokemonListPage(page);
    await pokemonList.goto();
    await expect(pokemonList.listHeading).toBeVisible();
    await expect(pokemonList.articleCards.first()).toBeVisible();
    await expect(pokemonList.articleCards).toHaveCount(12);
    await expect(pokemonList.pageStatusText).toHaveText(/Página 1 de \d+/);
  });

  test("paginação: avança para a página 2 e volta para a 1", async ({
    page,
  }) => {
    const pokemonList = new PokemonListPage(page);
    await pokemonList.goto();
    await expect(pokemonList.previousPageButton).toBeDisabled();

    await pokemonList.goToNextPage();
    await expect(pokemonList.pageStatusText).toHaveText(/Página 2 de/, {
      timeout: 25_000,
    });
    await expect(pokemonList.previousPageButton).toBeEnabled();

    await pokemonList.goToPreviousPage();
    await expect(pokemonList.pageStatusText).toHaveText(/Página 1 de/, {
      timeout: 25_000,
    });
    await expect(pokemonList.previousPageButton).toBeDisabled();
  });
});
