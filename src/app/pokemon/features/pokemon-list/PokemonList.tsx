"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Card } from "@/shared/components/card/Card";
import { Pagination } from "@/shared/components/pagination/Pagination";

import { listPokemonPage } from "./services/pokemonService";

export function PokemonList() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["pokeapi", "pokemon", page],
    queryFn: () => listPokemonPage(page),
  });

  const totalPages = data?.totalPages ?? 1;

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
          {data.items.map((pokemon) => (
            <li key={pokemon.id}>
              <Card
                imageSrc={pokemon.imageSrc}
                imageAlt={pokemon.name}
                title={pokemon.name.replace(/-/g, " ")}
                description={`#${String(pokemon.id).padStart(4, "0")}`}
              />
            </li>
          ))}
        </ul>
      ) : null}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
