"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import { CardGridSkeleton } from "@/shared/components/card-grid-skeleton/CardGridSkeleton";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";

import { characterListConfig } from "../../services/characterListConfig";

import { CharacterListContent } from "./CharacterListContent";
import { CharacterListErrorFallback } from "./CharacterListErrorFallback";

export function CharacterList() {
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

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={CharacterListErrorFallback}
          >
            <Suspense
              fallback={
                <CardGridSkeleton count={characterListConfig.pageSize} />
              }
            >
              <CharacterListContent />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}
