import type { Page } from "@playwright/test";

export class RickAndMortyHubPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/rick-and-morty");
  }

  get hubHeading() {
    return this.page.getByRole("heading", {
      level: 1,
      name: "The Rick and Morty API",
    });
  }

  get openCharacterListLink() {
    return this.page.getByRole("link", {
      name: /Abrir lista de personagens/i,
    });
  }
}
