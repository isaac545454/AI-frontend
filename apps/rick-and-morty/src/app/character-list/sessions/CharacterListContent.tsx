"use client";

import { useSuspenseQuery } from "@next-modular-arch/query/useSuspenseQuery";

import { Card } from "@next-modular-arch/ui-data/card/Card";
import { Pagination } from "@next-modular-arch/ui-data/pagination/Pagination";

import { mapCharacterListPage } from "../map/mapCharacterListPage";
import { listCharacters } from "../services/characterService";

function useCharacterList(page: number) {
  const { data } = useSuspenseQuery({
    queryKey: ["rick-and-morty", "characters", page],
    queryFn: () => listCharacters(page),
    select: mapCharacterListPage,
  });

  return data;
}

export function CharacterListContent({
  page,
  onPageChange,
}: {
  page: number;
  onPageChange: (page: number) => void;
}) {
  const { characters, totalPages } = useCharacterList(page);

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {characters.map((character) => (
          <li key={character.id}>
            <Card
              imageSrc={character.imageSrc}
              imageAlt={character.imageAlt}
              title={character.title}
              description={character.description}
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
