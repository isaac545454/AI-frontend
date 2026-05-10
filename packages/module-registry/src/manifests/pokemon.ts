import type { PluginManifest } from "../plugin-manifest";

export const pokemonPluginManifest = {
  id: "pokemon",
  basePath: "/pokemon",
  displayName: "PokéAPI",
  description: "Pokémon com sprites do repositório oficial.",
  homeHref: "/pokemon/pokemon-list",
} satisfies PluginManifest;
