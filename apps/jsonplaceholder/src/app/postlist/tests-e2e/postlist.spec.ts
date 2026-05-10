import { test, expect } from "@playwright/test";

import { PostListPage } from "./postlist.page";

test.describe("/jsonplaceholder/postlist", () => {
  test("carrega a primeira página de posts com grade paginada", async ({
    page,
  }) => {
    const postList = new PostListPage(page);
    await postList.goto();
    await expect(postList.listHeading).toBeVisible();
    await expect(postList.articleCards.first()).toBeVisible();
    await expect(postList.articleCards).toHaveCount(12);
    await expect(postList.pageStatusText).toHaveText(/Página 1 de \d+/);
  });

  test("paginação: avança para a página 2 e volta para a 1", async ({
    page,
  }) => {
    const postList = new PostListPage(page);
    await postList.goto();
    await expect(postList.previousPageButton).toBeDisabled();
    await expect(postList.pageStatusText).toHaveText(/Página 1 de/);

    await postList.goToNextPage();
    await expect(postList.pageStatusText).toHaveText(/Página 2 de/, {
      timeout: 25_000,
    });
    await expect(postList.previousPageButton).toBeEnabled();

    await postList.goToPreviousPage();
    await expect(postList.pageStatusText).toHaveText(/Página 1 de/, {
      timeout: 25_000,
    });
    await expect(postList.previousPageButton).toBeDisabled();
  });
});
