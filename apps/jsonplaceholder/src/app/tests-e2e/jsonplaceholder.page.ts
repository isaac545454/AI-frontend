import type { Page } from "@playwright/test";

export class JsonPlaceholderHubPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/jsonplaceholder");
  }

  get hubHeading() {
    return this.page.getByRole("heading", {
      level: 1,
      name: "JSONPlaceholder",
    });
  }

  get openPostListLink() {
    return this.page.getByRole("link", { name: /Abrir lista de posts/i });
  }
}
