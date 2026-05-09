export type CardSkeletonProps = {
  showFooter?: boolean;
};

export function CardSkeleton({ showFooter }: CardSkeletonProps) {
  return (
    <article
      className="flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm"
      aria-hidden
    >
      <div className="relative aspect-[16/10] w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-5 w-4/5 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-2/3 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>
        {showFooter ? (
          <div className="mt-auto pt-2">
            <div className="h-3 w-1/2 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ) : null}
      </div>
    </article>
  );
}
