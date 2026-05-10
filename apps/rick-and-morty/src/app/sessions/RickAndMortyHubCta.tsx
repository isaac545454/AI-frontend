import Link from "next/link";

export function RickAndMortyHubCta() {
  return (
    <Link
      href="/character-list"
      className="inline-flex w-fit rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-zinc-500 hover:shadow-sm"
    >
      Abrir lista de personagens
    </Link>
  );
}
