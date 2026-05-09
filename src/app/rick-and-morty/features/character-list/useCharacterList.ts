"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import {
  CHARACTERS_PAGE_SIZE,
  listCharacters,
} from "./services/characterService";

export function useCharacterList() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["rick-and-morty", "characters", page],
    queryFn: () => listCharacters(page),
  });

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const errorMessage =
    error instanceof Error ? error.message : "Erro ao carregar dados.";

  const totalPages = data?.info.pages ?? 1;

  const characters = useMemo(() => {
    if (!data) return null;
    return data.results.map((character) => ({
      id: character.id,
      imageSrc: character.image,
      imageAlt: character.name,
      title: character.name,
      description: `${character.status} · ${character.species}`,
    }));
  }, [data]);

  return {
    characters,
    isPending,
    isError,
    errorMessage,
    page,
    totalPages,
    handlePageChange,
    skeletonCount: CHARACTERS_PAGE_SIZE,
  };
}
