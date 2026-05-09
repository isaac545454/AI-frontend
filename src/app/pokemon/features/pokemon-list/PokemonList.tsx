"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import { Card } from "@/shared/components/card/Card";
import { CardGridSkeleton } from "@/shared/components/card-grid-skeleton/CardGridSkeleton";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";
import type { ErrorBoundaryFallbackProps } from "@/shared/components/error-boundary/ErrorBoundary";
import { Pagination } from "@/shared/components/pagination/Pagination";
import { QueryErrorFallback } from "@/shared/components/query-error-fallback/QueryErrorFallback";

import { POKEMON_PAGE_SIZE } from "./services/pokemonService";
import { usePokemonList } from "./usePokemonList";

function PokemonListErrorFallback(props: ErrorBoundaryFallbackProps) {
  return (
    <QueryErrorFallback
      title="Não foi possível carregar os Pokémon."
      {...props}
    />
  );
}

function PokemonListContent() {
  const { items, page, totalPages, handlePageChange } = usePokemonList();

  return (
    <>
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export function PokemonList() {
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

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={PokemonListErrorFallback}
          >
            <Suspense
              fallback={
                <CardGridSkeleton count={POKEMON_PAGE_SIZE} />
              }
            >
              <PokemonListContent />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}
