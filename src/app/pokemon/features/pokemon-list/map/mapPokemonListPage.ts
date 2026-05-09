import { listPokemonPage } from "../services/pokemonService";

export type PokemonListPagePayload = Awaited<
  ReturnType<typeof listPokemonPage>
>;

export type PokemonListItemDto = {
  id: number;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
};

export type PokemonListPageDto = {
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
