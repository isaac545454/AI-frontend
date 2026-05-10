export function PokemonHubHeader() {
  return (
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
        PokéAPI
      </h1>
      <p className="text-sm text-[var(--color-muted)]">
        Pokémon com sprites do repositório oficial — listagem na rota dedicada.
      </p>
    </header>
  );
}
