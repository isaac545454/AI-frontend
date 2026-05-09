"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import { Card } from "@/shared/components/card/Card";
import { CardGridSkeleton } from "@/shared/components/card-grid-skeleton/CardGridSkeleton";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";
import type { ErrorBoundaryFallbackProps } from "@/shared/components/error-boundary/ErrorBoundary";
import { Pagination } from "@/shared/components/pagination/Pagination";
import { QueryErrorFallback } from "@/shared/components/query-error-fallback/QueryErrorFallback";

import { characterListConfig } from "../../services/characterListConfig";
import { useCharacterList } from "./useCharacterList";

function CharacterListErrorFallback(props: ErrorBoundaryFallbackProps) {
  return (
    <QueryErrorFallback
      title="Não foi possível carregar os personagens."
      {...props}
    />
  );
}

function CharacterListContent() {
  const { characters, page, totalPages, handlePageChange } =
    useCharacterList();

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
        onPageChange={handlePageChange}
      />
    </>
  );
}

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
              fallback={<CardGridSkeleton count={characterListConfig.pageSize} />}
            >
              <CharacterListContent />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}
