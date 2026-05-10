import type { Page } from "@playwright/test";

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  get mainHeading() {
    return this.page.getByRole("heading", {
      level: 1,
      name: "Módulos de exemplo",
    });
  }

  get jsonPlaceholderModuleLink() {
    return this.page.getByRole("link", { name: /JSONPlaceholder/ });
  }

  get rickAndMortyModuleLink() {
    return this.page.getByRole("link", { name: /The Rick and Morty API/ });
  }

  get pokeApiModuleLink() {
    return this.page.getByRole("link", { name: /PokéAPI/ });
  }
}
