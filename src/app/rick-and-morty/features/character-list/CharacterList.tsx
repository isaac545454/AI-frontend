"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Card } from "@/shared/components/card/Card";
import { Pagination } from "@/shared/components/pagination/Pagination";

import { listCharacters } from "./services/characterService";

export function CharacterList() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["rick-and-morty", "characters", page],
    queryFn: () => listCharacters(page),
  });

  const totalPages = data?.info.pages ?? 1;

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

      {isPending ? (
        <p className="text-sm text-[var(--color-muted)]">Carregando…</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error instanceof Error ? error.message : "Erro ao carregar dados."}
        </p>
      ) : null}

      {data ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.results.map((character) => (
            <li key={character.id}>
              <Card
                imageSrc={character.image}
                imageAlt={character.name}
                title={character.name}
                description={`${character.status} · ${character.species}`}
              />
            </li>
          ))}
        </ul>
      ) : null}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
