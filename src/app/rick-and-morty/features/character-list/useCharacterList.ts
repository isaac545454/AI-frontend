"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { mapCharacterListPage } from "./map/mapCharacterListPage";
import {
  CHARACTERS_PAGE_SIZE,
  listCharacters,
} from "./services/characterService";

export function useCharacterList() {
  const [page, setPage] = useState(1);

  const { data } = useSuspenseQuery({
    queryKey: ["rick-and-morty", "characters", page],
    queryFn: () => listCharacters(page),
    select: mapCharacterListPage,
  });

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  return {
    characters: data.characters,
    page,
    totalPages: data.totalPages,
    handlePageChange,
  };
}
