"use client";

import { Card } from "@/shared/components/card/Card";
import { CardGridSkeleton } from "@/shared/components/card-grid-skeleton/CardGridSkeleton";
import { Pagination } from "@/shared/components/pagination/Pagination";

import { useCharacterList } from "./useCharacterList";

export function CharacterList() {
  const {
    characters,
    isPending,
    isError,
    errorMessage,
    page,
    totalPages,
    handlePageChange,
    skeletonCount,
  } = useCharacterList();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Rick and Morty — Personagens
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Dados da{" "}
          <span className="font-mono text-xs">rickandmortyapi.com</span>.
        </p>
      </header>

      {isPending ? <CardGridSkeleton count={skeletonCount} /> : null}
      {isError ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {characters ? (
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
      ) : null}

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
