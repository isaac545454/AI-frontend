import { httpClient } from "@next-modular-arch/http/httpClient";

import { characterListConfig } from "./characterListConfig";

const BASE = "https://rickandmortyapi.com/api";

/** A API REST devolve até 20 documentos por página (sem parâmetro de limite). */
const RICK_AND_MORTY_API_PAGE_SIZE = 20;

type CharacterSummary = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
};

type CharacterListResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: CharacterSummary[];
};

async function fetchCharacterApiPage(
  apiPage: number,
): Promise<CharacterListResponse> {
  const { data } = await httpClient.get<CharacterListResponse>(
    `${BASE}/character`,
    {
      params: { page: apiPage },
    },
  );
  return data;
}

export async function listCharacters(
  appPage: number,
): Promise<CharacterListResponse> {
  const pageSize = characterListConfig.pageSize;
  const start = (appPage - 1) * pageSize;
  const firstApiPage = Math.floor(start / RICK_AND_MORTY_API_PAGE_SIZE) + 1;
  const end = start + pageSize;
  const lastApiPage =
    Math.floor(Math.max(0, end - 1) / RICK_AND_MORTY_API_PAGE_SIZE) + 1;

  if (firstApiPage === lastApiPage) {
    const data = await fetchCharacterApiPage(firstApiPage);
    const sliceStart = start % RICK_AND_MORTY_API_PAGE_SIZE;
    return {
      info: data.info,
      results: data.results.slice(sliceStart, sliceStart + pageSize),
    };
  }

  const [first, last] = await Promise.all([
    fetchCharacterApiPage(firstApiPage),
    fetchCharacterApiPage(lastApiPage),
  ]);

  const fromFirst = first.results.slice(
    start % RICK_AND_MORTY_API_PAGE_SIZE,
  );
  const need = pageSize - fromFirst.length;
  const fromLast = last.results.slice(0, need);

  return {
    info: first.info,
    results: [...fromFirst, ...fromLast],
  };
}
