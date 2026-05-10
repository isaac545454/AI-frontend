import type { listCharacters } from "../services/characterService";
import { characterListConfig } from "../services/characterListConfig";

type CharacterListResponse = Awaited<ReturnType<typeof listCharacters>>;

type CharacterListItemDto = {
  id: number;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
};

type CharacterListPageDto = {
  totalPages: number;
  characters: CharacterListItemDto[];
};

export function mapCharacterListPage(
  data: CharacterListResponse,
): CharacterListPageDto {
  return {
    totalPages: Math.max(
      1,
      Math.ceil(data.info.count / characterListConfig.pageSize),
    ),
    characters: data.results.map((character) => ({
      id: character.id,
      imageSrc: character.image,
      imageAlt: character.name,
      title: character.name,
      description: `${character.status} · ${character.species}`,
    })),
  };
}
