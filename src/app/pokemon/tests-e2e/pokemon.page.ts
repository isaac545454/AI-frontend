import type { Page } from "@playwright/test";

export class PokemonHubPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/pokemon");
  }

  get hubHeading() {
    return this.page.getByRole("heading", { level: 1, name: "PokéAPI" });
  }

  get openPokemonListLink() {
    return this.page.getByRole("link", {
      name: /Abrir lista de Pokémon/i,
    });
  }
}
