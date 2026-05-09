import type { CharacterListResponse } from "../services/characterService";

export type CharacterListItemDto = {
  id: number;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
};

export type CharacterListPageDto = {
  totalPages: number;
  characters: CharacterListItemDto[];
};

export function mapCharacterListPage(
  data: CharacterListResponse,
): CharacterListPageDto {
  return {
    totalPages: data.info.pages,
    characters: data.results.map((character) => ({
      id: character.id,
      imageSrc: character.image,
      imageAlt: character.name,
      title: character.name,
      description: `${character.status} · ${character.species}`,
    })),
  };
}
