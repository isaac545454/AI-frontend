import { jsonplaceholderPluginManifest } from "./manifests/jsonplaceholder";
import { pokemonPluginManifest } from "./manifests/pokemon";
import { rickAndMortyPluginManifest } from "./manifests/rick-and-morty";
import type { PluginManifest } from "./plugin-manifest";

export const pluginManifests: readonly PluginManifest[] = [
  jsonplaceholderPluginManifest,
  rickAndMortyPluginManifest,
  pokemonPluginManifest,
];
