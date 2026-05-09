export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-4 ${className ?? ""}`}
      aria-label="Paginação"
    >
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(page - 1)}
        className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors enabled:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:enabled:hover:bg-zinc-900"
      >
        Anterior
      </button>
      <span className="text-sm tabular-nums text-[var(--color-muted)]">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        disabled={!canNext}
        onClick={() => canNext && onPageChange(page + 1)}
        className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors enabled:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:enabled:hover:bg-zinc-900"
      >
        Próxima
      </button>
    </nav>
  );
}
