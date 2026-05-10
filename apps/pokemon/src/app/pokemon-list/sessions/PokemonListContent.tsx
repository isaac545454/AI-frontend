"use client";

import { useSuspenseQuery } from "@next-modular-arch/query/useSuspenseQuery";

import { Card } from "@next-modular-arch/ui-data/card/Card";
import { Pagination } from "@next-modular-arch/ui-data/pagination/Pagination";

import { mapPokemonListPage } from "../map/mapPokemonListPage";
import { listPokemonPage } from "../services/pokemonService";

function usePokemonList(page: number) {
  const { data } = useSuspenseQuery({
    queryKey: ["pokeapi", "pokemon", page],
    queryFn: () => listPokemonPage(page),
    select: mapPokemonListPage,
  });

  return data;
}

export function PokemonListContent({
  page,
  onPageChange,
}: {
  page: number;
  onPageChange: (page: number) => void;
}) {
  const { items, totalPages } = usePokemonList(page);

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((pokemon) => (
          <li key={pokemon.id}>
            <Card
              imageSrc={pokemon.imageSrc}
              imageAlt={pokemon.imageAlt}
              title={pokemon.title}
              description={pokemon.description}
            />
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
