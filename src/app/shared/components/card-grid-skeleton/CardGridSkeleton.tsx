import { CardSkeleton } from "@/shared/components/card-skeleton/CardSkeleton";

export type CardGridSkeletonProps = {
  count: number;
  /** Quando a lista usa `Card` com rodapé (ex.: metadados do item). */
  showFooter?: boolean;
};

export function CardGridSkeleton({
  count,
  showFooter = false,
}: CardGridSkeletonProps) {
  return (
    <div role="status" aria-live="polite" aria-label="Carregando lista">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <CardSkeleton showFooter={showFooter} />
          </li>
        ))}
      </ul>
    </div>
  );
}
