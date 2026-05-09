"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { mapPokemonListPage } from "./map/mapPokemonListPage";
import { listPokemonPage } from "./services/pokemonService";

export function usePokemonList() {
  const [page, setPage] = useState(1);

  const { data } = useSuspenseQuery({
    queryKey: ["pokeapi", "pokemon", page],
    queryFn: () => listPokemonPage(page),
    select: mapPokemonListPage,
  });

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  return {
    items: data.items,
    page,
    totalPages: data.totalPages,
    handlePageChange,
  };
}
