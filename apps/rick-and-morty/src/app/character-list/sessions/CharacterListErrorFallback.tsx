"use client";

import { QueryErrorFallback } from "@next-modular-arch/ui-data/query-error-fallback/QueryErrorFallback";
import type { ErrorBoundaryFallbackProps } from "@next-modular-arch/ui-errors/ErrorBoundary";

export function CharacterListErrorFallback(
  props: ErrorBoundaryFallbackProps,
) {
  return (
    <QueryErrorFallback
      title="Não foi possível carregar os personagens."
      {...props}
    />
  );
}
