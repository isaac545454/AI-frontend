import { httpClient } from "@/shared/lib/http/httpClient";

const BASE = "https://rickandmortyapi.com/api";

export type CharacterSummary = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
};

export type CharacterListResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: CharacterSummary[];
};

export async function listCharacters(
  page: number,
): Promise<CharacterListResponse> {
  const { data } = await httpClient.get<CharacterListResponse>(
    `${BASE}/character`,
    {
      params: { page },
    },
  );
  return data;
}
