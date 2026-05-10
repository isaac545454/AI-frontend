import Link from "next/link";

export default function JsonPlaceholderPage() {
  return (
    <div className="mx-auto flex min-h-[40vh] w-full max-w-3xl flex-col justify-center gap-6 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
          JSONPlaceholder
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Posts com imagens estáticas (Picsum) por ID — listagem na rota dedicada.
        </p>
      </header>
      <Link
        href="/jsonplaceholder/postlist"
        className="inline-flex w-fit rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-zinc-500 hover:shadow-sm"
      >
        Abrir lista de posts
      </Link>
    </div>
  );
}
