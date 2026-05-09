import Link from "next/link";

export default function PokemonPage() {
  return (
    <div className="mx-auto flex min-h-[40vh] w-full max-w-3xl flex-col justify-center gap-6 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
          PokéAPI
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Pokémon com sprites do repositório oficial — listagem na rota dedicada.
        </p>
      </header>
      <Link
        href="/pokemon/pokemon-list"
        className="inline-flex w-fit rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-zinc-400 hover:shadow-sm dark:hover:border-zinc-600"
      >
        Abrir lista de Pokémon
      </Link>
    </div>
  );
}
