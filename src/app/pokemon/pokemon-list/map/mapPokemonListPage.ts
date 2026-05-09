import type { listPokemonPage } from "../services/pokemonService";

type PokemonListPagePayload = Awaited<ReturnType<typeof listPokemonPage>>;

type PokemonListItemDto = {
  id: number;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
};

type PokemonListPageDto = {
  totalPages: number;
  items: PokemonListItemDto[];
};

export function mapPokemonListPage(
  data: PokemonListPagePayload,
): PokemonListPageDto {
  return {
    totalPages: data.totalPages,
    items: data.items.map((pokemon) => ({
      id: pokemon.id,
      imageSrc: pokemon.imageSrc,
      imageAlt: pokemon.name,
      title: pokemon.name.replace(/-/g, " "),
      description: `#${String(pokemon.id).padStart(4, "0")}`,
    })),
  };
}
