import type { PluginManifest } from "../plugin-manifest";

export const jsonplaceholderPluginManifest = {
  id: "jsonplaceholder",
  basePath: "/jsonplaceholder",
  displayName: "JSONPlaceholder",
  description: "Posts com imagens estáticas (Picsum) por ID.",
  homeHref: "/jsonplaceholder/postlist",
} satisfies PluginManifest;
