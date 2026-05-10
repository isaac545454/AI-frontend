import { test, expect } from "@playwright/test";

import { CharacterListPage } from "./character-list.page";

test.describe("/rick-and-morty/character-list", () => {
  test("carrega a primeira página de personagens com grade paginada", async ({
    page,
  }) => {
    const characterList = new CharacterListPage(page);
    await characterList.goto();
    await expect(characterList.listHeading).toBeVisible();
    await expect(characterList.articleCards.first()).toBeVisible();
    await expect(characterList.articleCards).toHaveCount(12);
    await expect(characterList.pageStatusText).toHaveText(/Página 1 de \d+/);
  });

  test("paginação: avança para a página 2 e volta para a 1", async ({
    page,
  }) => {
    const characterList = new CharacterListPage(page);
    await characterList.goto();
    await expect(characterList.previousPageButton).toBeDisabled();

    await characterList.goToNextPage();
    await expect(characterList.pageStatusText).toHaveText(/Página 2 de/, {
      timeout: 25_000,
    });
    await expect(characterList.previousPageButton).toBeEnabled();

    await characterList.goToPreviousPage();
    await expect(characterList.pageStatusText).toHaveText(/Página 1 de/, {
      timeout: 25_000,
    });
    await expect(characterList.previousPageButton).toBeDisabled();
  });
});
