import type { Locator, Page } from "@playwright/test";

export class CharacterListPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/rick-and-morty/character-list");
  }

  get listHeading() {
    return this.page.getByRole("heading", {
      level: 1,
      name: "Rick and Morty — Personagens",
    });
  }

  get articleCards() {
    return this.page.getByRole("article");
  }

  private get paginationNav(): Locator {
    return this.page.getByRole("navigation", { name: "Paginação" });
  }

  get previousPageButton() {
    return this.paginationNav.getByRole("button", { name: "Anterior" });
  }

  get nextPageButton() {
    return this.paginationNav.getByRole("button", { name: "Próxima" });
  }

  get pageStatusText() {
    return this.paginationNav.getByText(/Página \d+ de \d+/);
  }

  async goToNextPage() {
    await this.nextPageButton.scrollIntoViewIfNeeded();
    await this.nextPageButton.click({ force: true });
  }

  async goToPreviousPage() {
    await this.previousPageButton.scrollIntoViewIfNeeded();
    await this.previousPageButton.click({ force: true });
  }
}
