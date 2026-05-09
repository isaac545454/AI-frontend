"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { listPokemonPage, POKEMON_PAGE_SIZE } from "./services/pokemonService";

export function usePokemonList() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["pokeapi", "pokemon", page],
    queryFn: () => listPokemonPage(page),
  });

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const errorMessage =
    error instanceof Error ? error.message : "Erro ao carregar dados.";

  const totalPages = data?.totalPages ?? 1;

  const items = useMemo(() => {
    if (!data) return null;
    return data.items.map((pokemon) => ({
      id: pokemon.id,
      imageSrc: pokemon.imageSrc,
      imageAlt: pokemon.name,
      title: pokemon.name.replace(/-/g, " "),
      description: `#${String(pokemon.id).padStart(4, "0")}`,
    }));
  }, [data]);

  return {
    items,
    isPending,
    isError,
    errorMessage,
    page,
    totalPages,
    handlePageChange,
    skeletonCount: POKEMON_PAGE_SIZE,
  };
}
