"use client";

import { useQueryClient } from "@next-modular-arch/query/useQueryClient";
import { Suspense, useState } from "react";

import { CardGridSkeleton } from "@next-modular-arch/ui-data/card-grid-skeleton/CardGridSkeleton";
import { ErrorBoundary } from "@next-modular-arch/ui-errors/ErrorBoundary";

import { characterListConfig } from "../services/characterListConfig";
import { CharacterListContent } from "./CharacterListContent";
import { CharacterListErrorFallback } from "./CharacterListErrorFallback";

export function CharacterList() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

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

      <ErrorBoundary
        onReset={() => {
          void queryClient.resetQueries({
            queryKey: ["rick-and-morty", "characters"],
          });
        }}
        FallbackComponent={CharacterListErrorFallback}
      >
        <Suspense
          fallback={
            <CardGridSkeleton count={characterListConfig.pageSize} />
          }
        >
          <CharacterListContent page={page} onPageChange={setPage} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
