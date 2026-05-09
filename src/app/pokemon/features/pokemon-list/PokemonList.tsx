"use client";

import { Card } from "@/shared/components/card/Card";
import { CardGridSkeleton } from "@/shared/components/card-grid-skeleton/CardGridSkeleton";
import { Pagination } from "@/shared/components/pagination/Pagination";

import { usePokemonList } from "./usePokemonList";

export function PokemonList() {
  const {
    items,
    isPending,
    isError,
    errorMessage,
    page,
    totalPages,
    handlePageChange,
    skeletonCount,
  } = usePokemonList();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
          PokéAPI — Pokémon
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Sprites via{" "}
          <span className="font-mono text-xs">pokeapi.co</span> / sprites PNG do
          repositório oficial.
        </p>
      </header>

      {isPending ? <CardGridSkeleton count={skeletonCount} /> : null}
      {isError ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {items ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((pokemon) => (
            <li key={pokemon.id}>
              <Card
                imageSrc={pokemon.imageSrc}
                imageAlt={pokemon.imageAlt}
                title={pokemon.title}
                description={pokemon.description}
              />
            </li>
          ))}
        </ul>
      ) : null}

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
