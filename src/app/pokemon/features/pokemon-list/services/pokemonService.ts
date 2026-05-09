import { httpClient } from "@/shared/lib/http/httpClient";

const BASE = "https://pokeapi.co/api/v2";

export type PokemonListApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
};

export type PokemonListItem = {
  id: number;
  name: string;
  imageSrc: string;
};

export const POKEMON_PAGE_SIZE = 20;

export function pokemonIdFromUrl(url: string): number {
  const segments = url.split("/").filter(Boolean);
  return Number(segments[segments.length - 1]);
}

export function pokemonSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export async function listPokemonPage(
  page: number,
): Promise<{ items: PokemonListItem[]; totalPages: number }> {
  const offset = (page - 1) * POKEMON_PAGE_SIZE;
  const { data } = await httpClient.get<PokemonListApiResponse>(
    `${BASE}/pokemon`,
    {
      params: { offset, limit: POKEMON_PAGE_SIZE },
    },
  );

  const totalPages = Math.max(1, Math.ceil(data.count / POKEMON_PAGE_SIZE));
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
