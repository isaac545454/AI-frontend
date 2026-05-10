"use client";

import { useQueryClient } from "@next-modular-arch/query/useQueryClient";
import { Suspense, useState } from "react";

import { CardGridSkeleton } from "@next-modular-arch/ui-data/card-grid-skeleton/CardGridSkeleton";
import { ErrorBoundary } from "@next-modular-arch/ui-errors/ErrorBoundary";

import { pokemonListConfig } from "../services/pokemonListConfig";
import { PokemonListContent } from "./PokemonListContent";
import { PokemonListErrorFallback } from "./PokemonListErrorFallback";

export function PokemonList() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

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

      <ErrorBoundary
        onReset={() => {
          void queryClient.resetQueries({ queryKey: ["pokeapi", "pokemon"] });
        }}
        FallbackComponent={PokemonListErrorFallback}
      >
        <Suspense
          fallback={<CardGridSkeleton count={pokemonListConfig.pageSize} />}
        >
          <PokemonListContent page={page} onPageChange={setPage} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
