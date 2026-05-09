import { httpClient } from "@/shared/lib/http/httpClient";

import { pokemonListConfig } from "./pokemonListConfig";

const BASE = "https://pokeapi.co/api/v2";

type PokemonListApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
};

type PokemonListItem = {
  id: number;
  name: string;
  imageSrc: string;
};

function pokemonIdFromUrl(url: string): number {
  const segments = url.split("/").filter(Boolean);
  return Number(segments[segments.length - 1]);
}

function pokemonSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export async function listPokemonPage(
  page: number,
): Promise<{ items: PokemonListItem[]; totalPages: number }> {
  const offset = (page - 1) * pokemonListConfig.pageSize;
  const { data } = await httpClient.get<PokemonListApiResponse>(
    `${BASE}/pokemon`,
    {
      params: { offset, limit: pokemonListConfig.pageSize },
    },
  );

  const totalPages = Math.max(
    1,
    Math.ceil(data.count / pokemonListConfig.pageSize),
  );
  const items = data.results.map((entry) => {
    const id = pokemonIdFromUrl(entry.url);
    return {
      id,
      name: entry.name,
      imageSrc: pokemonSpriteUrl(id),
    };
  });

  return { items, totalPages };
}
