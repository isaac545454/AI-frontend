import type { PluginManifest } from "../plugin-manifest";

export const rickAndMortyPluginManifest = {
  id: "rick-and-morty",
  basePath: "/rick-and-morty",
  displayName: "The Rick and Morty API",
  description: "Personagens com arte oficial da API.",
  homeHref: "/rick-and-morty/character-list",
} satisfies PluginManifest;
